-- ============================================================
-- SEARCH RESTAURANTS FOR GURSHAI (AI CHAT ASSISTANT)
-- Finds restaurants by name, area, cuisine, OR a dish they serve
-- (e.g. "shiro", "kitfo", "pizza"). Run once in the Supabase SQL editor.
-- ============================================================

-- 1. Trigram indexes for fast ILIKE lookups
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_restaurant_name_trgm
    ON public.restaurant USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_restaurant_description_trgm
    ON public.restaurant USING gin (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_restaurant_address_trgm
    ON public.restaurant USING gin (address gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_restaurant_city_trgm
    ON public.restaurant USING gin (city gin_trgm_ops);

-- 2. Embedding column (optional, used by scripts/fillEmbedding.ts for future
--    hybrid semantic search). Idempotent if the column already exists.
ALTER TABLE public.restaurant ADD COLUMN IF NOT EXISTS embedding vector(768);
CREATE INDEX IF NOT EXISTS idx_restaurant_embedding_hnsw
    ON public.restaurant
    USING hnsw (embedding vector_cosine_ops);

-- 3. Search function
CREATE OR REPLACE FUNCTION public.search_restaurants(
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
    -- Empty query: return top-rated places
    IF q = '' THEN
        SELECT COALESCE(jsonb_agg(row_to_json(t)::jsonb), '[]'::jsonb)
        INTO result
        FROM (
            SELECT r.id, r.name, r.slug, r.description, r.address, r.city,
                   r.country, r.rating, r.image, r.cuisines, r.google_map_url,
                   r.website, r.created_at
            FROM restaurant r
            ORDER BY r.rating DESC NULLS LAST, r.created_at DESC
            LIMIT _limit
        ) t;
        RETURN result;
    END IF;

    SELECT COALESCE(jsonb_agg(row_to_json(t)::jsonb), '[]'::jsonb)
    INTO result
    FROM (
        SELECT r.id, r.name, r.slug, r.description, r.address, r.city,
               r.country, r.rating, r.image, r.cuisines, r.google_map_url,
               r.website, r.created_at,
               COALESCE(
                   array_agg(DISTINCT m.name) FILTER (WHERE m.name IS NOT NULL),
                   '{}'
               ) AS matched_menu
        FROM restaurant r
        LEFT JOIN LATERAL (
            SELECT menu_item->>'name'        AS name,
                   menu_item->>'description' AS description
            FROM jsonb_array_elements(COALESCE(r.menu, '[]'::jsonb)) AS menu_item
        ) m ON true
        WHERE r.name ILIKE '%' || q || '%'
           OR r.description ILIKE '%' || q || '%'
           OR r.address ILIKE '%' || q || '%'
           OR r.city ILIKE '%' || q || '%'
           OR r.country ILIKE '%' || q || '%'
           OR m.name ILIKE '%' || q || '%'
           OR m.description ILIKE '%' || q || '%'
        GROUP BY r.id
        ORDER BY r.rating DESC NULLS LAST, r.created_at DESC
        LIMIT _limit
    ) t;

    RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_restaurants(text, int) TO anon, authenticated;
