CREATE OR REPLACE FUNCTION get_featured_recipes()
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
        (
          SELECT row_to_json(img)
          FROM recipe_image img
          WHERE img.recipe_id = r.id
          LIMIT 1
        ) as image_data
      FROM recipe r
      LEFT JOIN recipe_rating rating ON r.id = rating.recipe_id
      WHERE r.status = 'published'
      GROUP BY r.id, r.title, r.description, r.difficulty, r.servings, r.tags, r.preptime, r.totaltime, r.status, r.slug, r.author_id
      ORDER BY COALESCE(ROUND(AVG(rating.rating)::numeric, 2), 0) DESC
      LIMIT 5
    ) r
   );
END;
$$;