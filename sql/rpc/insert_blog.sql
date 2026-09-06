CREATE OR REPLACE FUNCTION insert_blog(
  _blog jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
   new_blog jsonb;
   blog_id BIGINT;
BEGIN
   INSERT INTO blog (
     title, subtitle, author_id, read_time, category, tags, slug, status
   )
   VALUES (
    _blog ->> 'title',
    _blog ->> 'subtitle',
    (_blog ->> 'author_id')::UUID,
    _blog ->> 'read_time',
    _blog ->> 'category',
    CASE 
      WHEN _blog -> 'tags' IS NULL THEN '{}'::text[]
      WHEN jsonb_typeof(_blog -> 'tags') != 'array' THEN '{}'::text[]
      ELSE ARRAY(SELECT jsonb_array_elements_text(_blog -> 'tags'))
    END,
    _blog ->> 'slug',
    COALESCE(_blog ->> 'status', 'draft')
   ) RETURNING id INTO blog_id;

   INSERT INTO content(
     blog_id, body, title, instructions, items
   )
   SELECT
        blog_id,
        c ->> 'body',
        c ->> 'title',
        CASE 
          WHEN c -> 'instructions' IS NOT NULL AND jsonb_typeof(c -> 'instructions') = 'array' 
          THEN ARRAY(SELECT jsonb_array_elements_text(c -> 'instructions'))
          ELSE '{}'::text[]
        END,
        CASE 
          WHEN c -> 'items' IS NOT NULL AND jsonb_typeof(c -> 'items') = 'array' 
          THEN ARRAY(SELECT jsonb_array_elements_text(c -> 'items'))
          ELSE '{}'::text[]
        END
     FROM jsonb_array_elements(COALESCE(_blog -> 'contents', '[]'::jsonb)) as c;

   IF _blog ? 'ingredients' AND jsonb_typeof(_blog -> 'ingredients') = 'array' THEN
     INSERT INTO blog_ingredient (
       content_id, amount, name, measurement
     )
     SELECT
         (i ->> 'content_id')::BIGINT,
         (i ->> 'amount')::INT,
         i ->> 'name',
         COALESCE(i ->> 'measurement', i ->> 'unit')
     FROM jsonb_array_elements(_blog -> 'ingredients') as i;
   END IF;

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
                    'id', content.id,
                    'body', content.body,
                    'title', content.title,
                    'instructions', content.instructions,
                    'items', content.items,
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
                        WHERE ingredient.content_id = content.id
                    ),
                    'image', (
                        SELECT COALESCE(row_to_json(c_img), '{}'::json)
                        FROM content_image c_img
                        WHERE c_img.content_id = content.id
                        LIMIT 1
                    )
                )
            )
            FROM content
            WHERE content.blog_id = b.id
        ),
        'tags', b.tags,
        'slug', b.slug,
        'status', b.status
    ) INTO new_blog
    FROM blog b
    WHERE b.id = blog_id;

    RETURN new_blog;
END;
$$;

GRANT EXECUTE ON FUNCTION insert_blog(jsonb) TO authenticated, anon;
