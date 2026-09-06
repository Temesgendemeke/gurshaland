CREATE OR REPLACE FUNCTION get_blog_by_slug(
    blog_slug TEXT,
    _user_id UUID DEFAULT NULL
)
RETURNS JSONB 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    new_blog JSONB;
    current_blog_id BIGINT;
    current_category TEXT;
BEGIN
    -- Get the current blog's ID and category first
    SELECT b.id, b.category INTO current_blog_id, current_category
    FROM blog b
    WHERE b.slug = blog_slug AND (b.status = 'published' OR (_user_id IS NOT NULL AND _user_id = b.author_id));
    
    -- If blog not found, return null
    IF current_blog_id IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT jsonb_build_object(
        'id', b.id,
        'title', b.title,
        'subtitle', b.subtitle,
        'author_id', b.author_id,  
        'featured', false,
        'author', (
            SELECT jsonb_build_object(
                'id', p.id,
                'username', p.username,
                'full_name', p.full_name,
                'avatar', COALESCE(
                    (SELECT pi.url FROM profile_image pi WHERE pi.profile_id = p.id ORDER BY pi.id DESC LIMIT 1),
                    (SELECT COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', u.raw_user_meta_data->>'avatar') FROM auth.users u WHERE u.id = p.id)
                ),
                'avatar_url', COALESCE(
                    (SELECT pi.url FROM profile_image pi WHERE pi.profile_id = p.id ORDER BY pi.id DESC LIMIT 1),
                    (SELECT COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', u.raw_user_meta_data->>'avatar') FROM auth.users u WHERE u.id = p.id)
                ),
                'bio', p.bio
            )
            FROM profile p
            WHERE b.author_id = p.id
            LIMIT 1
        ),
        'created_at', b.created_at,
        'read_time', b.read_time,
        'category', b.category,
        'image', (
            SELECT COALESCE(row_to_json(b_img), '{}'::json)
            FROM blog_image b_img
            WHERE b_img.blog_id = b.id
            LIMIT 1
        ),
        'contents', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', content.id,
                    'body', content.body,
                    'title', content.title,
                    'instructions', content.instructions,
                    'items', content.items,
                    'ingredients', (
                        SELECT jsonb_agg(
                            jsonb_build_object(
                                'id', ingredient.id,
                                'amount', ingredient.amount,
                                'name', ingredient.name,
                                'measurement', ingredient.measurement
                            )
                        )
                        FROM blog_ingredient ingredient
                        WHERE ingredient.content_id = content.id
                    ),
                    'image', (
                        SELECT COALESCE(row_to_json(c_img), '{}'::json)
                        FROM content_image c_img
                        WHERE c_img.content_id = content.id
                        LIMIT 1
                    )
                )
            )
            FROM content
            WHERE content.blog_id = b.id
        ),
        'tags', b.tags,
        'slug', b.slug,
        'status', b.status,
        'view_count', (
            SELECT count(*)::bigint
            FROM blog_view
            WHERE blog_view.blog_id = b.id
        ),
        'like_count', (
            SELECT count(*)::bigint
            FROM blog_like
            WHERE blog_like.blog_id = b.id
        ),
        'is_liked', (
            SELECT CASE WHEN _user_id IS NOT NULL THEN
                EXISTS (SELECT 1 FROM blog_like bl WHERE bl.blog_id = b.id AND (bl.liked_by = _user_id))
            ELSE false END
        ),
        'is_bookmarked', (
            SELECT CASE WHEN _user_id IS NOT NULL THEN
                EXISTS (SELECT 1 FROM blog_bookmark bm WHERE bm.blog_id = b.id AND bm.user_id = _user_id)
            ELSE false END
        ),
        'relatives_posts', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', rel_b.id,
                    'title', rel_b.title,
                    'subtitle', rel_b.subtitle,
                    'slug', rel_b.slug,
                    'image', (
                        SELECT COALESCE(row_to_json(b_img), '{}'::json)
                        FROM blog_image b_img
                        WHERE b_img.blog_id = rel_b.id
                        LIMIT 1
                    )
                )
            ),
            '[]'::jsonb)
            FROM blog rel_b
            WHERE rel_b.category = current_category
            AND rel_b.status = 'published'
            AND rel_b.id != current_blog_id
            LIMIT 5
        )
    ) INTO new_blog
    FROM blog b
    WHERE b.slug = blog_slug AND (b.status = 'published' OR (_user_id IS NOT NULL AND _user_id = b.author_id));

    RETURN new_blog;
END;
$$;

GRANT EXECUTE ON FUNCTION get_blog_by_slug(TEXT, UUID) TO authenticated, anon;
