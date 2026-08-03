-- Function to get profile by username
CREATE OR REPLACE FUNCTION public.get_profile_by_username(_username TEXT)
RETURNS TABLE(
    id UUID,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.username,
        p.full_name,
        p.avatar_url,
        p.bio,
        p.created_at,
        p.updated_at
    FROM public.profiles p
    WHERE p.username = _username;
END;
$$;

-- Grant execute permission to everyone (for public profile viewing)
GRANT EXECUTE ON FUNCTION public.get_profile_by_username TO anon;
GRANT EXECUTE ON FUNCTION public.get_profile_by_username TO authenticated; 