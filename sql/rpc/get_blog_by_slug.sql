CREATE OR REPLACE FUNCTION get_blog_by_slug(blog_slug TEXT)
RETURNS JSONB 
LANGUAGE plpgsql
AS $$
DECLARE
    new_blog JSONB;
    current_blog_id INTEGER;
    current_category TEXT;
BEGIN
    -- Get the current blog's ID and category first
    SELECT b.id, b.category INTO current_blog_id, current_category
    FROM blog b
    WHERE b.slug = blog_slug AND b.status = 'published';
    
    -- If blog not found, return null
    IF current_blog_id IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT jsonb_build_object(
        'id', b.id,
        'title', b.title,
        'subtitle', b.subtitle,
        'author_id', b.author_id,  
        'featured', b.featured,
        'author', (
            SELECT COALESCE(row_to_json(profile), '{}'::json)
            FROM profile
            WHERE b.author_id = profile.id
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
                                'name', ingredient.name
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
    WHERE b.slug = blog_slug AND b.status = 'published';

    RETURN new_blog;
END;
$$;


