-- Create user_credits table
CREATE TABLE IF NOT EXISTS public.user_credits (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    balance INTEGER NOT NULL DEFAULT 100 CHECK (balance >= 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own credits
CREATE POLICY "Users can view own credits"
    ON public.user_credits FOR SELECT
    USING (auth.uid() = id);

-- Note: No direct insert/update/delete policies.
-- All writes go through SECURITY DEFINER functions (get_credits / use_credit).

-- Grant necessary permissions
GRANT SELECT ON public.user_credits TO authenticated;

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_user_credits_balance ON public.user_credits(balance);
