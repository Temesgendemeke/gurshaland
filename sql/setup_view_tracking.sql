-- Setup view tracking for recipes and blogs
-- This file creates the necessary tables and functions to track views for both content types

-- 1. Create recipe_view table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.recipe_view (
    id BIGSERIAL PRIMARY KEY,
    recipe_id BIGINT NOT NULL REFERENCES public.recipe(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(recipe_id, viewer_id, ip_address)
);

-- 2. Create blog_view table if it doesn't exist (for consistency)
CREATE TABLE IF NOT EXISTS public.blog_view (
    id BIGSERIAL PRIMARY KEY,
    blog_id BIGINT NOT NULL REFERENCES public.blog(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blog_id, viewer_id, ip_address)
);

-- 3. Enable Row Level Security on view tables
ALTER TABLE public.recipe_view ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_view ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for recipe_view
DROP POLICY IF EXISTS "Recipe views are viewable by everyone" ON public.recipe_view;
CREATE POLICY "Recipe views are viewable by everyone" ON public.recipe_view
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert recipe views" ON public.recipe_view;
CREATE POLICY "Anyone can insert recipe views" ON public.recipe_view
    FOR INSERT WITH CHECK (true);

-- 5. Create RLS policies for blog_view
DROP POLICY IF EXISTS "Blog views are viewable by everyone" ON public.blog_view;
CREATE POLICY "Blog views are viewable by everyone" ON public.blog_view
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert blog views" ON public.blog_view;
CREATE POLICY "Anyone can insert blog views" ON public.blog_view
    FOR INSERT WITH CHECK (true);

-- 6. Create function to record recipe view
CREATE OR REPLACE FUNCTION public.record_recipe_view(
    _recipe_id BIGINT,
    _viewer_id UUID DEFAULT NULL,
    _ip_address INET DEFAULT NULL,
    _user_agent TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _inserted_count INTEGER;
BEGIN
    -- Insert view record, ignoring conflicts (unique constraint)
    INSERT INTO public.recipe_view (recipe_id, viewer_id, ip_address, user_agent)
    VALUES (_recipe_id, _viewer_id, _ip_address, _user_agent)
    ON CONFLICT (recipe_id, viewer_id, ip_address) DO NOTHING;
    
    GET DIAGNOSTICS _inserted_count = ROW_COUNT;
    
    -- Return true if view was recorded (new view), false if it was a duplicate
    RETURN _inserted_count > 0;
END;
$$;

-- 7. Create function to record blog view
CREATE OR REPLACE FUNCTION public.record_blog_view(
    _blog_id BIGINT,
    _viewer_id UUID DEFAULT NULL,
    _ip_address INET DEFAULT NULL,
    _user_agent TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _inserted_count INTEGER;
BEGIN
    -- Insert view record, ignoring conflicts (unique constraint)
    INSERT INTO public.blog_view (blog_id, viewer_id, ip_address, user_agent)
    VALUES (_blog_id, _viewer_id, _ip_address, _user_agent)
    ON CONFLICT (blog_id, viewer_id, ip_address) DO NOTHING;
    
    GET DIAGNOSTICS _inserted_count = ROW_COUNT;
    
    -- Return true if view was recorded (new view), false if it was a duplicate
    RETURN _inserted_count > 0;
END;
$$;

-- 8. Grant necessary permissions
GRANT ALL ON public.recipe_view TO authenticated;
GRANT SELECT, INSERT ON public.recipe_view TO anon;
GRANT ALL ON public.blog_view TO authenticated;
GRANT SELECT, INSERT ON public.blog_view TO anon;

-- 9. Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.record_recipe_view TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_recipe_view TO anon;
GRANT EXECUTE ON FUNCTION public.record_blog_view TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_blog_view TO anon;

-- 10. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipe_view_recipe_id ON public.recipe_view(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_view_viewed_at ON public.recipe_view(viewed_at);
CREATE INDEX IF NOT EXISTS idx_blog_view_blog_id ON public.blog_view(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_view_viewed_at ON public.blog_view(viewed_at); 