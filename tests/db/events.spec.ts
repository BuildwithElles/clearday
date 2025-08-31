import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

test.describe('Events Table Migration Tests', () => {
  test('events migration file exists', () => {
    // Test that the migration file exists
    expect(fs.existsSync('supabase/migrations/004_create_events.sql')).toBe(true);
  });

  test('events migration file has correct content', () => {
    // Test that the migration file contains the expected SQL
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    // Check for table creation
    expect(migrationContent).toContain('CREATE TABLE IF NOT EXISTS public.integrations');
    expect(migrationContent).toContain('CREATE TABLE IF NOT EXISTS public.events');
    expect(migrationContent).toContain('id UUID PRIMARY KEY DEFAULT gen_random_uuid()');
  });

  test('integrations table has correct structure', () => {
    // Test that the integrations table has all required columns
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    // Check for all required columns in integrations table
    expect(migrationContent).toContain('id UUID PRIMARY KEY');
    expect(migrationContent).toContain('user_id UUID NOT NULL');
    expect(migrationContent).toContain('provider TEXT NOT NULL');
    expect(migrationContent).toContain('access_token TEXT');
    expect(migrationContent).toContain('refresh_token TEXT');
    expect(migrationContent).toContain('token_expiry TIMESTAMPTZ');
    expect(migrationContent).toContain('sync_enabled BOOLEAN DEFAULT true');
    expect(migrationContent).toContain('last_sync TIMESTAMPTZ');
    expect(migrationContent).toContain('settings JSONB DEFAULT \'{}\'');
    expect(migrationContent).toContain('created_at TIMESTAMPTZ DEFAULT NOW()');
    expect(migrationContent).toContain('updated_at TIMESTAMPTZ DEFAULT NOW()');
  });

  test('events table has correct structure', () => {
    // Test that the events table has all required columns
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    // Check for all required columns in events table
    expect(migrationContent).toContain('id UUID PRIMARY KEY');
    expect(migrationContent).toContain('user_id UUID NOT NULL');
    expect(migrationContent).toContain('integration_id UUID');
    expect(migrationContent).toContain('external_id TEXT');
    expect(migrationContent).toContain('title TEXT NOT NULL');
    expect(migrationContent).toContain('description TEXT');
    expect(migrationContent).toContain('location TEXT');
    expect(migrationContent).toContain('start_time TIMESTAMPTZ NOT NULL');
    expect(migrationContent).toContain('end_time TIMESTAMPTZ NOT NULL');
    expect(migrationContent).toContain('all_day BOOLEAN DEFAULT false');
    expect(migrationContent).toContain('attendees JSONB DEFAULT \'[]\'');
    expect(migrationContent).toContain('travel_time INTEGER');
    expect(migrationContent).toContain('preparation_time INTEGER');
    expect(migrationContent).toContain('created_at TIMESTAMPTZ DEFAULT NOW()');
    expect(migrationContent).toContain('updated_at TIMESTAMPTZ DEFAULT NOW()');
  });

  test('tables have proper constraints', () => {
    // Test that the tables have proper constraints
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    // Check for foreign key constraints
    expect(migrationContent).toContain('REFERENCES public.profiles(id) ON DELETE CASCADE');
    expect(migrationContent).toContain('REFERENCES public.integrations(id) ON DELETE SET NULL');
    
    // Check for check constraints
    expect(migrationContent).toContain('CHECK (provider IN (\'google_calendar\', \'outlook\', \'apple_calendar\', \'ical\'))');
    expect(migrationContent).toContain('CHECK (LENGTH(title) > 0)');
    expect(migrationContent).toContain('CHECK (end_time > start_time)');
    expect(migrationContent).toContain('CHECK (travel_time >= 0)');
    expect(migrationContent).toContain('CHECK (preparation_time >= 0)');
    
    // Check for unique constraints
    expect(migrationContent).toContain('UNIQUE(user_id, provider)');
    expect(migrationContent).toContain('UNIQUE(integration_id, external_id)');
  });

  test('tables have updated_at triggers', () => {
    // Test that the tables have the updated_at triggers
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE TRIGGER update_integrations_updated_at');
    expect(migrationContent).toContain('CREATE TRIGGER update_events_updated_at');
    expect(migrationContent).toContain('BEFORE UPDATE ON public.integrations');
    expect(migrationContent).toContain('BEFORE UPDATE ON public.events');
    expect(migrationContent).toContain('EXECUTE FUNCTION public.update_updated_at_column()');
  });

  test('events table has validation trigger', () => {
    // Test that the events table has the validation trigger
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION public.validate_event_times()');
    expect(migrationContent).toContain('CREATE TRIGGER validate_event_data');
    expect(migrationContent).toContain('BEFORE INSERT OR UPDATE ON public.events');
  });

  test('event validation handles all_day events', () => {
    // Test that the validation function handles all-day events properly
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.all_day = true THEN');
    expect(migrationContent).toContain('NEW.start_time = DATE_TRUNC(\'day\', NEW.start_time)');
    expect(migrationContent).toContain('NEW.end_time = DATE_TRUNC(\'day\', NEW.end_time)');
    expect(migrationContent).toContain('IF NEW.end_time <= NEW.start_time THEN');
    expect(migrationContent).toContain('NEW.end_time = NEW.start_time + INTERVAL \'1 day\'');
  });

  test('event validation handles attendees', () => {
    // Test that the validation function handles attendees properly
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.attendees IS NOT NULL AND NEW.attendees != \'[]\'::jsonb THEN');
    expect(migrationContent).toContain('SELECT bool_and(attendee ? \'email\' AND LENGTH(attendee->>\'email\') > 0)');
    expect(migrationContent).toContain('FROM jsonb_array_elements(NEW.attendees) AS attendee');
    expect(migrationContent).toContain('RAISE EXCEPTION \'Each attendee must have a valid email address\'');
  });

  test('tables have performance indexes', () => {
    // Test that the tables have proper performance indexes
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    // Check for events table indexes
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_user_id_idx ON public.events(user_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_user_start_time_idx ON public.events(user_id, start_time)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_user_end_time_idx ON public.events(user_id, end_time)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_integration_id_idx ON public.events(integration_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_external_id_idx ON public.events(integration_id, external_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_time_range_idx ON public.events(start_time, end_time)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_all_day_idx ON public.events(all_day)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_attendees_gin_idx ON public.events USING gin(attendees)');
    
    // Check for integrations table indexes
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS integrations_user_id_idx ON public.integrations(user_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS integrations_provider_idx ON public.integrations(provider)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS integrations_sync_enabled_idx ON public.integrations(sync_enabled)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS integrations_last_sync_idx ON public.integrations(last_sync)');
  });

  test('tables have proper documentation', () => {
    // Test that the tables have proper documentation
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    expect(migrationContent).toContain('COMMENT ON TABLE public.integrations IS');
    expect(migrationContent).toContain('COMMENT ON TABLE public.events IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.integrations.access_token IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.integrations.refresh_token IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.integrations.settings IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.events.external_id IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.events.attendees IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.events.travel_time IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.events.preparation_time IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.events.all_day IS');
  });

  test('migration follows SQL best practices', () => {
    // Test that the migration follows SQL best practices
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    // Check for proper SQL formatting
    expect(migrationContent).toContain('-- Create integrations table first (referenced by events)');
    expect(migrationContent).toContain('-- Create events table for calendar events');
    
    // Check for proper table definition
    expect(migrationContent).toContain('CREATE TABLE IF NOT EXISTS');
    expect(migrationContent).toContain('PRIMARY KEY');
    expect(migrationContent).toContain('DEFAULT');
  });

  test('tables handle relationships correctly', () => {
    // Test that the tables handle relationships correctly
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    // Check for proper foreign key relationships
    expect(migrationContent).toContain('user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE');
    expect(migrationContent).toContain('integration_id UUID REFERENCES public.integrations(id) ON DELETE SET NULL');
  });

  test('tables include proper defaults', () => {
    // Test that the tables include proper defaults
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    expect(migrationContent).toContain('sync_enabled BOOLEAN DEFAULT true');
    expect(migrationContent).toContain('settings JSONB DEFAULT \'{}\'');
    expect(migrationContent).toContain('all_day BOOLEAN DEFAULT false');
    expect(migrationContent).toContain('attendees JSONB DEFAULT \'[]\'');
    expect(migrationContent).toContain('created_at TIMESTAMPTZ DEFAULT NOW()');
    expect(migrationContent).toContain('updated_at TIMESTAMPTZ DEFAULT NOW()');
  });

  test('tables handle data types correctly', () => {
    // Test that the tables use correct data types
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    // Check for appropriate data types
    expect(migrationContent).toContain('UUID PRIMARY KEY');
    expect(migrationContent).toContain('TEXT NOT NULL');
    expect(migrationContent).toContain('TIMESTAMPTZ NOT NULL');
    expect(migrationContent).toContain('BOOLEAN DEFAULT');
    expect(migrationContent).toContain('JSONB DEFAULT');
    expect(migrationContent).toContain('INTEGER CHECK');
  });

  test('migration file is well-formatted', () => {
    // Test that the migration file is properly formatted and readable
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    // Check that the file is not empty
    expect(migrationContent.length).toBeGreaterThan(100);
    
    // Check for proper line breaks and structure
    const lines = migrationContent.split('\n');
    expect(lines.length).toBeGreaterThan(10);
    
    // Check for proper SQL comments
    expect(migrationContent).toContain('-- Create integrations table first');
    expect(migrationContent).toContain('-- Create events table for calendar events');
  });

  test('integrations table supports multiple providers', () => {
    // Test that the integrations table supports multiple providers
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    expect(migrationContent).toContain('google_calendar');
    expect(migrationContent).toContain('outlook');
    expect(migrationContent).toContain('apple_calendar');
    expect(migrationContent).toContain('ical');
    expect(migrationContent).toContain('UNIQUE(user_id, provider)');
  });

  test('events table supports external calendar integration', () => {
    // Test that the events table supports external calendar integration
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    expect(migrationContent).toContain('integration_id UUID REFERENCES public.integrations(id)');
    expect(migrationContent).toContain('external_id TEXT');
    expect(migrationContent).toContain('UNIQUE(integration_id, external_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_integration_id_idx');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_external_id_idx');
  });

  test('events table supports all-day events', () => {
    // Test that the events table supports all-day events
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    expect(migrationContent).toContain('all_day BOOLEAN DEFAULT false');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_all_day_idx');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.events.all_day IS');
    expect(migrationContent).toContain('True for all-day events (times will be normalized to midnight)');
  });

  test('events table supports attendees', () => {
    // Test that the events table supports attendees
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    expect(migrationContent).toContain('attendees JSONB DEFAULT \'[]\'');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_attendees_gin_idx ON public.events USING gin(attendees)');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.events.attendees IS');
    expect(migrationContent).toContain('Array of attendee objects with email, name, status, etc.');
  });

  test('events table supports travel and preparation time', () => {
    // Test that the events table supports travel and preparation time
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    expect(migrationContent).toContain('travel_time INTEGER CHECK (travel_time >= 0)');
    expect(migrationContent).toContain('preparation_time INTEGER CHECK (preparation_time >= 0)');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.events.travel_time IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.events.preparation_time IS');
    expect(migrationContent).toContain('Minutes needed to travel to event location');
    expect(migrationContent).toContain('Minutes needed to prepare for the event');
  });

  test('integrations table supports OAuth tokens', () => {
    // Test that the integrations table supports OAuth tokens
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    expect(migrationContent).toContain('access_token TEXT');
    expect(migrationContent).toContain('refresh_token TEXT');
    expect(migrationContent).toContain('token_expiry TIMESTAMPTZ');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.integrations.access_token IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.integrations.refresh_token IS');
    expect(migrationContent).toContain('OAuth access token (encrypted at application level)');
    expect(migrationContent).toContain('OAuth refresh token (encrypted at application level)');
  });

  test('integrations table supports sync functionality', () => {
    // Test that the integrations table supports sync functionality
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    expect(migrationContent).toContain('sync_enabled BOOLEAN DEFAULT true');
    expect(migrationContent).toContain('last_sync TIMESTAMPTZ');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS integrations_sync_enabled_idx');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS integrations_last_sync_idx');
  });

  test('events table has comprehensive time-based indexing', () => {
    // Test that the events table has comprehensive time-based indexing
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_user_start_time_idx');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_user_end_time_idx');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_time_range_idx');
    expect(migrationContent).toContain('ON public.events(user_id, start_time)');
    expect(migrationContent).toContain('ON public.events(user_id, end_time)');
    expect(migrationContent).toContain('ON public.events(start_time, end_time)');
  });

  test('validation function has proper error handling', () => {
    // Test that the validation function has proper error handling
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    expect(migrationContent).toContain('RAISE EXCEPTION');
    expect(migrationContent).toContain('Each attendee must have a valid email address');
    expect(migrationContent).toContain('LANGUAGE plpgsql');
  });

  test('migration is production ready', () => {
    // Test that the migration is production ready
    const migrationContent = fs.readFileSync('supabase/migrations/004_create_events.sql', 'utf8');
    
    // Check for proper error handling
    expect(migrationContent).toContain('RAISE EXCEPTION');
    
    // Check for proper validation
    expect(migrationContent).toContain('CHECK');
    
    // Check for proper documentation
    expect(migrationContent).toContain('COMMENT ON');
    
    // Check for proper indexing
    expect(migrationContent).toContain('CREATE INDEX');
    
    // Check for proper triggers
    expect(migrationContent).toContain('CREATE TRIGGER');
  });
});

