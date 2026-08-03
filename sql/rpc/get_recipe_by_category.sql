CREATE OR REPLACE FUNCTION get_recipe_by_category(_category_id INT8)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
    RETURN (
        SELECT COALESCE(jsonb_agg(
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
                        'bio', p.bio
                    )
                    FROM profile p
                    WHERE p.id = r.author_id
                ),
                'image', (
                    SELECT jsonb_build_object(
                        'id', img.id,
                        'url', img.url
                    )
                    FROM recipe_image img
                    WHERE img.recipe_id = r.id
                    LIMIT 1
                ),
                'tags', r.tags,
                'prepTime', r.preptime,
                'totalTime', r.totaltime,
                'status', r.status,
                'author_id', r.author_id
            )
        ), '[]'::jsonb)
        FROM recipe r
        WHERE r.category_id = _category_id
        AND r.status = 'published'
    );
END;
$$;