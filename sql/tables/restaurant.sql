-- ============================================
-- RESTAURANT TABLE (matches actual database schema)
-- ============================================
CREATE TABLE IF NOT EXISTS restaurant (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cuisines JSONB,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    google_map_url TEXT,
    image JSONB,
    menu JSONB,
    gallery JSONB,
    rating NUMERIC DEFAULT 0 CHECK (rating >= 0::numeric AND rating <= 5::numeric),
    author_id UUID NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    review JSONB,
    slug TEXT,
    category JSONB,
    city TEXT,
    country TEXT,
    embedding vector(768)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_restaurant_author_id ON restaurant(author_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_created_at ON restaurant(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_restaurant_slug ON restaurant(slug);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_restaurant_updated_at ON restaurant;
CREATE TRIGGER update_restaurant_updated_at
    BEFORE UPDATE ON restaurant
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE restaurant ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Restaurants are viewable by everyone" ON restaurant;
CREATE POLICY "Restaurants are viewable by everyone"
    ON restaurant FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can create their own restaurants" ON restaurant;
CREATE POLICY "Users can create their own restaurants"
    ON restaurant FOR INSERT
    WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update their own restaurants" ON restaurant;
CREATE POLICY "Users can update their own restaurants"
    ON restaurant FOR UPDATE
    USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own restaurants" ON restaurant;
CREATE POLICY "Users can delete their own restaurants"
    ON restaurant FOR DELETE
    USING (auth.uid() = author_id);