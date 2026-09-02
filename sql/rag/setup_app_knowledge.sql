-- ============================================================
-- RAG KNOWLEDGE BASE FOR GURSHAI (AI CHAT ASSISTANT)
-- Run this once in the Supabase SQL editor.
-- This is idempotent (safe to re-run).
--
-- NOTE: gemini-embedding-001 produces 3072-dim vectors. pgvector's
-- HNSW index supports at most 2000 dimensions for the `vector` type
-- (this is the error you hit). HNSW supports up to 4000 dimensions
-- for `halfvec`, so the embedding column uses halfvec(3072). The
-- half-precision storage costs ~nothing for retrieval quality here.
-- Requires pgvector >= 0.7.0 (Supabase has it).
-- ============================================================

CREATE EXTENSION IF NOT EXISTS vector;

-- Migrate a column left behind by a previous failed run (vector(3072))
-- to halfvec(3072). No-op if the table doesn't exist yet.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'app_knowledge'
      AND column_name = 'embedding'
      AND udt_name = 'vector'
  ) THEN
    EXECUTE 'ALTER TABLE public.app_knowledge ALTER COLUMN embedding TYPE halfvec(3072) USING embedding::halfvec';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.app_knowledge (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    text TEXT NOT NULL,
    embedding halfvec(3072),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.app_knowledge ADD COLUMN IF NOT EXISTS embedding halfvec(3072);
ALTER TABLE public.app_knowledge ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- HNSW index (halfvec supports up to 4000 dims, so 3072 is fine)
DROP INDEX IF EXISTS app_knowledge_embedding_hnsw;
CREATE INDEX app_knowledge_embedding_hnsw
    ON public.app_knowledge
    USING hnsw (embedding halfvec_cosine_ops);

-- Row Level Security: everyone may read; only authenticated users may write
ALTER TABLE public.app_knowledge ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_knowledge_select" ON public.app_knowledge;
CREATE POLICY "app_knowledge_select" ON public.app_knowledge
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "app_knowledge_insert" ON public.app_knowledge;
CREATE POLICY "app_knowledge_insert" ON public.app_knowledge
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "app_knowledge_update" ON public.app_knowledge;
CREATE POLICY "app_knowledge_update" ON public.app_knowledge
    FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "app_knowledge_delete" ON public.app_knowledge;
CREATE POLICY "app_knowledge_delete" ON public.app_knowledge
    FOR DELETE TO authenticated USING (true);

GRANT SELECT ON public.app_knowledge TO anon;
GRANT ALL ON public.app_knowledge TO authenticated;

-- Similarity retrieval function used by ai/chunking.ts -> query().
-- Keeps a vector(3072) parameter so the app code doesn't change;
-- it casts to halfvec internally for the index.
CREATE OR REPLACE FUNCTION public.retrieve_app_knowledge(
    query_embedding vector(3072),
    match_count int DEFAULT 8
)
RETURNS TABLE (id bigint, text text, similarity double precision)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT k.id, k.text, 1 - (k.embedding <=> query_embedding::halfvec) AS similarity
    FROM public.app_knowledge k
    WHERE k.embedding IS NOT NULL
    ORDER BY k.embedding <=> query_embedding::halfvec
    LIMIT match_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.retrieve_app_knowledge(vector, int) TO anon, authenticated;
