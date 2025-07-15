CREATE OR REPLACE FUNCTION get_all_recipes()
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', r.id,
      'title', r.title,
      'description', r.description,
      'difficulty', r.difficulty,
      'servings', r.servings,
      'rating', (
            SELECT COALESCE(ROUND(AVG(rating.rating)::numeric, 2), 0)
            FROM recipe_rating rating
            WHERE rating.recipe_id = r.id
      ),
      'slug', r.slug,
      'author', (
            SELECT jsonb_build_object(
                    'id', p.id,
                    'username', p.username,
                    'full_name', p.full_name,
                    'avatar', p.avatar_url,
                    'bio', p.bio,
                    'recipes', (
                      SELECT count(*) FROM recipe
                      WHERE author_id = p.id
                    )
                )
            FROM profile p
            WHERE p.id = r.author_id
        ),
      'image', (
        SELECT row_to_json(img)
        FROM recipe_image img
        WHERE img.recipe_id = r.id
        LIMIT 1
      ),
      'tags', r.tags,
      'prepTime', r.preptime,
      'totalTime', r.totaltime,
      'culturalNote', r.cultural_notes,
      'status', r.status,
      'ingredients', (
        SELECT COALESCE(jsonb_agg(i), '[]'::jsonb)
        FROM ingredient i
        WHERE i.recipe_id = r.id
      ),
      'instructions', (
        SELECT COALESCE(jsonb_agg(
          jsonb_build_object(
            'id', ins.id,
            'step', ins.step,
            'description', ins.description,
            'time', ins.time,
            'image', (
              SELECT row_to_json(img)
              FROM instruction_image img
              WHERE img.instruction_id = ins.id
              LIMIT 1
            )
          )
        ), '[]'::jsonb)
        FROM instruction ins
        WHERE ins.recipe_id = r.id
      )
    )
  )
  INTO result
  FROM recipe r
  WHERE r.status = 'published';

  RETURN result;
END;