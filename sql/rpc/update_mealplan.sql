CREATE OR REPLACE FUNCTION update_mealplan(_meal_plan jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    result jsonb;
    _day_record jsonb;
    _meal_record jsonb;
    _day_id BIGINT;
BEGIN
    UPDATE meal_plan
    SET 
        name = COALESCE(_meal_plan ->> 'name', name),
        slug = COALESCE(_meal_plan ->> 'slug', slug),
        timeframe = COALESCE(_meal_plan ->> 'timeframe', timeframe),
        goal = COALESCE(_meal_plan ->> 'goal', goal),
        diet = COALESCE(_meal_plan ->> 'diet', diet),
        meals_per_day = COALESCE((_meal_plan ->> 'meals_per_day')::int, meals_per_day),
        calories = COALESCE((_meal_plan ->> 'calories')::int, calories),
        notes = COALESCE(_meal_plan ->> 'notes', notes),
        pro_tips = COALESCE(_meal_plan -> 'pro_tips', pro_tips),
        shopping_list = COALESCE(_meal_plan -> 'shopping_list', shopping_list),
        author_id = COALESCE((_meal_plan ->> 'author_id')::UUID, author_id),
        updated_at = NOW()
    WHERE id = (_meal_plan ->> 'id')::int;

    -- Handle Days
    -- 1. Delete days not in the input
    DELETE FROM meal_plan_day
    WHERE meal_plan_id = (_meal_plan ->> 'id')::int
    AND id NOT IN (
        SELECT (value ->> 'id')::int
        FROM jsonb_array_elements(_meal_plan -> 'days')
        WHERE value ->> 'id' IS NOT NULL
    );

    -- 2. Loop through days
    FOR _day_record IN SELECT * FROM jsonb_array_elements(_meal_plan -> 'days')
    LOOP
        IF (_day_record ->> 'id') IS NOT NULL THEN
            -- Update existing day
            UPDATE meal_plan_day
            SET
                day = _day_record ->> 'day',
                total_calories = (_day_record ->> 'total_calories')::int,
                updated_at = NOW()
            WHERE id = (_day_record ->> 'id')::int
            RETURNING id INTO _day_id;
        ELSE
            -- Insert new day
            INSERT INTO meal_plan_day (
                meal_plan_id,
                day,
                total_calories
            )
            VALUES (
                (_meal_plan ->> 'id')::int,
                _day_record ->> 'day',
                COALESCE((_day_record ->> 'total_calories')::int, 0)
            )
            RETURNING id INTO _day_id;
        END IF;

        -- Handle Meals for this Day
        -- 1. Delete meals not in the input for this day
        DELETE FROM meal_plan_meal
        WHERE day_id = _day_id
        AND id NOT IN (
            SELECT (value ->> 'id')::int
            FROM jsonb_array_elements(_day_record -> 'meals')
            WHERE value ->> 'id' IS NOT NULL
        );

        -- 2. Loop through meals
        FOR _meal_record IN SELECT * FROM jsonb_array_elements(_day_record -> 'meals')
        LOOP
            IF (_meal_record ->> 'id') IS NOT NULL THEN
                -- Update existing meal
                UPDATE meal_plan_meal
                SET
                    name = _meal_record ->> 'name',
                    description = _meal_record ->> 'description',
                    calories = (_meal_record ->> 'calories')::int,
                    protein = (_meal_record ->> 'protein')::int,
                    carbs = (_meal_record ->> 'carbs')::int,
                    fat = (_meal_record ->> 'fat')::int,
                    updated_at = NOW()
                WHERE id = (_meal_record ->> 'id')::int;
            ELSE
                -- Insert new meal
                INSERT INTO meal_plan_meal (
                    day_id,
                    name,
                    description,
                    calories,
                    protein,
                    carbs,
                    fat
                )
                VALUES (
                    _day_id,
                    _meal_record ->> 'name',
                    _meal_record ->> 'description',
                    (_meal_record ->> 'calories')::int,
                    (_meal_record ->> 'protein')::int,
                    (_meal_record ->> 'carbs')::int,
                    (_meal_record ->> 'fat')::int
                );
            END IF;
        END LOOP;
    END LOOP;
    SELECT jsonb_build_object(
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
        'days', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', mpd.id,
                    'day', mpd.day,
                    'total_calories', mpd.total_calories,
                    'meals', COALESCE((
                        SELECT jsonb_agg(
                            jsonb_build_object(
                                'id', mpm.id,
                                'name', mpm.name,
                                'description', mpm.description,
                                'calories', mpm.calories,
                                'protein', mpm.protein,
                                'carbs', mpm.carbs,
                                'fat', mpm.fat
                            )
                        )
                        FROM meal_plan_meal mpm
                        WHERE mpm.day_id = mpd.id
                    ), '[]'::jsonb)
                ) ORDER BY mpd.id
            )
            FROM meal_plan_day mpd
            WHERE mpd.meal_plan_id = mp.id
        ), '[]'::jsonb)
    ) INTO result
    FROM meal_plan mp
    WHERE mp.id = (_meal_plan ->> 'id')::int;

    RETURN result;
END;
$$