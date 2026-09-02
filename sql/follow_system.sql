-- Follow / unfollow / is_following system.
-- Re-runnable (CREATE OR REPLACE). The follower table already exists.
-- Viewer identity always comes from the JWT (auth.uid()), never from arguments.

-- Guarantee at most one follow row per (follower, profile) pair
CREATE UNIQUE INDEX IF NOT EXISTS idx_follower_unique
ON public.follower (follower_id, profile_id);

-- Follow a profile
CREATE OR REPLACE FUNCTION public.follow_profile(_profile_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _viewer uuid := auth.uid();
BEGIN
    IF _viewer IS NULL THEN
        RAISE EXCEPTION 'authentication required';
    END IF;
    IF _viewer = _profile_id THEN
        RAISE EXCEPTION 'you cannot follow yourself';
    END IF;

    INSERT INTO public.follower (follower_id, profile_id)
    VALUES (_viewer, _profile_id)
    ON CONFLICT (follower_id, profile_id) DO NOTHING;

    RETURN true;
END;
$$;

-- Unfollow a profile
CREATE OR REPLACE FUNCTION public.unfollow_profile(_profile_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _viewer uuid := auth.uid();
BEGIN
    IF _viewer IS NULL THEN
        RETURN false;
    END IF;

    DELETE FROM public.follower
    WHERE follower_id = _viewer AND profile_id = _profile_id;

    RETURN FOUND;
END;
$$;

-- Check whether the current viewer follows a profile
CREATE OR REPLACE FUNCTION public.is_following(_profile_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _viewer uuid := auth.uid();
BEGIN
    IF _viewer IS NULL THEN
        RETURN false;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.follower
        WHERE follower_id = _viewer AND profile_id = _profile_id
    );
END;
$$;

-- Grants
GRANT EXECUTE ON FUNCTION public.follow_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.unfollow_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_following TO anon;
GRANT EXECUTE ON FUNCTION public.is_following TO authenticated;
