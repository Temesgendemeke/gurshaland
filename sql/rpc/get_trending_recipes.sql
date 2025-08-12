CREATE OR REPLACE FUNCTION get_trending_recipes()
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
   RETURN (
    SELECT COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'title', r.title,
          'description', r.description,
          'difficulty', r.difficulty,
          'servings', r.servings,
          'average_rating', r.avg_rating,
          'rating_count', r.rating_count,
          'recent_rating_count', r.recent_rating_count,
          'recent_comment_count', r.recent_comment_count,
          'recent_like_count', r.recent_like_count,
          'trending_score', r.trending_score,
          'image', r.image_data,
          'tags', r.tags,
          'prepTime', r.preptime,
          'totalTime', r.totaltime,
          'status', r.status,
          'slug', r.slug,
          'author_id', r.author_id
        )
      ),
      '[]'::jsonb
    )
    FROM (
      SELECT 
        r.id,
        r.title,
        r.description,
        r.difficulty,
        r.servings,
        r.tags,
        r.preptime,
        r.totaltime,
        r.status,
        r.slug,
        r.author_id,
        COALESCE(ROUND(AVG(rating.rating)::numeric, 2), 0) as avg_rating,
        COUNT(rating.id) as rating_count,
        COUNT(CASE WHEN rating.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN rating.id END) as recent_rating_count,
        COUNT(DISTINCT CASE WHEN comment.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN comment.id END) as recent_comment_count,
        COUNT(DISTINCT CASE WHEN "like".created_at >= CURRENT_DATE - INTERVAL '7 days' THEN "like".id END) as recent_like_count,
        (
          -- Trending score: weighted combination of recent activity (last 7 days)
          COUNT(CASE WHEN rating.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN rating.id END) * 3 +  -- Recent ratings (weight: 3)
          COUNT(DISTINCT CASE WHEN comment.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN comment.id END) * 2 +  -- Recent comments (weight: 2)
          COUNT(DISTINCT CASE WHEN "like".created_at >= CURRENT_DATE - INTERVAL '7 days' THEN "like".id END) * 1 +  -- Recent likes (weight: 1)
          -- Bonus for overall popularity (even when no recent activity)
          CASE WHEN COUNT(rating.id) >= 5 THEN 4 ELSE 0 END +  -- Bonus for recipes with 5+ total ratings
          CASE WHEN COALESCE(ROUND(AVG(rating.rating)::numeric, 2), 0) >= 4.0 THEN 3 ELSE 0 END +  -- Bonus for high-rated recipes
          CASE WHEN COALESCE(ROUND(AVG(rating.rating)::numeric, 2), 0) >= 3.5 THEN 2 ELSE 0 END +  -- Bonus for good-rated recipes
          -- Bonus for being a newer recipe (encourage discovery)
          CASE WHEN r.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 2 ELSE 0 END +  -- Bonus for recipes created in last 30 days
          -- Base score for all recipes (ensures they get some points)
          1
        ) as trending_score,
        (
          SELECT row_to_json(img)
          FROM recipe_image img
          WHERE img.recipe_id = r.id
          LIMIT 1
        ) as image_data
      FROM recipe r
      LEFT JOIN recipe_rating rating ON r.id = rating.recipe_id
      LEFT JOIN recipe_comment comment ON r.id = comment.recipe_id
      LEFT JOIN recipe_like "like" ON r.id = "like".recipe_id
      WHERE r.status = 'published'
      GROUP BY r.id, r.title, r.description, r.difficulty, r.servings, r.tags, r.preptime, r.totaltime, r.status, r.slug, r.author_id, r.created_at
      ORDER BY trending_score DESC, avg_rating DESC, r.created_at DESC
      LIMIT 8
    ) r
   );
END;
$$;