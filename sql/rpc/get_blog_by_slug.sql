CREATE OR REPLACE FUNCTION get_blog_by_slug(blog_slug TEXT)
RETURNS JSONB AS $$
DECLARE
    new_blog JSONB;
BEGIN
    SELECT jsonb_build_object(
        'id', b.id,
        'title', b.title,
        'subtitle', b.subtitle,
        'author_id', b.author_id,
        'author', (
            SELECT COALESCE(row_to_json(profile), '{}'::jsonb)
            FROM profile
            WHERE b.author_id = profile.id
            LIMIT 1
        ),
        'created_at', b.created_at,
        'read_time', b.read_time,
        'category', b.category,
        'image', (
            SELECT COALESCE(row_to_json(b_img), '{}'::jsonb)
            FROM blog_image b_img
            WHERE b_img.blog_id = b.id
            LIMIT 1
        ),
        'content', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', content.id,
                    'label', content.label,
                    'content', content.content,
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
                        SELECT COALESCE(row_to_json(c_img), '{}'::jsonb)
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
        'status', b.status
    ) INTO new_blog
    FROM blog b
    WHERE b.slug = blog_slug AND b.status = 'published';

    RETURN new_blog;
END;
$$ LANGUAGE plpgsql;