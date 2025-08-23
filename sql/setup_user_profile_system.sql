-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Create RLS policies for profiles table
-- Users can view all profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (though this should be handled by trigger)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- 8. Create function to update user profile
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


-- 10. Create function to delete user profile
CREATE OR REPLACE FUNCTION public.delete_user_profile()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _user_id UUID;
    _deleted_count INTEGER;
BEGIN
    -- Get current user ID
    _user_id := auth.uid();
    
    IF _user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    -- Delete profile (this will cascade to related tables due to foreign key constraints)
    DELETE FROM public.profiles 
    WHERE id = _user_id;
    
    GET DIAGNOSTICS _deleted_count = ROW_COUNT;
    
    -- Return true if profile was deleted
    RETURN _deleted_count > 0;
END;
$$;

-- 11. Grant execute permissions
GRANT EXECUTE ON FUNCTION public.update_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_profile_by_username TO anon;
GRANT EXECUTE ON FUNCTION public.get_profile_by_username TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user_profile TO authenticated;

-- 12. Create a view for public profile information
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
    id,
    username,
    full_name,
    avatar_url,
    bio,
    created_at
FROM public.profiles;

-- Grant select on the view
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

