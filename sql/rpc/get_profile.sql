CREATE OR REPLACE FUNCTION get_profile_by_username(_username TEXT)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
   profile_res jsonb;
BEGIN
   SELECT jsonb_build_object(
      'id', p.id,
      'username', p.username,
      'full_name', p.full_name,
      'recipes', (
         SELECT COALESCE(jsonb_agg(to_jsonb(r)), '[]'::jsonb)
         FROM recipe r
         WHERE r.author_id = p.id
      ),
      'followers', (
         SELECT count(*)
         FROM follower f
         WHERE f.profile_id = p.id
      ),
      'blogs', (
         SELECT COALESCE(jsonb_agg(to_jsonb(b)), '[]'::jsonb)
         FROM blog b
         WHERE b.author_id = p.id
      ),
      'following', (
         SELECT COALESCE(jsonb_agg(to_jsonb(f2)), '[]'::jsonb)
         FROM follower f2
         WHERE f2.follower_id = p.id
      )
   ) INTO profile_res
   FROM profile p
   WHERE p.username = username;

   RETURN profile_res;
END;
$$;
