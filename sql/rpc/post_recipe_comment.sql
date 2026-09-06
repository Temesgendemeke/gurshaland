CREATE OR REPLACE FUNCTION post_recipe_comment(
    _comment jsonb
)
RETURNS jsonb
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
   comment_id int;
   result jsonb;
BEGIN
   INSERT INTO recipe_comment (
      comment,
      author_id,
      recipe_id
   ) 
   VALUES (
      _comment ->> 'comment',
      (_comment ->> 'author_id')::UUID,
      (_comment ->> 'recipe_id')::INT8
   )
   RETURNING id INTO comment_id;

   SELECT jsonb_build_object(
      'comment', c.comment,
      'id', c.id,
      'author_id', c.author_id,
      'author', (
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
            )
         )
         FROM profile p
         WHERE p.id = c.author_id
         LIMIT 1
      ),
      'rating', (
         SELECT r.rating 
         FROM recipe_rating r
         WHERE r.user_id = c.author_id
         AND r.recipe_id = c.recipe_id
         LIMIT 1
      ),
      'createdAt', c.createdAt,
      'recipe_id', c.recipe_id
   )
   INTO result
   FROM recipe_comment c
   WHERE c.id = comment_id;

   RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION post_recipe_comment(jsonb) TO authenticated;
