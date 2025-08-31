import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

test.describe('Reminders Table Migration Tests', () => {
  test('reminders migration file exists', () => {
    // Test that the migration file exists
    expect(fs.existsSync('supabase/migrations/005_create_reminders.sql')).toBe(true);
  });

  test('reminders migration file has correct content', () => {
    // Test that the migration file contains the expected SQL
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    // Check for table creation
    expect(migrationContent).toContain('CREATE TABLE IF NOT EXISTS public.reminders');
    expect(migrationContent).toContain('id UUID PRIMARY KEY DEFAULT gen_random_uuid()');
  });

  test('reminders table has correct structure', () => {
    // Test that the reminders table has all required columns
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    // Check for all required columns in reminders table
    expect(migrationContent).toContain('id UUID PRIMARY KEY');
    expect(migrationContent).toContain('user_id UUID NOT NULL');
    expect(migrationContent).toContain('task_id UUID');
    expect(migrationContent).toContain('event_id UUID');
    expect(migrationContent).toContain('type TEXT NOT NULL');
    expect(migrationContent).toContain('scheduled_time TIMESTAMPTZ NOT NULL');
    expect(migrationContent).toContain('actual_time TIMESTAMPTZ');
    expect(migrationContent).toContain('dismissed BOOLEAN DEFAULT false');
    expect(migrationContent).toContain('snoozed_until TIMESTAMPTZ');
    expect(migrationContent).toContain('personalization_label TEXT');
    expect(migrationContent).toContain('strategy TEXT NOT NULL');
    expect(migrationContent).toContain('effectiveness_score DECIMAL(3,2)');
    expect(migrationContent).toContain('created_at TIMESTAMPTZ DEFAULT NOW()');
    expect(migrationContent).toContain('updated_at TIMESTAMPTZ DEFAULT NOW()');
  });

  test('reminders table has proper constraints', () => {
    // Test that the reminders table has proper constraints
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    // Check for foreign key constraints
    expect(migrationContent).toContain('REFERENCES public.profiles(id) ON DELETE CASCADE');
    expect(migrationContent).toContain('REFERENCES public.tasks(id) ON DELETE CASCADE');
    expect(migrationContent).toContain('REFERENCES public.events(id) ON DELETE CASCADE');
    
    // Check for check constraints
    expect(migrationContent).toContain('CHECK (type IN (\'task\', \'event\', \'habit\'))');
    expect(migrationContent).toContain('CHECK (strategy IN (\'aggressive\', \'gentle\', \'smart\'))');
    expect(migrationContent).toContain('CHECK (effectiveness_score >= 0 AND effectiveness_score <= 1)');
  });

  test('reminders table has updated_at trigger', () => {
    // Test that the reminders table has the updated_at trigger
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE TRIGGER update_reminders_updated_at');
    expect(migrationContent).toContain('BEFORE UPDATE ON public.reminders');
    expect(migrationContent).toContain('EXECUTE FUNCTION public.update_updated_at_column()');
  });

  test('reminders table has validation trigger', () => {
    // Test that the reminders table has the validation trigger
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION public.validate_reminder_relationships()');
    expect(migrationContent).toContain('CREATE TRIGGER validate_reminder_data');
    expect(migrationContent).toContain('BEFORE INSERT OR UPDATE ON public.reminders');
  });

  test('reminder validation handles task relationships', () => {
    // Test that the validation function handles task relationships properly
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.type = \'task\' AND NEW.task_id IS NULL THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'Task reminders must have a task_id\'');
  });

  test('reminder validation handles event relationships', () => {
    // Test that the validation function handles event relationships properly
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.type = \'event\' AND NEW.event_id IS NULL THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'Event reminders must have an event_id\'');
  });

  test('reminder validation handles habit relationships', () => {
    // Test that the validation function handles habit relationships properly
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.type = \'habit\' AND NEW.task_id IS NULL AND NEW.event_id IS NULL THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'Habit reminders must have either task_id or event_id\'');
  });

  test('reminder validation handles scheduled time', () => {
    // Test that the validation function handles scheduled time properly
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.scheduled_time <= NOW() THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'Reminder scheduled_time must be in the future\'');
  });

  test('reminder validation handles snoozed time', () => {
    // Test that the validation function handles snoozed time properly
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.snoozed_until IS NOT NULL AND NEW.snoozed_until <= NEW.scheduled_time THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'snoozed_until must be after scheduled_time\'');
  });

  test('reminder validation handles effectiveness score', () => {
    // Test that the validation function handles effectiveness score properly
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.effectiveness_score IS NOT NULL AND (NEW.effectiveness_score < 0 OR NEW.effectiveness_score > 1) THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'effectiveness_score must be between 0 and 1\'');
  });

  test('reminders table has dismissal trigger', () => {
    // Test that the reminders table has the dismissal trigger
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION public.handle_reminder_dismissal()');
    expect(migrationContent).toContain('CREATE TRIGGER on_reminder_dismissal_change');
    expect(migrationContent).toContain('BEFORE UPDATE ON public.reminders');
  });

  test('dismissal trigger handles actual time', () => {
    // Test that the dismissal trigger handles actual time properly
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.dismissed = true AND OLD.dismissed = false AND NEW.actual_time IS NULL THEN');
    expect(migrationContent).toContain('NEW.actual_time = NOW()');
    expect(migrationContent).toContain('IF NEW.dismissed = false AND OLD.dismissed = true THEN');
    expect(migrationContent).toContain('NEW.actual_time = NULL');
  });

  test('reminders table has performance indexes', () => {
    // Test that the reminders table has proper performance indexes
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    // Check for all required indexes
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_user_id_idx ON public.reminders(user_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_user_scheduled_time_idx ON public.reminders(user_id, scheduled_time)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_task_id_idx ON public.reminders(task_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_event_id_idx ON public.reminders(event_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_type_idx ON public.reminders(type)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_dismissed_idx ON public.reminders(dismissed)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_snoozed_until_idx ON public.reminders(snoozed_until)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_strategy_idx ON public.reminders(strategy)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_effectiveness_score_idx ON public.reminders(effectiveness_score)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_pending_idx ON public.reminders(scheduled_time)');
  });

  test('reminders table has proper documentation', () => {
    // Test that the reminders table has proper documentation
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('COMMENT ON TABLE public.reminders IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.task_id IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.event_id IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.type IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.scheduled_time IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.actual_time IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.dismissed IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.snoozed_until IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.personalization_label IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.strategy IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.effectiveness_score IS');
  });

  test('migration follows SQL best practices', () => {
    // Test that the migration follows SQL best practices
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    // Check for proper SQL formatting
    expect(migrationContent).toContain('-- Create reminders table migration');
    expect(migrationContent).toContain('-- Reminders can be linked to tasks, events, or habits');
    
    // Check for proper table definition
    expect(migrationContent).toContain('CREATE TABLE IF NOT EXISTS');
    expect(migrationContent).toContain('PRIMARY KEY');
    expect(migrationContent).toContain('DEFAULT');
  });

  test('reminders table handles relationships correctly', () => {
    // Test that the reminders table handles relationships correctly
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    // Check for proper foreign key relationships
    expect(migrationContent).toContain('user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE');
    expect(migrationContent).toContain('task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE');
    expect(migrationContent).toContain('event_id UUID REFERENCES public.events(id) ON DELETE CASCADE');
  });

  test('reminders table includes proper defaults', () => {
    // Test that the reminders table includes proper defaults
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('dismissed BOOLEAN DEFAULT false');
    expect(migrationContent).toContain('created_at TIMESTAMPTZ DEFAULT NOW()');
    expect(migrationContent).toContain('updated_at TIMESTAMPTZ DEFAULT NOW()');
  });

  test('reminders table handles data types correctly', () => {
    // Test that the reminders table uses correct data types
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    // Check for appropriate data types
    expect(migrationContent).toContain('UUID PRIMARY KEY');
    expect(migrationContent).toContain('TEXT NOT NULL');
    expect(migrationContent).toContain('TIMESTAMPTZ NOT NULL');
    expect(migrationContent).toContain('BOOLEAN DEFAULT');
    expect(migrationContent).toContain('DECIMAL(3,2) CHECK');
  });

  test('migration file is well-formatted', () => {
    // Test that the migration file is properly formatted and readable
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    // Check that the file is not empty
    expect(migrationContent.length).toBeGreaterThan(100);
    
    // Check for proper line breaks and structure
    const lines = migrationContent.split('\n');
    expect(lines.length).toBeGreaterThan(10);
    
    // Check for proper SQL comments
    expect(migrationContent).toContain('-- Create reminders table migration');
    expect(migrationContent).toContain('-- Reminders can be linked to tasks, events, or habits');
  });

  test('reminders table supports multiple types', () => {
    // Test that the reminders table supports multiple types
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('task');
    expect(migrationContent).toContain('event');
    expect(migrationContent).toContain('habit');
    expect(migrationContent).toContain('CHECK (type IN (\'task\', \'event\', \'habit\'))');
  });

  test('reminders table supports multiple strategies', () => {
    // Test that the reminders table supports multiple strategies
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('aggressive');
    expect(migrationContent).toContain('gentle');
    expect(migrationContent).toContain('smart');
    expect(migrationContent).toContain('CHECK (strategy IN (\'aggressive\', \'gentle\', \'smart\'))');
  });

  test('reminders table supports task linking', () => {
    // Test that the reminders table supports task linking
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_task_id_idx ON public.reminders(task_id)');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.task_id IS');
    expect(migrationContent).toContain('Linked task (for task and habit reminders)');
  });

  test('reminders table supports event linking', () => {
    // Test that the reminders table supports event linking
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('event_id UUID REFERENCES public.events(id) ON DELETE CASCADE');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_event_id_idx ON public.reminders(event_id)');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.event_id IS');
    expect(migrationContent).toContain('Linked event (for event and habit reminders)');
  });

  test('reminders table supports scheduling', () => {
    // Test that the reminders table supports scheduling
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('scheduled_time TIMESTAMPTZ NOT NULL');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_user_scheduled_time_idx');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.scheduled_time IS');
    expect(migrationContent).toContain('When the reminder should trigger');
  });

  test('reminders table supports dismissal tracking', () => {
    // Test that the reminders table supports dismissal tracking
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('dismissed BOOLEAN DEFAULT false');
    expect(migrationContent).toContain('actual_time TIMESTAMPTZ');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_dismissed_idx');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.dismissed IS');
    expect(migrationContent).toContain('Whether the reminder has been dismissed');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.actual_time IS');
    expect(migrationContent).toContain('When the reminder was actually dismissed (auto-set on dismissal)');
  });

  test('reminders table supports snoozing', () => {
    // Test that the reminders table supports snoozing
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('snoozed_until TIMESTAMPTZ');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_snoozed_until_idx');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.snoozed_until IS');
    expect(migrationContent).toContain('If snoozed, when to show again');
  });

  test('reminders table supports personalization', () => {
    // Test that the reminders table supports personalization
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('personalization_label TEXT');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.personalization_label IS');
    expect(migrationContent).toContain('Custom label for personalization');
  });

  test('reminders table supports effectiveness tracking', () => {
    // Test that the reminders table supports effectiveness tracking
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('effectiveness_score DECIMAL(3,2) CHECK (effectiveness_score >= 0 AND effectiveness_score <= 1)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_effectiveness_score_idx');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.reminders.effectiveness_score IS');
    expect(migrationContent).toContain('User feedback on reminder effectiveness (0-1 scale)');
  });

  test('reminders table has comprehensive indexing strategy', () => {
    // Test that the reminders table has comprehensive indexing strategy
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    // Check for user-based queries
    expect(migrationContent).toContain('reminders_user_id_idx');
    expect(migrationContent).toContain('reminders_user_scheduled_time_idx');
    
    // Check for relationship-based queries
    expect(migrationContent).toContain('reminders_task_id_idx');
    expect(migrationContent).toContain('reminders_event_id_idx');
    
    // Check for type and strategy queries
    expect(migrationContent).toContain('reminders_type_idx');
    expect(migrationContent).toContain('reminders_strategy_idx');
    
    // Check for status-based queries
    expect(migrationContent).toContain('reminders_dismissed_idx');
    expect(migrationContent).toContain('reminders_snoozed_until_idx');
    
    // Check for pending reminders query
    expect(migrationContent).toContain('reminders_pending_idx');
    expect(migrationContent).toContain('WHERE dismissed = false AND (snoozed_until IS NULL OR snoozed_until <= NOW())');
  });

  test('validation function has proper error handling', () => {
    // Test that the validation function has proper error handling
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
    expect(migrationContent).toContain('RAISE EXCEPTION');
    expect(migrationContent).toContain('Task reminders must have a task_id');
    expect(migrationContent).toContain('Event reminders must have an event_id');
    expect(migrationContent).toContain('Habit reminders must have either task_id or event_id');
    expect(migrationContent).toContain('Reminder scheduled_time must be in the future');
    expect(migrationContent).toContain('snoozed_until must be after scheduled_time');
    expect(migrationContent).toContain('effectiveness_score must be between 0 and 1');
    expect(migrationContent).toContain('LANGUAGE plpgsql');
  });

  test('migration is production ready', () => {
    // Test that the migration is production ready
    const migrationContent = fs.readFileSync('supabase/migrations/005_create_reminders.sql', 'utf8');
    
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

