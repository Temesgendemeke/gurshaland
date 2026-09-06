CREATE OR REPLACE FUNCTION get_bookmarked_blogs(_user_id UUID)
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
        'tags', b.tags,
        'slug', b.slug,
        'status', b.status
    ) AS blog
    FROM blog_bookmark bm
    JOIN blog b ON b.id = bm.blog_id
    WHERE bm.user_id = _user_id
      AND b.status = 'published'
    ORDER BY bm.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION get_bookmarked_blogs(UUID) TO authenticated, anon;
