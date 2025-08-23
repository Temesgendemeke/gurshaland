CREATE OR REPLACE FUNCTION get_setting_profile(_profile_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'id', p.id,
        'image', (
            SELECT to_jsonb(pi)
            FROM profile_image pi
            WHERE pi.profile_id = p.id
            ORDER BY pi.id DESC
            LIMIT 1
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
