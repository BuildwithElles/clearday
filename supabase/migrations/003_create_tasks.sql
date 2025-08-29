-- Create tasks table migration
-- Tasks can be personal or shared within a household

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    household_id UUID REFERENCES public.households(id) ON DELETE SET NULL,
    title TEXT NOT NULL CHECK (LENGTH(title) > 0),
    description TEXT,
    due_date DATE,
    due_time TIME,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    priority INTEGER CHECK (priority IN (1,2,3,4)),
    tags TEXT[] DEFAULT '{}',
    recurring_rule JSONB,
    source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'calendar', 'habit', 'ai_suggested')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at trigger
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger to automatically set completed_at when task is marked as complete
CREATE OR REPLACE FUNCTION public.handle_task_completion()
RETURNS TRIGGER AS $$
BEGIN
    -- If task is being marked as completed
    IF NEW.completed = true AND (OLD.completed = false OR OLD.completed IS NULL) THEN
        NEW.completed_at = NOW();
    -- If task is being marked as not completed
    ELSIF NEW.completed = false AND OLD.completed = true THEN
        NEW.completed_at = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_task_completion_change
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_task_completion();

-- Add validation trigger for recurring_rule JSONB structure
CREATE OR REPLACE FUNCTION public.validate_recurring_rule()
RETURNS TRIGGER AS $$
BEGIN
    -- If recurring_rule is provided, validate its structure
    IF NEW.recurring_rule IS NOT NULL THEN
        -- Check for required fields in recurring rule
        IF NOT (NEW.recurring_rule ? 'frequency') THEN
            RAISE EXCEPTION 'recurring_rule must contain a frequency field';
        END IF;
        
        -- Validate frequency values
        IF NOT (NEW.recurring_rule->>'frequency' IN ('daily', 'weekly', 'monthly', 'yearly')) THEN
            RAISE EXCEPTION 'recurring_rule frequency must be one of: daily, weekly, monthly, yearly';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_task_recurring_rule
    BEFORE INSERT OR UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_recurring_rule();

-- Performance indexes
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_user_due_date_idx ON public.tasks(user_id, due_date) WHERE due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS tasks_household_id_idx ON public.tasks(household_id) WHERE household_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS tasks_completed_idx ON public.tasks(completed);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON public.tasks(priority) WHERE priority IS NOT NULL;
CREATE INDEX IF NOT EXISTS tasks_tags_gin_idx ON public.tasks USING gin(tags);
CREATE INDEX IF NOT EXISTS tasks_source_idx ON public.tasks(source);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON public.tasks(created_at);

-- Add comments for documentation
COMMENT ON TABLE public.tasks IS 'User tasks with support for household sharing and recurring patterns';
COMMENT ON COLUMN public.tasks.user_id IS 'Owner of the task';
COMMENT ON COLUMN public.tasks.household_id IS 'If set, task is shared with household members';
COMMENT ON COLUMN public.tasks.priority IS '1=Low, 2=Medium, 3=High, 4=Urgent';
COMMENT ON COLUMN public.tasks.tags IS 'Array of custom tags for organization';
COMMENT ON COLUMN public.tasks.recurring_rule IS 'JSON object defining recurring pattern (frequency, interval, etc.)';
COMMENT ON COLUMN public.tasks.source IS 'How the task was created: manual, calendar sync, habit, AI suggestion';
COMMENT ON COLUMN public.tasks.completed_at IS 'Automatically set when task is marked as completed';