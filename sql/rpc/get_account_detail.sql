CREATE OR REPLACE FUNCTION get_account_detail(_profile_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
    -- GET all recipes and recipe with images (with path)
    -- profile image(path)
    -- GET all blogs and blog with images (with path)
    
    RETURN (
        SELECT jsonb_build_object(
            'profile', p,
            'recipes', COALESCE(recipes_data, '[]'::jsonb),
            'blogs', COALESCE(blogs_data, '[]'::jsonb),
            'profile_image', COALESCE(profile_image_data, '{}'::jsonb)
        )
        FROM (
            SELECT 
                to_jsonb(p.*) as p,
                (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'recipe', r,
                            'main_image', COALESCE(recipe_main_image, '{}'::jsonb),
                            'instruction_images', COALESCE(recipe_instruction_images, '[]'::jsonb)
                        )
                    )
                    FROM (
                        SELECT 
                            to_jsonb(rec.*) as r,
                            (
                                SELECT jsonb_build_object(
                                    'id', ri.id,
                                    'path', ri.path,
                                    'alt_text', ri.alt_text
                                )
                                FROM recipe_images ri
                                WHERE ri.recipe_id = rec.id AND ri.is_main = true
                                LIMIT 1
                            ) as recipe_main_image,
                            (
                                SELECT jsonb_agg(
                                    jsonb_build_object(
                                        'id', ri.id,
                                        'path', ri.path,
                                        'alt_text', ri.alt_text
                                    )
                                )
                                FROM recipe_images ri
                                WHERE ri.recipe_id = rec.id AND ri.is_main = false
                            ) as recipe_instruction_images
                        FROM recipes rec
                        WHERE rec.author_id = _profile_id
                    ) recipe_data
                ) as recipes_data,
                (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'blog', b,
                            'main_image', COALESCE(blog_main_image, '{}'::jsonb),
                            'content_images', COALESCE(blog_content_images, '[]'::jsonb)
                        )
                    )
                    FROM (
                        SELECT 
                            to_jsonb(blg.*) as b,
                            (
                                SELECT jsonb_build_object(
                                    'id', bi.id,
                                    'path', bi.path,
                                    'alt_text', bi.alt_text
                                )
                                FROM blog_images bi
                                WHERE bi.blog_id = blg.id AND bi.is_main = true
                                LIMIT 1
                            ) as blog_main_image,
                            (
                                SELECT jsonb_agg(
                                    jsonb_build_object(
                                        'id', bi.id,
                                        'path', bi.path,
                                        'alt_text', bi.alt_text
                                    )
                                )
                                FROM blog_images bi
                                WHERE bi.blog_id = blg.id AND bi.is_main = false
                            ) as blog_content_images
                        FROM blogs blg
                        WHERE blg.author_id = _profile_id
                    ) blog_data
                ) as blogs_data,
                (
                    SELECT jsonb_build_object(
                        'id', pi.id,
                        'path', pi.path,
                        'alt_text', pi.alt_text
                    )
                    FROM profile_images pi
                    WHERE pi.profile_id = _profile_id
                    LIMIT 1
                ) as profile_image_data
            FROM profiles p
            WHERE p.id = _profile_id
        ) account_data
    );
END;
$$;