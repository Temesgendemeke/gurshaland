CREATE OR REPLACE FUNCTION get_recipe_by_author(_author_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    result jsonb;
BEGIN
    -- Get recipes with aggregated stats in a single query for better performance
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', r.id,
                'title', r.title,
                'view_count', COALESCE(v.view_count, 0),
                'like', COALESCE(l.like_count, 0),
                'comment_count', COALESCE(c.comment_count, 0),
                'created_at', r.created_at,
                'status', r.status,
                'slug', r.slug
            )
            ORDER BY r.created_at DESC
        ),
        '[]'::jsonb
    ) INTO result
    FROM recipe r
    LEFT JOIN LATERAL (
        SELECT count(*)::bigint AS view_count
        FROM recipe_view rv 
        WHERE rv.recipe_id = r.id
    ) v ON true
    LEFT JOIN LATERAL (
        SELECT count(*)::bigint AS like_count
        FROM recipe_like rl
        WHERE rl.recipe_id = r.id
    ) l ON true
    LEFT JOIN LATERAL (
        SELECT count(*)::bigint AS comment_count
        FROM recipe_comment rc
        WHERE rc.recipe_id = r.id
    ) c ON true
    WHERE r.author_id = _author_id;
    
    RETURN result;
END;
$$;