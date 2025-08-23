-- Function to update user profile
CREATE OR REPLACE FUNCTION public.update_profile(
    _username TEXT DEFAULT NULL,
    _full_name TEXT DEFAULT NULL,
    _avatar_url TEXT DEFAULT NULL,
    _bio TEXT DEFAULT NULL
)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _user_id UUID;
    _current_profile public.profiles;
BEGIN
    -- Get current user ID
    _user_id := auth.uid();
    
    IF _user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    -- Get current profile
    SELECT * INTO _current_profile 
    FROM public.profiles 
    WHERE id = _user_id;
    
    IF _current_profile IS NULL THEN
        RAISE EXCEPTION 'Profile not found';
    END IF;
    
    -- Check username uniqueness if changing
    IF _username IS NOT NULL AND _username != _current_profile.username THEN
        IF EXISTS(SELECT 1 FROM public.profiles WHERE username = _username AND id != _user_id) THEN
            RAISE EXCEPTION 'Username already taken';
        END IF;
    END IF;
    
    -- Update profile
    UPDATE public.profiles 
    SET 
        username = COALESCE(_username, username),
        full_name = COALESCE(_full_name, full_name),
        avatar_url = COALESCE(_avatar_url, avatar_url),
        bio = COALESCE(_bio, bio),
        updated_at = NOW()
    WHERE id = _user_id;
    
    -- Return updated profile
    RETURN (SELECT * FROM public.profiles WHERE id = _user_id);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.update_profile TO authenticated; 