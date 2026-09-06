-- ============================================
-- BLOG_LIKE TABLE & RLS POLICIES
-- ============================================
CREATE TABLE IF NOT EXISTS blog_like (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    blog_id BIGINT NOT NULL REFERENCES blog(id) ON DELETE CASCADE,
    liked_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_blog_liked_by UNIQUE (blog_id, liked_by)
);

CREATE INDEX IF NOT EXISTS idx_blog_like_blog_id ON blog_like(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_like_liked_by ON blog_like(liked_by);

-- Enable RLS
ALTER TABLE blog_like ENABLE ROW LEVEL SECURITY;

-- Anyone can view likes (read-only count)
CREATE POLICY "Anyone can view blog likes"
ON blog_like FOR SELECT
USING (true);

-- Authenticated users can insert their own likes
CREATE POLICY "Authenticated users can like blogs"
ON blog_like FOR INSERT
WITH CHECK (auth.uid() = liked_by);

-- Authenticated users can delete their own likes (unlike)
CREATE POLICY "Users can remove their own likes"
ON blog_like FOR DELETE
USING (auth.uid() = liked_by);
