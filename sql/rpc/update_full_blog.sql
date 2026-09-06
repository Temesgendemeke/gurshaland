CREATE OR REPLACE FUNCTION update_full_blog(
    _blog jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
   updated_blog jsonb;
   b_id BIGINT;
   c_elem jsonb;
   curr_content_id BIGINT;
BEGIN
   b_id := (_blog ->> 'id')::BIGINT;

   IF b_id IS NULL THEN
     RAISE EXCEPTION 'Blog ID is required for update';
   END IF;

   -- Update the main blog table
   UPDATE blog
   SET
      title = COALESCE(_blog ->> 'title', title),
      subtitle = COALESCE(_blog ->> 'subtitle', subtitle),
      category = COALESCE(_blog ->> 'category', category),
      tags = CASE 
        WHEN _blog -> 'tags' IS NULL THEN tags
        WHEN jsonb_typeof(_blog -> 'tags') != 'array' THEN tags
        ELSE ARRAY(SELECT jsonb_array_elements_text(_blog -> 'tags'))
      END,
      slug = COALESCE(_blog ->> 'slug', slug),
      read_time = COALESCE(_blog ->> 'read_time', read_time),
      status = COALESCE(_blog ->> 'status', status)
   WHERE id = b_id;

   -- Delete existing child rows to avoid foreign key violations
   DELETE FROM content_image 
   WHERE content_id IN (SELECT id FROM content WHERE blog_id = b_id);

   DELETE FROM blog_ingredient 
   WHERE content_id IN (SELECT id FROM content WHERE blog_id = b_id);

   DELETE FROM content WHERE blog_id = b_id;

   -- Insert new content if provided
   IF _blog ? 'contents' AND jsonb_typeof(_blog -> 'contents') = 'array' THEN
     FOR c_elem IN SELECT * FROM jsonb_array_elements(_blog -> 'contents') LOOP
       INSERT INTO content(
         blog_id, body, title, instructions, items
       )
       VALUES (
         b_id,
         c_elem ->> 'body',
         c_elem ->> 'title',
         CASE 
           WHEN c_elem -> 'instructions' IS NOT NULL AND jsonb_typeof(c_elem -> 'instructions') = 'array'
           THEN ARRAY(SELECT jsonb_array_elements_text(c_elem -> 'instructions'))
           ELSE '{}'::text[]
         END,
         CASE 
           WHEN c_elem -> 'items' IS NOT NULL AND jsonb_typeof(c_elem -> 'items') = 'array'
           THEN ARRAY(SELECT jsonb_array_elements_text(c_elem -> 'items'))
           ELSE '{}'::text[]
         END
       )
       RETURNING id INTO curr_content_id;

       -- Insert ingredients for each content's recipe
       IF (c_elem ? 'recipe' AND c_elem -> 'recipe' ? 'ingredients' AND jsonb_typeof(c_elem -> 'recipe' -> 'ingredients') = 'array') OR
          (c_elem ? 'ingredients' AND jsonb_typeof(c_elem -> 'ingredients') = 'array') THEN
         INSERT INTO blog_ingredient (
           content_id, amount, name, measurement
         )
         SELECT
             curr_content_id,
             (ing ->> 'amount')::INT,
             ing ->> 'name',
             COALESCE(ing ->> 'measurement', ing ->> 'unit')
         FROM jsonb_array_elements(
           CASE 
             WHEN c_elem ? 'recipe' AND c_elem -> 'recipe' ? 'ingredients' AND jsonb_typeof(c_elem -> 'recipe' -> 'ingredients') = 'array'
             THEN c_elem -> 'recipe' -> 'ingredients'
             ELSE c_elem -> 'ingredients'
           END
         ) AS ing;
       END IF;
     END LOOP;
   END IF;

   -- Update blog image if provided
   IF (_blog -> 'image') IS NOT NULL AND (_blog -> 'image' ->> 'url') IS NOT NULL AND (_blog -> 'image' ->> 'url') != '' THEN
     DELETE FROM blog_image WHERE blog_id = b_id;
     INSERT INTO blog_image(blog_id, url, path)
     VALUES (b_id, _blog -> 'image' ->> 'url', _blog -> 'image' ->> 'path');
   END IF;

   -- Return the updated blog
   SELECT jsonb_build_object(
        'id', b.id,
        'title', b.title,
        'subtitle', b.subtitle,
        'author_id', b.author_id,
        'author', (
            SELECT COALESCE(row_to_json(profile), '{}'::json)
            FROM profile
            WHERE b.author_id = profile.id
            LIMIT 1
        ),
        'created_at', b.created_at,
        'read_time', b.read_time,
        'category', b.category,
        'image', (
            SELECT COALESCE(row_to_json(b_img), '{}'::json)
            FROM blog_image b_img
            WHERE b_img.blog_id = b.id
            LIMIT 1
        ),
        'contents', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', c.id,
                    'body', c.body,
                    'title', c.title,
                    'instructions', c.instructions,
                    'items', c.items,
                    'ingredients', (
                        SELECT jsonb_agg(
                            jsonb_build_object(
                                'id', ingredient.id,
                                'amount', ingredient.amount,
                                'name', ingredient.name,
                                'measurement', ingredient.measurement
                            )
                        )
                        FROM blog_ingredient ingredient
                        WHERE ingredient.content_id = c.id
                    ),
                    'image', (
                        SELECT COALESCE(row_to_json(c_img), '{}'::json)
                        FROM content_image c_img
                        WHERE c_img.content_id = c.id
                        LIMIT 1
                    )
                )
            )
            FROM content c
            WHERE c.blog_id = b.id
        ),
        'tags', b.tags,
        'slug', b.slug,
        'status', b.status
    ) INTO updated_blog
    FROM blog b
    WHERE b.id = b_id;

    RETURN updated_blog;
END;
$$;

GRANT EXECUTE ON FUNCTION update_full_blog(jsonb) TO authenticated, anon;
