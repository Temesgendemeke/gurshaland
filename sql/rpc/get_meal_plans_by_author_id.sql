CREATE OR REPLACE FUNCTION get_meal_plan_by_author_id(_author_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
BEGIN
   SELECT COALESCE(
    jsonb_agg(
        jsonb_build_object(
            'id', mp.id,
            'name', mp.name,
            'slug', mp.slug,
            'timeframe', mp.timeframe,
            'goal', mp.goal,
            'diet', mp.diet,
            'meals_per_day', mp.meals_per_day,
            'calories', mp.calories,
            'notes', mp.notes,
            'pro_tips', mp.pro_tips,
            'shopping_list', mp.shopping_list,
            'author_id', mp.author_id,
            'created_at', mp.created_at,
            'updated_at', mp.updated_at,
            'days', (
                SELECT COALESCE(
                    jsonb_agg(
                        jsonb_build_object(
                            'id', mpd.id,
                            'day', mpd.day,
                            'total_calories', mpd.total_calories,
                            'meal_plan_id', mpd.meal_plan_id,
                            'meals', (
                                SELECT COALESCE(
                                    jsonb_agg(
                                        jsonb_build_object(
                                            'id', mpm.id,
                                            'name', mpm.name,
                                            'description', mpm.description,
                                            'calories', mpm.calories,
                                            'protein', mpm.protein,
                                            'carbs', mpm.carbs,
                                            'fat', mpm.fat,
                                            'day_id', mpm.day_id
                                        )
                                    ),
                                    '[]'::jsonb
                                )
                                FROM meal_plan_meal mpm
                                WHERE mpm.day_id = mpd.id
                            )
                        ) ORDER BY mpd.day
                    ),
                    '[]'::jsonb
                )
                FROM meal_plan_day mpd
                WHERE mpd.meal_plan_id = mp.id
            )
        )
    ),
    '[]'::jsonb
   ) INTO result
   FROM meal_plan mp
   WHERE mp.author_id = _author_id;

   RETURN result;

END;
$$