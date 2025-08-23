CREATE OR REPLACE FUNCTION get_followers(_profile_id uuid)
RETURNS jsonb
LANGUAGE sql
AS $$
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'username', p.username,
        'followed_since', f.created_at,
        'like', (
          (SELECT COUNT(*) FROM recipe_like rl WHERE rl.liked_by  = f.follower_id) +
          (SELECT COUNT(*) FROM blog_like  bl WHERE bl.user_id    = f.follower_id)
        ),
        'comments', (
          (SELECT COUNT(*) FROM recipe_comment rc WHERE rc.user_id = f.follower_id) +
          (SELECT COUNT(*) FROM blog_comment  bc WHERE bc.user_id  = f.follower_id)
        )
      )
    ),
    '[]'::jsonb
  )
  FROM follower f
  JOIN profile p ON p.id = f.follower_id
  WHERE f.profile_id = _profile_id;
$$;