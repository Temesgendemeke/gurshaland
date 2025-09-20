CREATE OR REPLACE FUNCTION delete_user_account(_profile_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _deleted_count integer;
BEGIN
    -- Verify user exists and is authenticated
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = _profile_id) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'User not found'
        );
    END IF;

    -- Delete user from auth.users
    DELETE FROM auth.users WHERE id = _profile_id;
    GET DIAGNOSTICS _deleted_count = ROW_COUNT;
    
    RETURN jsonb_build_object(
        'success', _deleted_count > 0,
        'message', CASE 
            WHEN _deleted_count > 0 THEN 'User deleted successfully'
            ELSE 'Failed to delete user'
        END
    );

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO authenticated;