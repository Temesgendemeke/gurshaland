DECLARE
  new_recipe_id INT;
  result jsonb;
BEGIN
  INSERT INTO recipe (
    title, description, difficulty, servings, 
    author_id, tags, prepTime,  cooktime, cultural_notes, status, slug, youtube_video_id
  )
  VALUES (
    _recipe ->> 'title',
    _recipe ->> 'description',
    _recipe ->> 'difficulty',
    (_recipe ->> 'servings')::int,
    (_recipe ->> 'author_id')::uuid,
    ARRAY(SELECT jsonb_array_elements_text(_recipe -> 'tags')),
    (_recipe ->> 'prepTime')::int,
    (_recipe ->> 'cooktime')::int,
    _recipe ->> 'cultural_notes',
    _recipe ->> 'status',
    _recipe ->> 'slug',
    _recipe ->> 'youtube_video_id'
  )
  RETURNING id INTO new_recipe_id;

  INSERT INTO ingredient (recipe_id, item, amount, unit, notes)
  SELECT
    new_recipe_id,
    i ->> 'item',
    (i ->> 'amount')::float,
    i ->> 'unit',
    i ->> 'notes'
  FROM jsonb_array_elements(_ingredients) AS i;

  INSERT INTO instruction (recipe_id, step, title, description, time, tips)
  SELECT
    new_recipe_id,
    (i ->> 'step')::int,
    i ->> 'title',
    i ->> 'description',
    i ->> 'time',
    i ->> 'tips'
  FROM jsonb_array_elements(_instructions) AS i;

  INSERT INTO recipe_image(recipe_id, url, path)
  VALUES(
   (new_recipe_id)::int, 
  _recipe -> 'image' ->> 'url',
  _recipe -> 'image' ->> 'path'
  );



  INSERT INTO instruction_image(instruction_id, url, path)
   SELECT
       (ins ->> 'instruction_id')::int,
        ins -> 'image' ->> 'url',
        ins -> 'image' ->> 'path'
   FROM jsonb_array_elements(_instructions) AS ins
   WHERE ins -> 'image' IS NOT NULL;

  INSERT INTO nutrition(recipe_id, calories, protein, carbs, fat, fiber)
  VALUES(
    new_recipe_id, 
     (_nutrition ->> 'calories')::int,
     (_nutrition ->> 'protein')::int,
     (_nutrition ->> 'carbs')::int,
     (_nutrition ->> 'fat')::int,
     (_nutrition ->> 'fiber')::int
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
      'prepTime', r.prepTime,
      'cooktime', r.cooktime,
      'cultural_notes', r.cultural_notes,
      'status', r.status,
      'slug', r.slug,
      'image', (
        SELECT row_to_json(img)
        FROM recipe_image img
        WHERE img.recipe_id = r.id
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
        )
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