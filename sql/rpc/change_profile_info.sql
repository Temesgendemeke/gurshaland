CREATE OR REPLACE FUNCTION change_profile_info(_profile_id uuid, _new_profile jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    _full_name text;
    _username text;
    _bio text;
    _image_url text;
    _image_path text;
    _updated_profile jsonb;
    _profile_updated boolean := false;
BEGIN
    -- Extract values from the JSON input
    _full_name := _new_profile->>'full_name';
    _username := _new_profile->>'username';
    _bio := _new_profile->>'bio';

    -- Extract image fields if present
    IF (_new_profile ? 'image') AND (_new_profile->'image' IS NOT NULL) THEN
        _image_url := (_new_profile->'image')->>'url';
        _image_path := (_new_profile->'image')->>'path';
    END IF;

    -- Update the profile table
    UPDATE profile
    SET 
        full_name = COALESCE(_full_name, full_name),
        username  = COALESCE(_username, username),
        bio       = COALESCE(_bio, bio)
    WHERE id = _profile_id;

    IF FOUND THEN
        _profile_updated := true;
    END IF;

    -- Upsert the profile_image if image data is provided
    IF _image_url IS NOT NULL OR _image_path IS NOT NULL THEN
        INSERT INTO profile_image(profile_id, url, path)
        VALUES (_profile_id, _image_url, _image_path)
        ON CONFLICT (profile_id) DO UPDATE
        SET
            url = COALESCE(EXCLUDED.url, profile_image.url),
            path = COALESCE(EXCLUDED.path, profile_image.path);
        -- No need to check FOUND here, as upsert always "succeeds"
    END IF;

    IF NOT _profile_updated THEN
        RAISE EXCEPTION 'Profile not found with ID: %', _profile_id;
    END IF;

    -- Return the updated profile data
    SELECT jsonb_build_object(
        'id', p.id,
        'full_name', p.full_name,
        'username', p.username,
        'bio', p.bio,
        'image', (
            SELECT row_to_json(img)
            FROM profile_image img
            WHERE img.profile_id = p.id
        )
    ) INTO _updated_profile
    FROM profile p
    WHERE p.id = _profile_id;

    RETURN _updated_profile;
END;
$$;