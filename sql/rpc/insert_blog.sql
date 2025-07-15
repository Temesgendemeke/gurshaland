CREATE OR REPLACE FUNCTION insert_blog(
  _blog jsonb,
  _contents jsonb,
  _ingredients jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
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
    _blog ->> 'tags',
    _blog ->> 'slug',
    _blog ->> 'status'
   ) RETURNING id INTO blog_id;

   INSERT INTO content(
     blog_id, label, content, title, instructions, items
   )
   SELECT 
        blog_id,
        c ->> 'label',
        c ->> 'content',
        c ->> 'title',
        ARRAY(SELECT jsonb_array_elements_text(c -> 'instructions')),
        ARRAY(SELECT jsonb_array_elements_text(c -> 'items'))
     FROM jsonb_array_elements(_contents) as c;

   INSERT INTO ingredient (
     content_id, amount, name
   ) 
   SELECT 
       (i ->> 'content_id')::BIGINT,
       i ->> 'amount',
       i ->> 'name'
   FROM jsonb_array_elements(_ingredients) as i;

   SELECT jsonb_build_object(
        'id', b.id,
        'title', b.title,
        'subtitle', b.subtitle,
        'author_id', b.author_id,
        'author', (
            SELECT COALESCE(row_to_json(profile), '{}'::jsonb)
            FROM profile
            WHERE b.author_id = profile.id
            LIMIT 1
        ),
        'created_at', b.created_at,
        'read_time', b.read_time,
        'category', b.category,
        'image', (
            SELECT COALESCE(row_to_json(b_img), '{}'::jsonb)
            FROM blog_image b_img
            WHERE b_img.blog_id = b.id
            LIMIT 1
        ),
        'content', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', content.id,
                    'label', content.label,
                    'content', content.content,
                    'title', content.title,
                    'instructions', content.instructions,
                    'items', content.items,
                    'ingredients', (
                        SELECT jsonb_agg(
                            jsonb_build_object(
                                'id', ingredient.id,
                                'amount', ingredient.amount,
                                'name', ingredient.name
                            )
                        )
                        FROM ingredient
                        WHERE ingredient.content_id = content.id
                    ),
                    'image', (
                        SELECT COALESCE(row_to_json(c_img), '{}'::jsonb)
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
    WHERE b.id = blog_id AND b.status = 'published';

    RETURN new_blog;
END;
$$