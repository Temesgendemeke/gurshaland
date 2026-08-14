-- Refund credits back to the current user when a paid AI generation fails.
-- Mirrors use_credit() but adds the amount back atomically.
CREATE OR REPLACE FUNCTION public.refund_credit(_amount INTEGER)
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

    UPDATE public.user_credits
    SET balance = balance + _amount,
        updated_at = NOW()
    WHERE id = _user_id
    RETURNING balance INTO _new_balance;

    RETURN _new_balance;
END;
$$;

GRANT EXECUTE ON FUNCTION public.refund_credit(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.refund_credit(INTEGER) TO anon;
