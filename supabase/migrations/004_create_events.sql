-- Create integrations table first (referenced by events)
CREATE TABLE IF NOT EXISTS public.integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('google_calendar', 'outlook', 'apple_calendar', 'ical')),
    access_token TEXT, -- Will be encrypted at application level
    refresh_token TEXT, -- Will be encrypted at application level  
    token_expiry TIMESTAMPTZ,
    sync_enabled BOOLEAN DEFAULT true,
    last_sync TIMESTAMPTZ,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

-- Create events table for calendar events
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    integration_id UUID REFERENCES public.integrations(id) ON DELETE SET NULL,
    external_id TEXT, -- ID from external calendar system
    title TEXT NOT NULL CHECK (LENGTH(title) > 0),
    description TEXT,
    location TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL CHECK (end_time > start_time),
    all_day BOOLEAN DEFAULT false,
    attendees JSONB DEFAULT '[]',
    travel_time INTEGER CHECK (travel_time >= 0), -- minutes
    preparation_time INTEGER CHECK (preparation_time >= 0), -- minutes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(integration_id, external_id)
);

-- Add updated_at triggers
CREATE TRIGGER update_integrations_updated_at
    BEFORE UPDATE ON public.integrations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add validation for all_day events
CREATE OR REPLACE FUNCTION public.validate_event_times()
RETURNS TRIGGER AS $$
BEGIN
    -- For all-day events, ensure times are at midnight and end is after start
    IF NEW.all_day = true THEN
        -- Normalize all-day events to start at midnight
        NEW.start_time = DATE_TRUNC('day', NEW.start_time);
        NEW.end_time = DATE_TRUNC('day', NEW.end_time);
        
        -- All-day events must be at least 1 day long
        IF NEW.end_time <= NEW.start_time THEN
            NEW.end_time = NEW.start_time + INTERVAL '1 day';
        END IF;
    END IF;
    
    -- Validate attendees JSONB structure if provided
    IF NEW.attendees IS NOT NULL AND NEW.attendees != '[]'::jsonb THEN
        -- Each attendee should have at least an email
        IF NOT (
            SELECT bool_and(attendee ? 'email' AND LENGTH(attendee->>'email') > 0)
            FROM jsonb_array_elements(NEW.attendees) AS attendee
        ) THEN
            RAISE EXCEPTION 'Each attendee must have a valid email address';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_event_data
    BEFORE INSERT OR UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_event_times();

-- Performance indexes
CREATE INDEX IF NOT EXISTS events_user_id_idx ON public.events(user_id);
CREATE INDEX IF NOT EXISTS events_user_start_time_idx ON public.events(user_id, start_time);
CREATE INDEX IF NOT EXISTS events_user_end_time_idx ON public.events(user_id, end_time);
CREATE INDEX IF NOT EXISTS events_integration_id_idx ON public.events(integration_id) WHERE integration_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS events_external_id_idx ON public.events(integration_id, external_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS events_time_range_idx ON public.events(start_time, end_time);
CREATE INDEX IF NOT EXISTS events_all_day_idx ON public.events(all_day);
CREATE INDEX IF NOT EXISTS events_attendees_gin_idx ON public.events USING gin(attendees);

CREATE INDEX IF NOT EXISTS integrations_user_id_idx ON public.integrations(user_id);
CREATE INDEX IF NOT EXISTS integrations_provider_idx ON public.integrations(provider);
CREATE INDEX IF NOT EXISTS integrations_sync_enabled_idx ON public.integrations(sync_enabled);
CREATE INDEX IF NOT EXISTS integrations_last_sync_idx ON public.integrations(last_sync) WHERE last_sync IS NOT NULL;

-- Add comments for documentation
COMMENT ON TABLE public.integrations IS 'Third-party calendar integrations (Google Calendar, Outlook, etc.)';
COMMENT ON COLUMN public.integrations.access_token IS 'OAuth access token (encrypted at application level)';
COMMENT ON COLUMN public.integrations.refresh_token IS 'OAuth refresh token (encrypted at application level)';
COMMENT ON COLUMN public.integrations.settings IS 'Integration-specific settings and preferences';

COMMENT ON TABLE public.events IS 'Calendar events from integrations or created manually';
COMMENT ON COLUMN public.events.external_id IS 'ID from the external calendar system (Google, Outlook, etc.)';
COMMENT ON COLUMN public.events.attendees IS 'Array of attendee objects with email, name, status, etc.';
COMMENT ON COLUMN public.events.travel_time IS 'Minutes needed to travel to event location';
COMMENT ON COLUMN public.events.preparation_time IS 'Minutes needed to prepare for the event';
COMMENT ON COLUMN public.events.all_day IS 'True for all-day events (times will be normalized to midnight)';