CREATE OR REPLACE FUNCTION get_user_images(_profile_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
    -- Get all user images: profile, recipe (main + instruction), blog (main + content)
    
    RETURN (
        SELECT jsonb_build_object(
            'profile_image', COALESCE(profile_image_data, '{}'::jsonb),
            'recipes', COALESCE(recipes_data, '[]'::jsonb),
            'blogs', COALESCE(blogs_data, '[]'::jsonb)
        )
        FROM (
            SELECT 
                -- Get profile image
                (
                    SELECT jsonb_build_object(
                        'id', pi.id,
                        'url', pi.url,
                        'path', pi.path
                    )
                    FROM profile_image pi
                    WHERE pi.profile_id = _profile_id
                    LIMIT 1
                ) as profile_image_data,
                
                -- Get recipe images (main + instruction)
                (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'recipe_id', r.id,
                            'main_image', (
                                SELECT jsonb_build_object(
                                    'id', ri.id,
                                    'url', ri.url,
                                    'path', ri.path
                                )
                                FROM recipe_image ri
                                WHERE ri.recipe_id = r.id
                                LIMIT 1
                            ),
                            'instruction_images', (
                                SELECT jsonb_agg(
                                    jsonb_build_object(
                                        'id', ii.id,
                                        'url', ii.url,
                                        'path', ii.path
                                    )
                                )
                                FROM instruction_image ii
                                JOIN instruction i ON i.id = ii.instruction_id
                                WHERE i.recipe_id = r.id
                            )
                        )
                    )
                    FROM recipe r
                    WHERE r.author_id = _profile_id
                ) as recipes_data,
                
                -- Get blog images (main + content)
                (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'blog_id', b.id,
                            'main_image', (
                                SELECT jsonb_build_object(
                                    'id', bi.id,
                                    'url', bi.url,
                                    'path', bi.path
                                )
                                FROM blog_image bi
                                WHERE bi.blog_id = b.id
                                LIMIT 1
                            ),
                            'content_images', (
                                SELECT jsonb_agg(
                                    jsonb_build_object(
                                        'id', ci.id,
                                        'url', ci.url,
                                        'path', ci.path
                                    )
                                )
                                FROM content_image ci
                                JOIN content c ON c.id = ci.content_id
                                WHERE c.blog_id = b.id
                            )
                        )
                    )
                    FROM blog b
                    WHERE b.author_id = _profile_id
                ) as blogs_data
                
        ) image_data
    );
END;
$$;