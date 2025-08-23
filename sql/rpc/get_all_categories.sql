CREATE OR REPLACE FUNCTION get_all_categories()
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN (
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', c.id,
                'name', c.name,
                'description', c.description,
                'icon', c.icon,
                'color', c.color,
                'image', c.image,
                'featured', (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'id', r.id,
                            'title', r.title,
                            'slug', r.slug
                        )
                    ) FROM recipe r WHERE r.id = c.recipe_id
                )
            )
        ) FROM category c
    );
END;
$$;