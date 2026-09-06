-- Public profile lookup by username (canonical definition).
-- Returns the nested shape the app expects (recipes, followers, following,
-- blogs) plus avatar_url resolved from the latest profile_image row.
-- NOTE: the table is named "profile" (singular), not "profiles".
CREATE OR REPLACE FUNCTION public.get_profile_by_username(_username TEXT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
   profile_res jsonb;
BEGIN
   SELECT jsonb_build_object(
      'id', p.id,
      'username', p.username,
      'full_name', p.full_name,
      'avatar', COALESCE(
         (SELECT pi.url FROM profile_image pi WHERE pi.profile_id = p.id ORDER BY pi.id DESC LIMIT 1),
         (SELECT COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', u.raw_user_meta_data->>'avatar') FROM auth.users u WHERE u.id = p.id)
      ),
      'avatar_url', COALESCE(
         (SELECT pi.url FROM profile_image pi WHERE pi.profile_id = p.id ORDER BY pi.id DESC LIMIT 1),
         (SELECT COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', u.raw_user_meta_data->>'avatar') FROM auth.users u WHERE u.id = p.id)
      ),
      'bio', p.bio,
      'recipes', (
         SELECT COALESCE(jsonb_agg(
            jsonb_build_object(
               'id', r.id,
               'title', r.title,
               'description', r.description,
               'difficulty', r.difficulty,
               'servings', r.servings,
               'preptime', r.preptime,
               'cooktime', r.cooktime,
               'slug', r.slug,
               'status', r.status,
               'tags', r.tags,
               'category', (
                  SELECT jsonb_build_object('id', c.id, 'name', c.name)
                  FROM category c
                  WHERE c.id = r.category_id
                  LIMIT 1
               ),
               'image', (
                  SELECT jsonb_build_object('url', ri.url, 'path', ri.path)
                  FROM recipe_image ri
                  WHERE ri.recipe_id = r.id
                  ORDER BY ri.id DESC
                  LIMIT 1
               ),
               'average_rating', (
                  SELECT COALESCE(AVG(rr.rating)::numeric, 0)
                  FROM recipe_rating rr
                  WHERE rr.recipe_id = r.id
               )
            )
            ORDER BY (r.status = 'published') DESC, r.created_at DESC
         ), '[]'::jsonb)
         FROM recipe r
         WHERE r.author_id = p.id
            AND (
               auth.uid() = p.id
               OR (r.status = 'published' AND r.slug IS NOT NULL)
            )
      ),
      'followers', (
         SELECT count(*)
         FROM follower f
         WHERE f.profile_id = p.id
      ),
      'is_following', (
         EXISTS (
            SELECT 1 FROM follower f
            WHERE f.follower_id = auth.uid() AND f.profile_id = p.id
         )
      ),
      'blogs', (
         SELECT COALESCE(jsonb_agg(
            jsonb_build_object(
               'id', b.id,
               'title', b.title,
               'subtitle', b.subtitle,
               'slug', b.slug,
               'status', b.status,
               'category', b.category,
               'read_time', b.read_time,
               'tags', b.tags,
               'featured', false,
               'created_at', b.created_at,
               'image', (
                  SELECT jsonb_build_object('url', bi.url, 'path', bi.path)
                  FROM blog_image bi
                  WHERE bi.blog_id = b.id
                  ORDER BY bi.id DESC
                  LIMIT 1
               )
            )
            ORDER BY (b.status = 'published') DESC, b.created_at DESC
         ), '[]'::jsonb)
         FROM blog b
         WHERE b.author_id = p.id
            AND (
               auth.uid() = p.id
               OR b.status = 'published'
            )
      ),
      'following', (
         SELECT COALESCE(jsonb_agg(to_jsonb(f2)), '[]'::jsonb)
         FROM follower f2
         WHERE f2.follower_id = p.id
      )
   ) INTO profile_res
   FROM profile p
   WHERE p.username = _username;

   RETURN profile_res;
END;
$$;

-- Grant execute permission to everyone (for public profile viewing)
GRANT EXECUTE ON FUNCTION public.get_profile_by_username TO anon;
GRANT EXECUTE ON FUNCTION public.get_profile_by_username TO authenticated;
