CREATE OR REPLACE FUNCTION insert_full_recipe(
  _recipe jsonb,
  _ingredients jsonb,
  _instructions jsonb,
  _nutrition jsonb,
  _recipe_rating jsonb,
  _category jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  new_recipe_id INT;
  result jsonb;
BEGIN
  INSERT INTO recipe (
    title, description, difficulty, servings, rating,
    author_id, tags, prepTime,  cooktime, cultural_notes, status, slug
  )
  VALUES (
    _recipe ->> 'title',
    _recipe ->> 'description',
    _recipe ->> 'difficulty',
    (_recipe ->> 'servings')::int,
    (_recipe ->> 'rating')::numeric,
    (_recipe ->> 'author_id')::uuid,
    ARRAY(SELECT jsonb_array_elements_text(_recipe -> 'tags')),
    (_recipe ->> 'prepTime')::int,
    (_recipe ->> 'cooktime')::int,
    _recipe ->> 'cultural_notes',
    _recipe ->> 'status',
    _recipe ->> 'slug'
  )
  RETURNING id INTO new_recipe_id;

  INSERT INTO ingredient (recipe_id, item, amount, unit, notes)
  SELECT
    new_recipe_id,
    i ->> 'item',
    (i ->> 'amount')::int,
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

  INSERT INTO nutrition(recipe_id, calories, protein, carbs, fat, fiber)
  VALUES(
    new_recipe_id, 
     (_nutrition ->> 'calories')::int,
     (_nutrition ->> 'protein')::int,
     (_nutrition ->> 'carbs')::int,
     (_nutrition ->> 'fat')::int,
     (_nutrition ->> 'fiber')::int
  );

  -- Append new recipe_id to existing category row (don't create new rows)
  UPDATE recipe_category 
  SET recipe_id = COALESCE(recipe_id, ARRAY[]::int[]) || new_recipe_id::int
  WHERE id = (_category ->> 'id')::int;
  


  SELECT jsonb_build_object(
    'recipe', jsonb_build_object(
      'id', r.id,
      'title', r.title,
      'description', r.description,
      'difficulty', r.difficulty,
      'servings', r.servings,
      'rating', r.rating,
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