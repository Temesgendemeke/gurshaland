CREATE OR REPLACE FUNCTION save_meal_plan(
    _meal_plan jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _meal_plan_id BIGINT;
    _day_record jsonb;
    _meal_record jsonb;
    _day_id BIGINT;
    _result jsonb;
    _current_user_id UUID;
BEGIN
    -- Get current user ID
    _current_user_id := auth.uid();

    -- Ensure user is authenticated
    IF _current_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to save meal plans';
    END IF;

    -- Ensure the author_id matches the authenticated user (prevents spoofing)
    IF (_meal_plan ->> 'author_id') IS NULL OR (_meal_plan ->> 'author_id')::UUID IS DISTINCT FROM _current_user_id THEN
        RAISE EXCEPTION 'Unauthorized: author_id mismatch or missing';
    END IF;

    -- Insert into meal_plan
    INSERT INTO meal_plan (
        name,
        slug,
        timeframe,
        goal,
        diet,
        meals_per_day,
        calories,
        notes,
        pro_tips,
        shopping_list,
        author_id
    )
    VALUES (
        COALESCE(_meal_plan ->> 'name', 'Meal Plan ' || to_char(now(), 'YYYY-MM-DD HH24:MI')),
        COALESCE(_meal_plan ->> 'slug', 'meal-plan-' || extract(epoch from now())::text),
        _meal_plan ->> 'timeframe',
        _meal_plan ->> 'goal',
        _meal_plan ->> 'diet',
        (_meal_plan ->> 'meals_per_day')::int,
        (_meal_plan ->> 'calories')::int,
        _meal_plan ->> 'notes',
        _meal_plan -> 'pro_tips',
        _meal_plan -> 'shopping_list',
        (_meal_plan ->> 'author_id')::UUID
    )
    RETURNING id INTO _meal_plan_id;

    -- Loop through days
    FOR _day_record IN SELECT * FROM jsonb_array_elements(_meal_plan -> 'days')
    LOOP
        -- Insert day
        INSERT INTO meal_plan_day (
            meal_plan_id,
            total_calories,
            day
        )
        VALUES (
            _meal_plan_id,
            COALESCE((_day_record ->> 'total_calories')::int, 0),
            _day_record ->> 'day'
        )
        RETURNING id INTO _day_id;

        -- Loop through meals for this day
        FOR _meal_record IN SELECT * FROM jsonb_array_elements(_day_record -> 'meals')
        LOOP
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
        END LOOP;
    END LOOP;

    -- Return the full meal plan with relations
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
    ) INTO _result
    FROM meal_plan mp
    WHERE mp.id = _meal_plan_id;

    RETURN _result;
END;
$$;