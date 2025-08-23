CREATE OR REPLACE FUNCTION public.delete_user_profile()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _user_id UUID;
    _deleted_count INTEGER;
BEGIN
    _user_id := auth.uid();
    
    IF _user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    DELETE FROM public.profiles 
    WHERE id = _user_id;
    
    GET DIAGNOSTICS _deleted_count = ROW_COUNT;
    
    RETURN _deleted_count > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_user_profile TO authenticated; 