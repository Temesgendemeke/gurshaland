-- ============================================
-- BLOG_COMMENT TABLE & RLS POLICIES
-- ============================================
CREATE TABLE IF NOT EXISTS blog_comment (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    blog_id BIGINT NOT NULL REFERENCES blog(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blog_comment_blog_id ON blog_comment(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comment_user_id ON blog_comment(user_id);

-- Enable RLS
ALTER TABLE blog_comment ENABLE ROW LEVEL SECURITY;

-- Everyone can view comments on published blogs
CREATE POLICY "Anyone can view blog comments"
ON blog_comment FOR SELECT
USING (true);

-- Authenticated users (including publishers) can comment
CREATE POLICY "Authenticated users can post blog comments"
ON blog_comment FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Commenter or blog publisher can delete comment
CREATE POLICY "Commenter or blog author can delete comment"
ON blog_comment FOR DELETE
USING (
    auth.uid() = user_id 
    OR EXISTS (
        SELECT 1 FROM blog b 
        WHERE b.id = blog_comment.blog_id 
          AND b.author_id = auth.uid()
    )
);
