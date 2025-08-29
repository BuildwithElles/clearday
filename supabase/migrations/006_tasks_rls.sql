-- Row Level Security policies for tasks and events
-- Security rationale: Users can access their own tasks/events plus household shared items

-- Enable RLS on tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for migration reruns)
DROP POLICY IF EXISTS "Users can view own and household tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;

DROP POLICY IF EXISTS "Users can view own events" ON public.events;
DROP POLICY IF EXISTS "Users can insert own events" ON public.events;
DROP POLICY IF EXISTS "Users can update own events" ON public.events;
DROP POLICY IF EXISTS "Users can delete own events" ON public.events;

-- TASKS TABLE POLICIES --

-- Users can view their own tasks AND household shared tasks
-- Security: Users see tasks they own OR tasks shared in their household
CREATE POLICY "Users can view own and household tasks" ON public.tasks
    FOR SELECT 
    USING (
        user_id = auth.uid() OR
        (
            household_id IS NOT NULL AND
            household_id IN (
                SELECT household_id 
                FROM public.profiles 
                WHERE id = auth.uid() AND household_id IS NOT NULL
            )
        )
    );

-- Users can insert tasks for themselves
-- Security: Users can only create tasks owned by themselves
CREATE POLICY "Users can insert own tasks" ON public.tasks
    FOR INSERT 
    WITH CHECK (
        user_id = auth.uid() AND
        -- If household_id is set, user must be part of that household
        (
            household_id IS NULL OR
            household_id IN (
                SELECT household_id 
                FROM public.profiles 
                WHERE id = auth.uid() AND household_id IS NOT NULL
            )
        )
    );

-- Users can update their own tasks only
-- Security: Users can only modify tasks they own (not household tasks created by others)
CREATE POLICY "Users can update own tasks" ON public.tasks
    FOR UPDATE 
    USING (user_id = auth.uid())
    WITH CHECK (
        user_id = auth.uid() AND
        -- If household_id is being changed, user must be part of new household
        (
            household_id IS NULL OR
            household_id IN (
                SELECT household_id 
                FROM public.profiles 
                WHERE id = auth.uid() AND household_id IS NOT NULL
            )
        )
    );

-- Users can delete their own tasks only
-- Security: Users can only delete tasks they own
CREATE POLICY "Users can delete own tasks" ON public.tasks
    FOR DELETE 
    USING (user_id = auth.uid());

-- EVENTS TABLE POLICIES --

-- Users can view their own events
-- Security: Users can only see events they own
CREATE POLICY "Users can view own events" ON public.events
    FOR SELECT 
    USING (user_id = auth.uid());

-- Users can insert their own events
-- Security: Users can only create events owned by themselves
CREATE POLICY "Users can insert own events" ON public.events
    FOR INSERT 
    WITH CHECK (
        user_id = auth.uid() AND
        -- If integration_id is set, user must own that integration
        (
            integration_id IS NULL OR
            integration_id IN (
                SELECT id 
                FROM public.integrations 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Users can update their own events
-- Security: Users can only modify events they own
CREATE POLICY "Users can update own events" ON public.events
    FOR UPDATE 
    USING (user_id = auth.uid())
    WITH CHECK (
        user_id = auth.uid() AND
        -- If integration_id is being changed, user must own new integration
        (
            integration_id IS NULL OR
            integration_id IN (
                SELECT id 
                FROM public.integrations 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Users can delete their own events
-- Security: Users can only delete events they own
CREATE POLICY "Users can delete own events" ON public.events
    FOR DELETE 
    USING (user_id = auth.uid());

-- GRANT NECESSARY PERMISSIONS --

-- Grant table permissions to authenticated users
GRANT ALL ON public.tasks TO authenticated;
GRANT ALL ON public.events TO authenticated;

-- Service role needs full access
GRANT ALL ON public.tasks TO service_role;
GRANT ALL ON public.events TO service_role;

-- CREATE HELPER FUNCTIONS FOR COMPLEX QUERIES --

-- Function to check if user can access a household task
-- This can be used in application code for complex permission checks
CREATE OR REPLACE FUNCTION public.can_user_access_task(task_id UUID, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
    task_record RECORD;
    user_household UUID;
BEGIN
    -- Get the task details
    SELECT t.user_id, t.household_id INTO task_record
    FROM public.tasks t
    WHERE t.id = task_id;
    
    -- If task doesn't exist, return false
    IF task_record IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- If user owns the task, they can access it
    IF task_record.user_id = user_id THEN
        RETURN TRUE;
    END IF;
    
    -- If task is household shared, check if user is in that household
    IF task_record.household_id IS NOT NULL THEN
        SELECT household_id INTO user_household
        FROM public.profiles
        WHERE id = user_id;
        
        RETURN task_record.household_id = user_household;
    END IF;
    
    -- Default deny
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on helper function
GRANT EXECUTE ON FUNCTION public.can_user_access_task(UUID, UUID) TO authenticated;

-- Add comments documenting the security model
COMMENT ON POLICY "Users can view own and household tasks" ON public.tasks IS 
'Users can SELECT tasks they own OR tasks shared in their household';

COMMENT ON POLICY "Users can insert own tasks" ON public.tasks IS 
'Users can INSERT tasks owned by themselves, optionally shared with their household';

COMMENT ON POLICY "Users can update own tasks" ON public.tasks IS 
'Users can UPDATE only tasks they own (not household tasks created by others)';

COMMENT ON POLICY "Users can delete own tasks" ON public.tasks IS 
'Users can DELETE only tasks they own';

COMMENT ON POLICY "Users can view own events" ON public.events IS 
'Users can SELECT only events they own';

COMMENT ON POLICY "Users can insert own events" ON public.events IS 
'Users can INSERT events owned by themselves';

COMMENT ON POLICY "Users can update own events" ON public.events IS 
'Users can UPDATE only events they own';

COMMENT ON POLICY "Users can delete own events" ON public.events IS 
'Users can DELETE only events they own';

COMMENT ON FUNCTION public.can_user_access_task(UUID, UUID) IS 
'Helper function to check if a user can access a specific task (own or household shared)';