CREATE OR REPLACE FUNCTION get_full_recipe_admin(_slug text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE 
   result jsonb;
BEGIN 
    SELECT jsonb_build_object(
        'id', r.id,
        'title', r.title,
        'description', r.description,
        'difficulty', r.difficulty,
        'servings', r.servings,
        'author_id', r.author_id,
        'slug', r.slug,
        'preptime', r.preptime,
        'cooktime', r.cooktime,
        'cultural_notes', r.cultural_notes,
        'youtube_video_id', r.youtube_video_id,
        'rating', (
            SELECT COALESCE(jsonb_agg(rating), '[]'::jsonb)
            FROM recipe_rating rating
            WHERE rating.recipe_id = r.id
        ),
        'average_rating', (
            SELECT COALESCE(ROUND(AVG(rating.rating)::numeric, 2), 0)
            FROM recipe_rating rating
            WHERE rating.recipe_id = r.id
        ),
        'image', (
            SELECT row_to_json(img)
            FROM recipe_image img
            WHERE img.recipe_id = r.id
            LIMIT 1
        ),
        'tags', r.tags,
        'status', r.status,
        'ingredients', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', i.id,
                    'item', COALESCE(i.item, ''),
                    'amount', i.amount,
                    'unit', NULLIF(i.unit, ''),
                    'notes', NULLIF(i.notes, '')
                )
            ), '[]'::jsonb)
            FROM ingredient i
            WHERE i.recipe_id = r.id
        ),
        'instructions', (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', ins.id,
      'step', ins.step,
      'title', ins.title,
      'description', ins.description,
      'time', ins.time,
      'tips', ins.tips,
      'image', (
        SELECT row_to_json(img)
        FROM instruction_image img
        WHERE img.instruction_id = ins.id
        LIMIT 1
      )
    ) ORDER BY ins.step
  )
  FROM instruction ins
  WHERE ins.recipe_id = r.id
),
        'nutrition', (
            SELECT jsonb_build_object(
                'calories', COALESCE(nut.calories, 0),
                'protein', COALESCE(nut.protein, 0),
                'carbs', COALESCE(nut.carbs, 0),
                'fat', COALESCE(nut.fat, 0),
                'fiber', COALESCE(nut.fiber, 0)
            )
            FROM nutrition nut
            WHERE nut.recipe_id = r.id
            LIMIT 1
        )
    )
    INTO result
    FROM recipe r
    WHERE r.slug = _slug;
    RETURN result;
END 
$$;
