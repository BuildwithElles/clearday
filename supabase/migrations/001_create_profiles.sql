-- Create profiles table migration
-- This table extends Supabase auth.users with application-specific profile data
-- Each user in auth.users gets a corresponding profile record

-- First, create households table (referenced by profiles)
CREATE TABLE IF NOT EXISTS public.households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID, -- Will be set after profiles table is created
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    household_id UUID REFERENCES public.households(id),
    privacy_mode BOOLEAN DEFAULT false,
    local_mode BOOLEAN DEFAULT false,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add the foreign key constraint to households after profiles table exists
ALTER TABLE public.households 
ADD CONSTRAINT households_owner_id_fkey 
FOREIGN KEY (owner_id) REFERENCES public.profiles(id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_households_updated_at
    BEFORE UPDATE ON public.households
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_household_id_idx ON public.profiles(household_id) WHERE household_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS households_owner_id_idx ON public.households(owner_id);

-- Add comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles extending auth.users with application-specific data';
COMMENT ON COLUMN public.profiles.privacy_mode IS 'When true, reduces telemetry and third-party analytics';
COMMENT ON COLUMN public.profiles.local_mode IS 'When true, enables PII redaction for AI requests';
COMMENT ON COLUMN public.profiles.timezone IS 'User timezone for proper datetime handling';

COMMENT ON TABLE public.households IS 'Household groups for shared task and event management';
COMMENT ON COLUMN public.households.owner_id IS 'Profile ID of the household owner/admin';