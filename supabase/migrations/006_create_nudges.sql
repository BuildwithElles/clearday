-- Create nudges table migration
-- Nudges are AI-powered suggestions for eco-friendly, healthy, and productive actions

CREATE TABLE IF NOT EXISTS public.nudges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('eco', 'health', 'productivity', 'social')),
    title TEXT NOT NULL CHECK (LENGTH(title) > 0),
    message TEXT NOT NULL CHECK (LENGTH(message) > 0),
    action_type TEXT CHECK (action_type IN ('task_creation', 'habit_start', 'reminder_set')),
    action_data JSONB DEFAULT '{}',
    impact_kg DECIMAL(8,3) CHECK (impact_kg >= 0),
    shown_at TIMESTAMPTZ,
    acted_on BOOLEAN DEFAULT false,
    acted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at trigger
CREATE TRIGGER update_nudges_updated_at
    BEFORE UPDATE ON public.nudges
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add validation trigger for nudge data
CREATE OR REPLACE FUNCTION public.validate_nudge_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure title and message are not empty
    IF LENGTH(NEW.title) = 0 THEN
        RAISE EXCEPTION 'Nudge title cannot be empty';
    END IF;
    
    IF LENGTH(NEW.message) = 0 THEN
        RAISE EXCEPTION 'Nudge message cannot be empty';
    END IF;
    
    -- Validate impact_kg is positive if provided
    IF NEW.impact_kg IS NOT NULL AND NEW.impact_kg < 0 THEN
        RAISE EXCEPTION 'impact_kg must be non-negative';
    END IF;
    
    -- Validate expires_at is in the future if provided
    IF NEW.expires_at IS NOT NULL AND NEW.expires_at <= NOW() THEN
        RAISE EXCEPTION 'expires_at must be in the future';
    END IF;
    
    -- Validate acted_at is set when acted_on is true
    IF NEW.acted_on = true AND NEW.acted_at IS NULL THEN
        NEW.acted_at = NOW();
    END IF;
    
    -- Validate acted_at is cleared when acted_on is false
    IF NEW.acted_on = false THEN
        NEW.acted_at = NULL;
    END IF;
    
    -- Validate shown_at is not in the future
    IF NEW.shown_at IS NOT NULL AND NEW.shown_at > NOW() THEN
        RAISE EXCEPTION 'shown_at cannot be in the future';
    END IF;
    
    -- Validate action_data is valid JSONB if provided
    IF NEW.action_data IS NOT NULL AND NEW.action_data = 'null'::jsonb THEN
        RAISE EXCEPTION 'action_data cannot be null JSONB';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_nudge_data_trigger
    BEFORE INSERT OR UPDATE ON public.nudges
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_nudge_data();

-- Add trigger to automatically set shown_at when nudge is first accessed
CREATE OR REPLACE FUNCTION public.handle_nudge_shown()
RETURNS TRIGGER AS $$
BEGIN
    -- If shown_at is not set and nudge is being updated, set it
    IF NEW.shown_at IS NULL AND OLD.shown_at IS NULL THEN
        NEW.shown_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_nudge_shown
    BEFORE UPDATE ON public.nudges
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_nudge_shown();

-- Performance indexes
CREATE INDEX IF NOT EXISTS nudges_user_id_idx ON public.nudges(user_id);
CREATE INDEX IF NOT EXISTS nudges_user_type_idx ON public.nudges(user_id, type);
CREATE INDEX IF NOT EXISTS nudges_type_idx ON public.nudges(type);
CREATE INDEX IF NOT EXISTS nudges_acted_on_idx ON public.nudges(acted_on);
CREATE INDEX IF NOT EXISTS nudges_expires_at_idx ON public.nudges(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS nudges_shown_at_idx ON public.nudges(shown_at) WHERE shown_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS nudges_action_type_idx ON public.nudges(action_type) WHERE action_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS nudges_impact_kg_idx ON public.nudges(impact_kg) WHERE impact_kg IS NOT NULL;
CREATE INDEX IF NOT EXISTS nudges_active_idx ON public.nudges(created_at) WHERE acted_on = false AND (expires_at IS NULL OR expires_at > NOW());

-- Add comments for documentation
COMMENT ON TABLE public.nudges IS 'AI-powered suggestions for eco-friendly, healthy, and productive actions';
COMMENT ON COLUMN public.nudges.type IS 'Type of nudge: eco, health, productivity, or social';
COMMENT ON COLUMN public.nudges.title IS 'Short, compelling title for the nudge';
COMMENT ON COLUMN public.nudges.message IS 'Detailed message explaining the nudge suggestion';
COMMENT ON COLUMN public.nudges.action_type IS 'Type of action the nudge suggests: task_creation, habit_start, reminder_set';
COMMENT ON COLUMN public.nudges.action_data IS 'JSON data for the suggested action (task details, habit info, etc.)';
COMMENT ON COLUMN public.nudges.impact_kg IS 'Estimated CO2 impact in kilograms if the nudge is acted upon';
COMMENT ON COLUMN public.nudges.shown_at IS 'When the nudge was first shown to the user (auto-set on first access)';
COMMENT ON COLUMN public.nudges.acted_on IS 'Whether the user acted on the nudge suggestion';
COMMENT ON COLUMN public.nudges.acted_at IS 'When the user acted on the nudge (auto-set when acted_on becomes true)';
COMMENT ON COLUMN public.nudges.expires_at IS 'When the nudge expires and should no longer be shown';

