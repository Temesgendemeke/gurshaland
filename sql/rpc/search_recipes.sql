-- ============================================================
-- SEARCH RECIPES FOR GURSHAI (AI CHAT ASSISTANT)
-- Finds published recipes by dish name, tag, or ingredient.
-- Run once in the Supabase SQL editor.
-- ============================================================

-- 1. Trigram indexes for fast ILIKE lookups
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_recipe_title_trgm
    ON public.recipe USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_recipe_description_trgm
    ON public.recipe USING gin (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_ingredient_item_trgm
    ON public.ingredient USING gin (item gin_trgm_ops);

-- 2. Search function
CREATE OR REPLACE FUNCTION public.search_recipes(
    _query text DEFAULT '',
    _limit int DEFAULT 6
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    q text := trim(_query);
    result jsonb;
BEGIN
    IF q = '' THEN
        SELECT COALESCE(jsonb_agg(row_to_json(t)::jsonb), '[]'::jsonb)
        INTO result
        FROM (
            SELECT r.id, r.title, r.slug, r.description, r.difficulty,
                   r.servings, r.tags, r.preptime, r.cooktime, r.created_at,
                   (
                       SELECT COALESCE(ROUND(AVG(rr.rating)::numeric, 2), 0)
                       FROM recipe_rating rr
                       WHERE rr.recipe_id = r.id
                   ) AS rating,
                   (
                       SELECT row_to_json(img)
                       FROM recipe_image img
                       WHERE img.recipe_id = r.id
                       ORDER BY img.id ASC
                       LIMIT 1
                   ) AS image
            FROM recipe r
            WHERE r.status = 'published'
            ORDER BY r.created_at DESC
            LIMIT _limit
        ) t;
        RETURN result;
    END IF;

    SELECT COALESCE(jsonb_agg(row_to_json(t)::jsonb), '[]'::jsonb)
    INTO result
    FROM (
        SELECT r.id, r.title, r.slug, r.description, r.difficulty,
               r.servings, r.tags, r.preptime, r.cooktime, r.created_at,
               (
                   SELECT COALESCE(ROUND(AVG(rr.rating)::numeric, 2), 0)
                   FROM recipe_rating rr
                   WHERE rr.recipe_id = r.id
               ) AS rating,
               (
                   SELECT row_to_json(img)
                   FROM recipe_image img
                   WHERE img.recipe_id = r.id
                   ORDER BY img.id ASC
                   LIMIT 1
               ) AS image,
               COALESCE(
                   array_agg(DISTINCT i.item) FILTER (WHERE i.item IS NOT NULL),
                   '{}'
               ) AS matched_ingredients
        FROM recipe r
        LEFT JOIN ingredient i ON i.recipe_id = r.id
        WHERE r.status = 'published'
          AND (r.title ILIKE '%' || q || '%'
               OR r.description ILIKE '%' || q || '%'
               OR r.tags::text ILIKE '%' || q || '%'
               OR i.item ILIKE '%' || q || '%')
        GROUP BY r.id
        ORDER BY rating DESC NULLS LAST, r.created_at DESC
        LIMIT _limit
    ) t;

    RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_recipes(text, int) TO anon, authenticated;
