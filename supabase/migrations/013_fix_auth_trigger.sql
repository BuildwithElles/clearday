-- Fix auth trigger issue by using helper functions instead of triggers on auth.users
-- This approach avoids the "must be owner of relation users" error

-- Drop the problematic trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a helper function that can be called from Edge Functions or server actions
CREATE OR REPLACE FUNCTION public.create_profile_for_user(
    user_id UUID,
    user_email TEXT,
    user_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
    profile_created BOOLEAN := FALSE;
BEGIN
    -- Check if profile already exists
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id) THEN
        RAISE NOTICE 'Profile already exists for user %', user_id;
        RETURN TRUE;
    END IF;

    -- Insert new profile record
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name, 
        avatar_url,
        created_at,
        updated_at
    )
    VALUES (
        user_id,
        user_email,
        COALESCE(
            user_metadata->>'full_name', 
            user_metadata->>'name', 
            user_metadata->>'display_name',
            ''
        ),
        COALESCE(
            user_metadata->>'avatar_url', 
            user_metadata->>'picture',
            user_metadata->>'photo_url',
            NULL
        ),
        NOW(),
        NOW()
    );

    profile_created := TRUE;
    RAISE NOTICE 'Profile created successfully for user %', user_id;
    
    RETURN profile_created;
EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'Profile already exists for user % (caught unique_violation)', user_id;
        RETURN TRUE;
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to create profile for user %: %', user_id, SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get or create profile (useful for server actions)
CREATE OR REPLACE FUNCTION public.get_or_create_profile(
    user_id UUID,
    user_email TEXT,
    user_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS TABLE(
    id UUID,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    household_id UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    -- Try to create profile if it doesn't exist
    PERFORM public.create_profile_for_user(user_id, user_email, user_metadata);
    
    -- Return the profile (either existing or newly created)
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.full_name,
        p.avatar_url,
        p.household_id,
        p.created_at,
        p.updated_at
    FROM public.profiles p
    WHERE p.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.create_profile_for_user(UUID, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_profile_for_user(UUID, TEXT, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_or_create_profile(UUID, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_or_create_profile(UUID, TEXT, JSONB) TO service_role;

-- Add comments for documentation
COMMENT ON FUNCTION public.create_profile_for_user(UUID, TEXT, JSONB) IS 'Creates a profile record for a new user. Call this from Edge Functions or server actions after user signup.';
COMMENT ON FUNCTION public.get_or_create_profile(UUID, TEXT, JSONB) IS 'Gets existing profile or creates new one if it doesn''t exist. Returns profile data.';

-- Create an Edge Function template (this will be created separately)
-- The Edge Function should call: supabase.rpc('create_profile_for_user', {user_id, user_email, user_metadata})




