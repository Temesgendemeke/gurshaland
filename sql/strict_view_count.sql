-- Strict view counter system for published recipes and blogs.
-- Re-runnable (CREATE OR REPLACE). Run this AFTER sql/setup_view_tracking.sql
-- so the recipe_view / blog_view tables already exist.
--
-- Why this is strict:
--   1. The viewer is derived from the JWT (auth.uid()), never trusted from a
--      client-supplied argument, so counts cannot be spoofed or faked.
--   2. Anonymous viewers are deduplicated by ip_address via the existing
--      UNIQUE (recipe_id, viewer_id, ip_address) constraint.
--   3. The content author's own views are never recorded (no self-inflation).

-- Strict recipe view recording
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
    _viewer uuid := auth.uid();
    _author_id uuid;
    _inserted INTEGER;
BEGIN
    SELECT author_id INTO _author_id FROM public.recipe WHERE id = _recipe_id;
    IF NOT FOUND OR _viewer = _author_id THEN
        RETURN false;
    END IF;

    INSERT INTO public.recipe_view (recipe_id, viewer_id, ip_address, user_agent)
    VALUES (_recipe_id, _viewer, _ip_address, _user_agent)
    ON CONFLICT (recipe_id, viewer_id, ip_address) DO NOTHING;

    GET DIAGNOSTICS _inserted = ROW_COUNT;
    RETURN _inserted > 0;
END;
$$;

-- Strict blog view recording
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
    _viewer uuid := auth.uid();
    _author_id uuid;
    _inserted INTEGER;
BEGIN
    SELECT author_id INTO _author_id FROM public.blog WHERE id = _blog_id;
    IF NOT FOUND OR _viewer = _author_id THEN
        RETURN false;
    END IF;

    INSERT INTO public.blog_view (blog_id, viewer_id, ip_address, user_agent)
    VALUES (_blog_id, _viewer, _ip_address, _user_agent)
    ON CONFLICT (blog_id, viewer_id, ip_address) DO NOTHING;

    GET DIAGNOSTICS _inserted = ROW_COUNT;
    RETURN _inserted > 0;
END;
$$;

-- Real (strict) view counts read from the tracked view rows
CREATE OR REPLACE FUNCTION public.count_recipe_views(_recipe_id BIGINT)
RETURNS BIGINT
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT count(*)::bigint FROM public.recipe_view WHERE recipe_id = _recipe_id;
$$;

CREATE OR REPLACE FUNCTION public.count_blog_views(_blog_id BIGINT)
RETURNS BIGINT
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT count(*)::bigint FROM public.blog_view WHERE blog_id = _blog_id;
$$;

-- Grants
GRANT EXECUTE ON FUNCTION public.record_recipe_view TO anon;
GRANT EXECUTE ON FUNCTION public.record_recipe_view TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_blog_view TO anon;
GRANT EXECUTE ON FUNCTION public.record_blog_view TO authenticated;
GRANT EXECUTE ON FUNCTION public.count_recipe_views TO anon;
GRANT EXECUTE ON FUNCTION public.count_recipe_views TO authenticated;
GRANT EXECUTE ON FUNCTION public.count_blog_views TO anon;
GRANT EXECUTE ON FUNCTION public.count_blog_views TO authenticated;
