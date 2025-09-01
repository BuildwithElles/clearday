-- Row Level Security policies for profiles and households
-- Security rationale: Users should only access their own profile data and household data they're part of

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for migration reruns)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can read all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Household members can view household" ON public.households;
DROP POLICY IF EXISTS "Only owner can update household" ON public.households;
DROP POLICY IF EXISTS "Users can create household" ON public.households;

DROP POLICY IF EXISTS "Users can view own integrations" ON public.integrations;
DROP POLICY IF EXISTS "Users can manage own integrations" ON public.integrations;

-- PROFILES TABLE POLICIES --

-- Users can view their own profile
-- Security: Authenticated users can only see their own profile data
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT 
    USING (auth.uid() = id);

-- Users can update their own profile
-- Security: Users can only modify their own profile data
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Service role can read all profiles (for admin operations and triggers)
-- Security: Only service role key can access all profiles
CREATE POLICY "Service role can read all profiles" ON public.profiles
    FOR ALL 
    USING (auth.role() = 'service_role');

-- HOUSEHOLDS TABLE POLICIES --

-- Household members can view their household data
-- Security: Users can only see household data if they are the owner OR a member
CREATE POLICY "Household members can view household" ON public.households
    FOR SELECT 
    USING (
        owner_id = auth.uid() OR
        id IN (
            SELECT household_id 
            FROM public.profiles 
            WHERE id = auth.uid() AND household_id IS NOT NULL
        )
    );

-- Only household owner can update household settings
-- Security: Only the household owner can modify household data
CREATE POLICY "Only owner can update household" ON public.households
    FOR UPDATE 
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

-- Users can create new households
-- Security: Authenticated users can create households and become the owner
CREATE POLICY "Users can create household" ON public.households
    FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

-- Only household owner can delete the household
-- Security: Only the owner can delete their household
CREATE POLICY "Only owner can delete household" ON public.households
    FOR DELETE 
    USING (owner_id = auth.uid());

-- INTEGRATIONS TABLE POLICIES --

-- Users can view their own integrations
-- Security: Users can only see their own calendar integrations
CREATE POLICY "Users can view own integrations" ON public.integrations
    FOR SELECT 
    USING (user_id = auth.uid());

-- Users can manage their own integrations (insert, update, delete)
-- Security: Users can only modify their own integrations
CREATE POLICY "Users can manage own integrations" ON public.integrations
    FOR ALL 
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- GRANT NECESSARY PERMISSIONS --

-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- Grant table permissions to authenticated users
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.households TO authenticated;
GRANT ALL ON public.integrations TO authenticated;

-- Grant sequence permissions (for UUID generation)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Service role needs full access for triggers and admin operations
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Add comments documenting the security model
COMMENT ON POLICY "Users can view own profile" ON public.profiles IS 
'Users can only SELECT their own profile record using auth.uid()';

COMMENT ON POLICY "Users can update own profile" ON public.profiles IS 
'Users can only UPDATE their own profile record';

COMMENT ON POLICY "Household members can view household" ON public.households IS 
'Users can view household data if they are owner OR member (via profiles.household_id)';

COMMENT ON POLICY "Only owner can update household" ON public.households IS 
'Only household owner (households.owner_id) can modify household settings';

COMMENT ON POLICY "Users can manage own integrations" ON public.integrations IS 
'Users have full CRUD access to their own calendar integrations';