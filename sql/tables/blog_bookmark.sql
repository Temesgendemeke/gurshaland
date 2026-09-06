-- ============================================
-- BLOG_BOOKMARK TABLE & HELPER FUNCTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS blog_bookmark (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    blog_id BIGINT NOT NULL REFERENCES blog(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_blog_user_bookmark UNIQUE (blog_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_blog_bookmark_user_id ON blog_bookmark(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_bookmark_blog_id ON blog_bookmark(blog_id);

-- Enable RLS
ALTER TABLE blog_bookmark ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blog bookmarks"
ON blog_bookmark FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blog bookmarks"
ON blog_bookmark FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own blog bookmarks"
ON blog_bookmark FOR DELETE
USING (auth.uid() = user_id);
