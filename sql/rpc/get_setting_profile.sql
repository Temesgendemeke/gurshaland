CREATE OR REPLACE FUNCTION get_setting_profile(_profile_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    result jsonb;
    auth_avatar text;
BEGIN
    SELECT COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', u.raw_user_meta_data->>'avatar')
    INTO auth_avatar
    FROM auth.users u
    WHERE u.id = _profile_id;

    SELECT jsonb_build_object(
        'id', p.id,
        'image', COALESCE(
            (
                SELECT to_jsonb(pi)
                FROM profile_image pi
                WHERE pi.profile_id = p.id
                ORDER BY pi.id DESC
                LIMIT 1
            ),
            CASE WHEN auth_avatar IS NOT NULL THEN
                jsonb_build_object('url', auth_avatar)
            ELSE NULL END
        ),
        'avatar', COALESCE(
            (SELECT pi.url FROM profile_image pi WHERE pi.profile_id = p.id ORDER BY pi.id DESC LIMIT 1),
            auth_avatar
        ),
        'avatar_url', COALESCE(
            (SELECT pi.url FROM profile_image pi WHERE pi.profile_id = p.id ORDER BY pi.id DESC LIMIT 1),
            auth_avatar
        ),
        'full_name', p.full_name,
        'username', p.username,
        'bio', p.bio
    )
    INTO result
    FROM profile p
    WHERE p.id = _profile_id;

    RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_setting_profile(uuid) TO authenticated, anon;
