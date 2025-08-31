-- Create reminders table migration
-- Reminders can be linked to tasks, events, or habits

CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('task', 'event', 'habit')),
    scheduled_time TIMESTAMPTZ NOT NULL,
    actual_time TIMESTAMPTZ,
    dismissed BOOLEAN DEFAULT false,
    snoozed_until TIMESTAMPTZ,
    personalization_label TEXT,
    strategy TEXT NOT NULL CHECK (strategy IN ('aggressive', 'gentle', 'smart')),
    effectiveness_score DECIMAL(3,2) CHECK (effectiveness_score >= 0 AND effectiveness_score <= 1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at trigger
CREATE TRIGGER update_reminders_updated_at
    BEFORE UPDATE ON public.reminders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add validation trigger for reminder relationships
CREATE OR REPLACE FUNCTION public.validate_reminder_relationships()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure at least one related item exists based on type
    IF NEW.type = 'task' AND NEW.task_id IS NULL THEN
        RAISE EXCEPTION 'Task reminders must have a task_id';
    ELSIF NEW.type = 'event' AND NEW.event_id IS NULL THEN
        RAISE EXCEPTION 'Event reminders must have an event_id';
    ELSIF NEW.type = 'habit' AND NEW.task_id IS NULL AND NEW.event_id IS NULL THEN
        RAISE EXCEPTION 'Habit reminders must have either task_id or event_id';
    END IF;
    
    -- Ensure scheduled_time is in the future for new reminders
    IF NEW.scheduled_time <= NOW() THEN
        RAISE EXCEPTION 'Reminder scheduled_time must be in the future';
    END IF;
    
    -- Validate snoozed_until is after scheduled_time if provided
    IF NEW.snoozed_until IS NOT NULL AND NEW.snoozed_until <= NEW.scheduled_time THEN
        RAISE EXCEPTION 'snoozed_until must be after scheduled_time';
    END IF;
    
    -- Validate effectiveness_score range
    IF NEW.effectiveness_score IS NOT NULL AND (NEW.effectiveness_score < 0 OR NEW.effectiveness_score > 1) THEN
        RAISE EXCEPTION 'effectiveness_score must be between 0 and 1';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_reminder_data
    BEFORE INSERT OR UPDATE ON public.reminders
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_reminder_relationships();

-- Add trigger to automatically set actual_time when reminder is dismissed
CREATE OR REPLACE FUNCTION public.handle_reminder_dismissal()
RETURNS TRIGGER AS $$
BEGIN
    -- If reminder is being dismissed and actual_time is not set
    IF NEW.dismissed = true AND OLD.dismissed = false AND NEW.actual_time IS NULL THEN
        NEW.actual_time = NOW();
    END IF;
    
    -- If reminder is being un-dismissed, clear actual_time
    IF NEW.dismissed = false AND OLD.dismissed = true THEN
        NEW.actual_time = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_reminder_dismissal_change
    BEFORE UPDATE ON public.reminders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_reminder_dismissal();

-- Performance indexes
CREATE INDEX IF NOT EXISTS reminders_user_id_idx ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS reminders_user_scheduled_time_idx ON public.reminders(user_id, scheduled_time);
CREATE INDEX IF NOT EXISTS reminders_task_id_idx ON public.reminders(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS reminders_event_id_idx ON public.reminders(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS reminders_type_idx ON public.reminders(type);
CREATE INDEX IF NOT EXISTS reminders_dismissed_idx ON public.reminders(dismissed);
CREATE INDEX IF NOT EXISTS reminders_snoozed_until_idx ON public.reminders(snoozed_until) WHERE snoozed_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS reminders_strategy_idx ON public.reminders(strategy);
CREATE INDEX IF NOT EXISTS reminders_effectiveness_score_idx ON public.reminders(effectiveness_score) WHERE effectiveness_score IS NOT NULL;
CREATE INDEX IF NOT EXISTS reminders_pending_idx ON public.reminders(scheduled_time) WHERE dismissed = false AND (snoozed_until IS NULL OR snoozed_until <= NOW());

-- Add comments for documentation
COMMENT ON TABLE public.reminders IS 'User reminders for tasks, events, and habits with smart scheduling and effectiveness tracking';
COMMENT ON COLUMN public.reminders.task_id IS 'Linked task (for task and habit reminders)';
COMMENT ON COLUMN public.reminders.event_id IS 'Linked event (for event and habit reminders)';
COMMENT ON COLUMN public.reminders.type IS 'Type of reminder: task, event, or habit';
COMMENT ON COLUMN public.reminders.scheduled_time IS 'When the reminder should trigger';
COMMENT ON COLUMN public.reminders.actual_time IS 'When the reminder was actually dismissed (auto-set on dismissal)';
COMMENT ON COLUMN public.reminders.dismissed IS 'Whether the reminder has been dismissed';
COMMENT ON COLUMN public.reminders.snoozed_until IS 'If snoozed, when to show again';
COMMENT ON COLUMN public.reminders.personalization_label IS 'Custom label for personalization';
COMMENT ON COLUMN public.reminders.strategy IS 'Reminder strategy: aggressive, gentle, or smart';
COMMENT ON COLUMN public.reminders.effectiveness_score IS 'User feedback on reminder effectiveness (0-1 scale)';

