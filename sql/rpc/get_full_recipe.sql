CREATE OR REPLACE FUNCTION get_full_recipe(
    _slug text,
    _user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE 
   result jsonb;
BEGIN 
    SELECT jsonb_build_object(
        'id', r.id,
        'title', r.title,
        'description', r.description,
        'difficulty', r.difficulty,
        'servings', r.servings,
        'youtube_video_id', r.youtube_video_id,
        'rating', (
            SELECT COALESCE(jsonb_agg(recipe_rating), '[]'::jsonb)
            FROM recipe_rating 
            WHERE recipe_rating.recipe_id = r.id
        ),
        'average_rating', (
            SELECT COALESCE(ROUND(AVG(rating.rating)::numeric, 2), 0)
            FROM recipe_rating rating
            WHERE rating.recipe_id = r.id
        ),
        'slug', r.slug,
        'author', (
            SELECT jsonb_build_object(
                    'id', p.id,
                    'username', p.username,
                    'full_name', p.full_name,
                    'avatar', p.avatar_url,
                    'bio', p.bio,
                    'recipes', (
                        SELECT count(*) FROM recipe
                        WHERE author_id = p.id
                    )
                )
            FROM profile p
            WHERE p.id = r.author_id
            LIMIT 1
        ),
        'image', (
          SELECT row_to_json(img)
          FROM recipe_image img
          WHERE img.recipe_id = r.id
          LIMIT 1
        ),
        'tags', r.tags,
        'preptime', r.preptime,
        'cooktime', r.cooktime,
        'status', r.status,
        'ingredients', (
            SELECT COALESCE(jsonb_agg(i), '[]'::jsonb)
            FROM ingredient i
            WHERE i.recipe_id = r.id
        ),
        'instructions', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', ins.id,
                    'step', ins.step,
                    'description', ins.description,
                    'tips', ins.tips,
                    'time', ins.time,
                    'image', (
                      SELECT row_to_json(img)
                      FROM instruction_image img
                      WHERE img.instruction_id = ins.id
                    )
                )
            ), '[]'::jsonb)
            FROM instruction ins
            WHERE ins.recipe_id = r.id
        ),
        'nutrition', (
            SELECT row_to_json(n)
            FROM nutrition n
            WHERE n.recipe_id = r.id
            LIMIT 1
        ),
        'reviews', (
            SELECT COALESCE(count(*),0)
            FROM recipe_comment
            WHERE recipe_comment.recipe_id = r.id
        ),
        'comments', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', comment.id,
                'author', (
                    SELECT row_to_json(profile)
                    FROM profile 
                    WHERE comment.author_id = profile.id
                    LIMIT 1
                ),
                'author_id', comment.author_id,
                'comment', comment.comment,
                'created_at', comment.created_at,
                'rating', (
                    SELECT rating
                    FROM recipe_rating
                    WHERE recipe_rating.user_id = comment.author_id
                    LIMIT 1
                )
            )), '[]'::jsonb)
            FROM recipe_comment comment
            WHERE comment.recipe_id = r.id
        ),
        'likes', (
            SELECT COALESCE(jsonb_agg(l), '[]'::jsonb)
            FROM recipe_like l
            WHERE l.recipe_id = r.id 
        )
    )
    INTO result
    FROM recipe r
    WHERE r.slug = _slug 
      AND (
        r.status = 'published' 
        OR (_user_id IS NOT NULL AND r.author_id = _user_id)
      );

    RETURN result;
END
$$