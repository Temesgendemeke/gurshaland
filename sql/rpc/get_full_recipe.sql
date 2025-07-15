CREATE OR REPLACE FUNCTION get_full_recipe(_slug text)
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
        'image', r.image,
        'tags', r.tags,
        'prepTime', r.prep_time,
        'totalTime', r.total_time,
        'status', r.status,
        'ingredients', (
            SELECT COALESCE(jsonb_agg(i), '[]'::jsonb)
            FROM ingredient i
            WHERE i.recipe_id = r.id
        ),
        'instruction', (
            SELECT COALESCE(jsonb_agg(i), '[]'::jsonb)
            FROM instruction i
            WHERE i.recipe_id = r.id
        )
    )
    INTO result
    FROM recipe r
    WHERE r.slug = _slug AND r.status = 'published';
    RETURN result;
END 
$$;