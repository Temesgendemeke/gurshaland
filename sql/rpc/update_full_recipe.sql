CREATE OR REPLACE FUNCTION update_full_recipe(
  _recipe jsonb,
  _ingredients jsonb,
  _instructions jsonb,
  _nutrition jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  recipe_id_val bigint;
  result jsonb;
BEGIN
  -- Extract recipe ID
  recipe_id_val := NULLIF(_recipe ->> 'id', '')::bigint;
  
  IF recipe_id_val IS NULL THEN
    RAISE EXCEPTION 'Recipe ID is required and must be a valid number';
  END IF;
  
  -- Update the main recipe table
  UPDATE recipe
  SET
    title = COALESCE(_recipe ->> 'title', title),
    description = COALESCE(_recipe ->> 'description', description),
    difficulty = COALESCE(_recipe ->> 'difficulty', difficulty),
    servings = COALESCE((_recipe ->> 'servings')::int, servings),
    tags = CASE 
      WHEN _recipe -> 'tags' IS NULL THEN tags
      WHEN jsonb_typeof(_recipe -> 'tags') != 'array' THEN tags
      ELSE ARRAY(SELECT jsonb_array_elements_text(_recipe -> 'tags'))
    END,
    preptime = COALESCE((_recipe ->> 'preptime')::int, preptime),
    cooktime = COALESCE((_recipe ->> 'cooktime')::int, cooktime),
    cultural_notes = COALESCE(_recipe ->> 'cultural_notes', cultural_notes),
    status = COALESCE(_recipe ->> 'status', status),
    slug = COALESCE(_recipe ->> 'slug', slug),
    youtube_video_id = COALESCE(_recipe ->> 'youtube_video_id', youtube_video_id)
  WHERE id = recipe_id_val;

  -- Delete old ingredients and insert new ones
  DELETE FROM ingredient WHERE recipe_id = recipe_id_val;
  
  INSERT INTO ingredient (recipe_id, item, amount, unit, notes)
  SELECT
    recipe_id_val,
    COALESCE(i ->> 'item', ''),
    CASE 
      WHEN i -> 'amount' IS NULL OR i ->> 'amount' = '' OR i ->> 'amount' = 'null' THEN NULL
      ELSE (i ->> 'amount')::real
    END,
    NULLIF(NULLIF(i ->> 'unit', ''), 'null'),
    NULLIF(NULLIF(i ->> 'notes', ''), 'null')
  FROM jsonb_array_elements(_ingredients) AS i;

  -- Delete old instructions and their images, then insert new ones
  -- First, delete instruction images for existing instructions
  DELETE FROM instruction_image 
  WHERE instruction_id IN (
    SELECT id FROM instruction WHERE recipe_id = recipe_id_val
  );
  
  -- Delete old instructions
  DELETE FROM instruction WHERE recipe_id = recipe_id_val;

  -- Insert new instructions with their images
  WITH instruction_data AS (
    SELECT elem AS ins_obj, ord
    FROM jsonb_array_elements(COALESCE(_instructions, '[]'::jsonb)) WITH ORDINALITY AS t(elem, ord)
  ),
  inserted AS (
    INSERT INTO instruction (recipe_id, step, title, description, time, tips)
    SELECT
      recipe_id_val,
      COALESCE((instruction_data.ins_obj ->> 'step')::int, instruction_data.ord::int),
      NULLIF(COALESCE(instruction_data.ins_obj ->> 'title', ''), ''),
      NULLIF(COALESCE(instruction_data.ins_obj ->> 'description', ''), ''),
      CASE 
        WHEN instruction_data.ins_obj -> 'time' IS NULL THEN NULL
        WHEN instruction_data.ins_obj -> 'time' = 'null'::jsonb THEN NULL
        WHEN jsonb_typeof(instruction_data.ins_obj -> 'time') = 'number' THEN (instruction_data.ins_obj ->> 'time')::text
        ELSE NULLIF(instruction_data.ins_obj ->> 'time', '')
      END,
      NULLIF(instruction_data.ins_obj ->> 'tips', '')
    FROM instruction_data
    RETURNING id, step
  )
  INSERT INTO instruction_image(instruction_id, url, path)
  SELECT
    i.id,
    img_data.url_val,
    img_data.path_val
  FROM inserted i
  CROSS JOIN LATERAL (
    SELECT 
      instruction_data.ins_obj -> 'image' ->> 'url' AS url_val,
      instruction_data.ins_obj -> 'image' ->> 'path' AS path_val
    FROM instruction_data
    WHERE (instruction_data.ins_obj ->> 'step')::int = i.step
      AND instruction_data.ins_obj -> 'image' IS NOT NULL
      AND instruction_data.ins_obj -> 'image' ->> 'url' IS NOT NULL
      AND instruction_data.ins_obj -> 'image' ->> 'url' != ''
    LIMIT 1
  ) img_data;

  -- Update or insert recipe image
  -- Delete existing recipe image if new one is provided
  IF (_recipe -> 'image') IS NOT NULL AND (_recipe -> 'image' ->> 'url') IS NOT NULL AND (_recipe -> 'image' ->> 'url') != '' THEN
    DELETE FROM recipe_image WHERE recipe_id = recipe_id_val;
    
    INSERT INTO recipe_image(recipe_id, url, path)
    VALUES (
      recipe_id_val,
      _recipe -> 'image' ->> 'url',
      _recipe -> 'image' ->> 'path'
    );
  END IF;

  -- Update or insert nutrition
  -- Delete existing nutrition record if it exists
  DELETE FROM nutrition WHERE recipe_id = recipe_id_val;
  
  -- Insert new nutrition record
  INSERT INTO nutrition(recipe_id, calories, protein, carbs, fat, fiber)
  VALUES(
    recipe_id_val,
    COALESCE((_nutrition ->> 'calories')::int, 0),
    COALESCE((_nutrition ->> 'protein')::int, 0),
    COALESCE((_nutrition ->> 'carbs')::int, 0),
    COALESCE((_nutrition ->> 'fat')::int, 0),
    COALESCE((_nutrition ->> 'fiber')::int, 0)
  );

  -- Return the updated recipe
  SELECT jsonb_build_object(
    'recipe', jsonb_build_object(
      'id', r.id,
      'title', r.title,
      'description', r.description,
      'difficulty', r.difficulty,
      'servings', r.servings,
      'youtube_video_id', r.youtube_video_id,
      'author_id', r.author_id,
      'tags', r.tags,
      'preptime', r.preptime,
      'cooktime', r.cooktime,
      'cultural_notes', r.cultural_notes,
      'status', r.status,
      'slug', r.slug,
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
      WHERE ing.recipe_id = recipe_id_val
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
      WHERE ins.recipe_id = recipe_id_val
    )
  )
  INTO result
  FROM recipe r
  WHERE r.id = recipe_id_val;

  RETURN result;
END;
$$;
