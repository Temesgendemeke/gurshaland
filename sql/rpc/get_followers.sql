CREATE OR REPLACE FUNCTION get_followers(_profile_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'username', p.username,
          'full_name', p.full_name,
          'avatar', COALESCE(
            NULLIF(pi.url, ''),
            NULLIF(COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', u.raw_user_meta_data->>'avatar'), '')
          ),
          'avatar_url', COALESCE(
            NULLIF(pi.url, ''),
            NULLIF(COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', u.raw_user_meta_data->>'avatar'), '')
          ),
          'followed_since', f.created_at,
          'like', (
            (SELECT COUNT(*) FROM recipe_like rl WHERE rl.liked_by = f.follower_id) +
            (SELECT COUNT(*) FROM blog_like bl WHERE bl.liked_by = f.follower_id)
          ),
          'comments', (
            (SELECT COUNT(*) FROM recipe_comment rc WHERE rc.author_id = f.follower_id) +
            (SELECT COUNT(*) FROM blog_comment bc WHERE bc.user_id = f.follower_id)
          )
        )
      ),
      '[]'::jsonb
    )
    FROM follower f
    JOIN profile p ON p.id = f.follower_id
    -- 1. Check profile_image FIRST
    LEFT JOIN LATERAL (
      SELECT pi.url
      FROM profile_image pi
      WHERE pi.profile_id = p.id
      ORDER BY pi.id DESC
      LIMIT 1
    ) pi ON true
    -- 2. Check Supabase Auth user metadata SECOND
    LEFT JOIN auth.users u ON u.id = p.id
    WHERE f.profile_id = _profile_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION get_followers(uuid) TO authenticated, anon;