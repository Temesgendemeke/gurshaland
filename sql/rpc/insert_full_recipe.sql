CREATE OR REPLACE FUNCTION insert_full_recipe(
  _recipe jsonb,
  _ingredients jsonb,
  _instructions jsonb,
  _nutrition jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_recipe_id BIGINT;
  result jsonb;
BEGIN
  INSERT INTO recipe (
    title, description, difficulty, servings,
    author_id, tags, preptime, cooktime, totaltime,
    cultural_notes, status, slug, youtube_video_id, category_id
  )
  VALUES (
    _recipe ->> 'title',
    _recipe ->> 'description',
    _recipe ->> 'difficulty',
    COALESCE((_recipe ->> 'servings')::int, 1),
    (_recipe ->> 'author_id')::uuid,
    CASE 
      WHEN _recipe -> 'tags' IS NULL THEN '{}'::text[]
      WHEN jsonb_typeof(_recipe -> 'tags') != 'array' THEN '{}'::text[]
      ELSE ARRAY(SELECT jsonb_array_elements_text(_recipe -> 'tags'))
    END,
    COALESCE((_recipe ->> 'preptime')::int, (_recipe ->> 'prepTime')::int, 0),
    COALESCE((_recipe ->> 'cooktime')::int, (_recipe ->> 'cookTime')::int, 0),
    COALESCE(
      (_recipe ->> 'totaltime')::int,
      COALESCE((_recipe ->> 'preptime')::int, (_recipe ->> 'prepTime')::int, 0) + COALESCE((_recipe ->> 'cooktime')::int, (_recipe ->> 'cookTime')::int, 0)
    ),
    COALESCE(_recipe ->> 'cultural_notes', _recipe ->> 'culturalNote'),
    COALESCE(_recipe ->> 'status', 'draft'),
    _recipe ->> 'slug',
    _recipe ->> 'youtube_video_id',
    CASE 
      WHEN _recipe ? 'category_id' AND _recipe ->> 'category_id' IS NOT NULL AND _recipe ->> 'category_id' != '' 
      THEN (_recipe ->> 'category_id')::bigint 
      ELSE NULL 
    END
  )
  RETURNING id INTO new_recipe_id;

  INSERT INTO ingredient (recipe_id, item, amount, unit, notes)
  SELECT
    new_recipe_id,
    COALESCE(i ->> 'item', ''),
    CASE 
      WHEN i -> 'amount' IS NULL OR i ->> 'amount' = '' OR i ->> 'amount' = 'null' THEN NULL
      ELSE (i ->> 'amount')::real
    END,
    NULLIF(NULLIF(i ->> 'unit', ''), 'null'),
    NULLIF(NULLIF(i ->> 'notes', ''), 'null')
  FROM jsonb_array_elements(COALESCE(_ingredients, '[]'::jsonb)) AS i;

  WITH ins AS (
      SELECT elem AS ins_obj, ord
      FROM jsonb_array_elements(COALESCE(_instructions, '[]'::jsonb)) WITH ORDINALITY AS t(elem, ord)
  ),
  inserted AS (
      INSERT INTO instruction (recipe_id, step, title, description, time, tips)
      SELECT
          new_recipe_id,
          COALESCE((ins_obj ->> 'step')::int, ord::int),
          COALESCE(ins_obj ->> 'title', ''),
          COALESCE(ins_obj ->> 'description', ''),
          CASE 
            WHEN ins_obj -> 'time' IS NULL THEN NULL
            WHEN ins_obj -> 'time' = 'null'::jsonb THEN NULL
            WHEN jsonb_typeof(ins_obj -> 'time') = 'number' THEN (ins_obj ->> 'time')::text
            ELSE NULLIF(ins_obj ->> 'time', '')
          END,
          NULLIF(ins_obj ->> 'tips', '')
      FROM ins
      RETURNING id, step
  )
  INSERT INTO instruction_image(instruction_id, url, path)
  SELECT
      i.id,
      ins.ins_obj -> 'image' ->> 'url',
      ins.ins_obj -> 'image' ->> 'path'
  FROM inserted i
  JOIN ins ON COALESCE((ins.ins_obj ->> 'step')::int, ins.ord::int) = i.step
  WHERE ins.ins_obj -> 'image' IS NOT NULL
    AND ins.ins_obj -> 'image' ->> 'url' IS NOT NULL
    AND ins.ins_obj -> 'image' ->> 'url' != '';

  IF (_recipe -> 'image') IS NOT NULL AND (_recipe -> 'image' ->> 'url') IS NOT NULL AND (_recipe -> 'image' ->> 'url') != '' THEN
    INSERT INTO recipe_image(recipe_id, url, path)
    VALUES(
      new_recipe_id,
      _recipe -> 'image' ->> 'url',
      _recipe -> 'image' ->> 'path'
    );
  END IF;

  INSERT INTO nutrition(recipe_id, calories, protein, carbs, fat, fiber)
  VALUES(
    new_recipe_id,
    COALESCE((_nutrition ->> 'calories')::int, 0),
    COALESCE((_nutrition ->> 'protein')::int, 0),
    COALESCE((_nutrition ->> 'carbs')::int, 0),
    COALESCE((_nutrition ->> 'fat')::int, 0),
    COALESCE((_nutrition ->> 'fiber')::int, 0)
  );

  SELECT jsonb_build_object(
    'recipe', jsonb_build_object(
      'id', r.id,
      'title', r.title,
      'description', r.description,
      'difficulty', r.difficulty,
      'servings', r.servings,
      'youtube_video_id', r.youtube_video_id,
      'rating', (
        SELECT COALESCE(jsonb_agg(rating), '[]'::jsonb)
        FROM recipe_rating rating
        WHERE rating.recipe_id = r.id
      ),
      'average_rating', (
        SELECT COALESCE(ROUND(AVG(rating.rating)::numeric, 2), 0)
        FROM recipe_rating rating
        WHERE rating.recipe_id = r.id
      ),
      'author_id', r.author_id,
      'tags', r.tags,
      'preptime', r.preptime,
      'cooktime', r.cooktime,
      'totaltime', r.totaltime,
      'cultural_notes', r.cultural_notes,
      'status', r.status,
      'slug', r.slug,
      'category_id', r.category_id,
      'image', (
        SELECT row_to_json(img)
        FROM recipe_image img
        WHERE img.recipe_id = r.id
        LIMIT 1
      )
    ),
    'ingredients', (
      SELECT jsonb_agg(to_jsonb(ing))
      FROM ingredient ing
      WHERE ing.recipe_id = new_recipe_id
    ),
    'instructions', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', ins.id,
          'step', ins.step,
          'title', ins.title,
          'description', ins.description,
          'time', ins.time,
          'tips', ins.tips,
          'image', (
            SELECT row_to_json(img)
            FROM instruction_image img
            WHERE img.instruction_id = ins.id
            LIMIT 1
          )
        ) ORDER BY ins.step
      )
      FROM instruction ins
      WHERE ins.recipe_id = new_recipe_id
    )
  )
  INTO result
  FROM recipe r
  WHERE r.id = new_recipe_id;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION insert_full_recipe(jsonb, jsonb, jsonb, jsonb) TO authenticated, anon;
