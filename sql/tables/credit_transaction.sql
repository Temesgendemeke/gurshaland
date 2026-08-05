-- Record each credit purchase so webhook redeliveries never double-credit.
CREATE TABLE IF NOT EXISTS public.credit_transaction (
    order_id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL CHECK (amount > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.credit_transaction ENABLE ROW LEVEL SECURITY;

-- No direct policies; writes only happen through the add_credits function.
