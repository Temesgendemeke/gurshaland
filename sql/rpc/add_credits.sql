-- Idempotently add credits to a user (used by the Polar order.paid webhook).
-- When _order_id is provided, each order is only credited once.
CREATE OR REPLACE FUNCTION public.add_credits(
    _user_id UUID,
    _amount INTEGER,
    _order_id TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _new_balance INTEGER;
BEGIN
    IF _amount IS NULL OR _amount <= 0 THEN
        RAISE EXCEPTION 'Invalid credit amount';
    END IF;

    -- Deduplicate webhook deliveries per order
    IF _order_id IS NOT NULL THEN
        BEGIN
            INSERT INTO public.credit_transaction (order_id, user_id, amount)
            VALUES (_order_id, _user_id, _amount)
            ON CONFLICT (order_id) DO NOTHING;

            IF NOT FOUND THEN
                RETURN (SELECT balance FROM public.user_credits WHERE id = _user_id);
            END IF;
        EXCEPTION WHEN unique_violation THEN
            RETURN (SELECT balance FROM public.user_credits WHERE id = _user_id);
        END;
    END IF;

    -- Ensure a row exists (seed 100 if the user has never had credits)
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

-- Restrict execution to the service role only (called from the webhook handler).
REVOKE ALL ON FUNCTION public.add_credits(UUID, INTEGER, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.add_credits(UUID, INTEGER, TEXT) TO service_role;
