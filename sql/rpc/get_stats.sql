CREATE OR REPLACE FUNCTION get_stats(_profile_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'recipes', COALESCE(recipes_data, '[]'::jsonb),
        'blogs', COALESCE(blogs_data, '[]'::jsonb),
        'followers_count', COALESCE(followers_count, 0)
    ) INTO result
    FROM (
        -- Get top 10 recipes by engagement (rating * rating_count + like_count + comment_count + view_count)
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', r.id,
                'title', r.title,
                'slug', r.slug,
                'image_url', ri.url,
                'average_rating', COALESCE(r.avg_rating, 0),
                'rating_count', COALESCE(r.rating_count, 0),
                'like_count', COALESCE(r.like_count, 0),
                'comment_count', COALESCE(r.comment_count, 0),
                'view_count', COALESCE(r.view_count, 0),
                'engagement_score', COALESCE(r.engagement_score, 0)
            ) ORDER BY COALESCE(r.engagement_score, 0) DESC
        ) AS recipes_data
        FROM (
            SELECT 
                r.id,
                r.title,
                r.slug,
                r.author_id,
                COALESCE(ROUND(AVG(rating.rating)::numeric, 2), 0) as avg_rating,
                COUNT(rating.id) as rating_count,
                COUNT(DISTINCT "like".id) as like_count,
                COUNT(DISTINCT comment.id) as comment_count,
                COALESCE(view_stats.view_count, 0) as view_count,
                (
                    -- Engagement score: rating * rating_count + like_count + comment_count + view_count
                    COALESCE(ROUND(AVG(rating.rating)::numeric, 2), 0) * COUNT(rating.id) + 
                    COUNT(DISTINCT "like".id) + 
                    COUNT(DISTINCT comment.id) +
                    COALESCE(view_stats.view_count, 0)
                ) as engagement_score
            FROM recipe r
            LEFT JOIN recipe_rating rating ON r.id = rating.recipe_id
            LEFT JOIN recipe_like "like" ON r.id = "like".recipe_id
            LEFT JOIN recipe_comment comment ON r.id = comment.recipe_id
            LEFT JOIN LATERAL (
                SELECT COUNT(*)::bigint AS view_count
                FROM recipe_view rv 
                WHERE rv.recipe_id = r.id
            ) view_stats ON true
            WHERE r.author_id = _profile_id AND r.status = 'published'
            GROUP BY r.id, r.title, r.slug, r.author_id, view_stats.view_count
            ORDER BY engagement_score DESC
            LIMIT 10
        ) r
        LEFT JOIN recipe_image ri ON r.id = ri.recipe_id
    ) recipes,
    (
        -- Get top 10 blogs by engagement (view_count + like_count + comment_count)
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', b.id,
                'title', b.title,
                'slug', b.slug,
                'image_url', bi.url,
                'view_count', COALESCE(b.view_count, 0),
                'like_count', COALESCE(b.like_count, 0),
                'comment_count', COALESCE(b.comment_count, 0),
                'engagement_score', COALESCE(b.engagement_score, 0)
            ) ORDER BY COALESCE(b.engagement_score, 0) DESC
        ) AS blogs_data
        FROM (
            SELECT 
                b.id,
                b.title,
                b.slug,
                b.author_id,
                COALESCE(view_stats.view_count, 0) as view_count,
                COALESCE(like_stats.like_count, 0) as like_count,
                COALESCE(comment_stats.comment_count, 0) as comment_count,
                (
                    -- Engagement score: view_count + like_count + comment_count
                    COALESCE(view_stats.view_count, 0) + 
                    COALESCE(like_stats.like_count, 0) + 
                    COALESCE(comment_stats.comment_count, 0)
                ) as engagement_score
            FROM blog b
            LEFT JOIN LATERAL (
                SELECT COUNT(*)::bigint AS view_count
                FROM blog_view bv 
                WHERE bv.blog_id = b.id
            ) view_stats ON true
            LEFT JOIN LATERAL (
                SELECT COUNT(*)::bigint AS like_count
                FROM blog_like bl
                WHERE bl.blog_id = b.id
            ) like_stats ON true
            LEFT JOIN LATERAL (
                SELECT COUNT(*)::bigint AS comment_count
                FROM blog_comment bc
                WHERE bc.blog_id = b.id
            ) comment_stats ON true
            WHERE b.author_id = _profile_id AND b.status = 'published'
            ORDER BY engagement_score DESC
            LIMIT 10
        ) b
        LEFT JOIN blog_image bi ON b.id = bi.blog_id
    ) blogs,
    (
        -- Get follower count
        SELECT COUNT(*) AS followers_count
        FROM follower f
        WHERE f.profile_id = _profile_id
    ) followers;
    
    RETURN result;
END;
$$;