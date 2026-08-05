-- Atomically deduct credits from the current user
CREATE OR REPLACE FUNCTION public.use_credit(_amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _user_id UUID;
    _new_balance INTEGER;
BEGIN
    IF _amount IS NULL OR _amount <= 0 THEN
        RAISE EXCEPTION 'Invalid credit amount';
    END IF;

    _user_id := auth.uid();

    IF _user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;

    -- Ensure a row exists (seed 100 on first access)
    INSERT INTO public.user_credits (id, balance)
    VALUES (_user_id, 100)
    ON CONFLICT (id) DO NOTHING;

    -- Atomic guarded update: only succeeds if enough balance remains
    UPDATE public.user_credits
    SET balance = balance - _amount,
        updated_at = NOW()
    WHERE id = _user_id AND balance >= _amount
    RETURNING balance INTO _new_balance;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Insufficient credits';
    END IF;

    RETURN _new_balance;
END;
$$;

GRANT EXECUTE ON FUNCTION public.use_credit(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.use_credit(INTEGER) TO anon;
