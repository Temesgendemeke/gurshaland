CREATE OR REPLACE FUNCTION get_all_blogs()
RETURNS TABLE(blog jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    RETURN QUERY
    SELECT jsonb_build_object(
        'id', b.id,
        'title', b.title,
        'subtitle', b.subtitle,
        'author_id', b.author_id,
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
        'status', b.status
    ) AS blog
    FROM blog b
    WHERE b.status = 'published';
END;
$$;

GRANT EXECUTE ON FUNCTION get_all_blogs() TO authenticated, anon;