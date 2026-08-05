-- Get the current user's credit balance, seeding 100 on first access
CREATE OR REPLACE FUNCTION public.get_credits()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _user_id UUID;
    _balance INTEGER;
BEGIN
    _user_id := auth.uid();

    IF _user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;

    -- Seed a fresh row with the starting balance if this is the user's first access
    INSERT INTO public.user_credits (id, balance)
    VALUES (_user_id, 100)
    ON CONFLICT (id) DO NOTHING;

    SELECT balance INTO _balance
    FROM public.user_credits
    WHERE id = _user_id;

    RETURN _balance;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_credits() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_credits() TO anon;
