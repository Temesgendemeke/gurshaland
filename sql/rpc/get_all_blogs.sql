CREATE OR REPLACE FUNCTION get_all_blogs()
RETURNS TABLE(blog jsonb)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT jsonb_build_object(
        'id', b.id,
        'title', b.title,
        'subtitle', b.subtitle,
        'author_id', b.author_id,
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
        'status', b.status
    ) AS blog
    FROM blog b
    WHERE b.status = 'published';
END;
$$;