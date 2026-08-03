CREATE OR REPLACE FUNCTION update_full_blog(
    _blog jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$

DECLARE
   updated_blog jsonb;
   b_id BIGINT;
BEGIN
   b_id := (_blog ->> 'id')::BIGINT;

   -- Update the main blog table
   UPDATE blog
   SET
      title = _blog ->> 'title',
      subtitle = _blog ->> 'subtitle',
      category = _blog ->> 'category',
      tags = ARRAY(SELECT jsonb_array_elements_text(_blog -> 'tags')),
      slug = _blog ->> 'slug',
      read_time = _blog ->> 'read_time',
      status = _blog ->> 'status'
   WHERE id = b_id;



   -- Delete existing content and ingredients (cascade will handle ingredients)
   DELETE FROM content WHERE content.blog_id = b_id;

   -- Insert new content
   WITH inserted_content AS (
      INSERT INTO content(
        blog_id, body, title, instructions, items
      )
      SELECT
           b_id,
           c ->> 'body',
           c ->> 'title',
           ARRAY(SELECT jsonb_array_elements_text(c -> 'instructions')),
           ARRAY(SELECT jsonb_array_elements_text(c -> 'items'))
        FROM jsonb_array_elements(_blog -> 'contents') as c
      RETURNING id, (SELECT row_number() OVER ())::int as content_index
   )
   -- Insert ingredients for each content's recipe
   INSERT INTO blog_ingredient (
     content_id, amount, name
   )
   SELECT
       ic.id,
       (ing ->> 'amount')::INT,
       ing ->> 'name'
   FROM jsonb_array_elements(_blog -> 'contents') WITH ORDINALITY AS c(content_data, content_idx)
   CROSS JOIN LATERAL jsonb_array_elements(c.content_data -> 'recipe' -> 'ingredients') AS ing
   JOIN inserted_content ic ON ic.content_index = c.content_idx::int;

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
                                'name', ingredient.name
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
