import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

test.describe('Nudges Table Migration Tests', () => {
  test('nudges migration file exists', () => {
    // Test that the migration file exists
    expect(fs.existsSync('supabase/migrations/006_create_nudges.sql')).toBe(true);
  });

  test('nudges migration file has correct content', () => {
    // Test that the migration file contains the expected SQL
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    // Check for table creation
    expect(migrationContent).toContain('CREATE TABLE IF NOT EXISTS public.nudges');
    expect(migrationContent).toContain('id UUID PRIMARY KEY DEFAULT gen_random_uuid()');
  });

  test('nudges table has correct structure', () => {
    // Test that the nudges table has all required columns
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    // Check for all required columns in nudges table
    expect(migrationContent).toContain('id UUID PRIMARY KEY');
    expect(migrationContent).toContain('user_id UUID NOT NULL');
    expect(migrationContent).toContain('type TEXT NOT NULL');
    expect(migrationContent).toContain('title TEXT NOT NULL');
    expect(migrationContent).toContain('message TEXT NOT NULL');
    expect(migrationContent).toContain('action_type TEXT');
    expect(migrationContent).toContain('action_data JSONB DEFAULT \'{}\'');
    expect(migrationContent).toContain('impact_kg DECIMAL(8,3)');
    expect(migrationContent).toContain('shown_at TIMESTAMPTZ');
    expect(migrationContent).toContain('acted_on BOOLEAN DEFAULT false');
    expect(migrationContent).toContain('acted_at TIMESTAMPTZ');
    expect(migrationContent).toContain('expires_at TIMESTAMPTZ');
    expect(migrationContent).toContain('created_at TIMESTAMPTZ DEFAULT NOW()');
  });

  test('nudges table has proper constraints', () => {
    // Test that the nudges table has proper constraints
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    // Check for foreign key constraints
    expect(migrationContent).toContain('REFERENCES public.profiles(id) ON DELETE CASCADE');
    
    // Check for check constraints
    expect(migrationContent).toContain('CHECK (type IN (\'eco\', \'health\', \'productivity\', \'social\'))');
    expect(migrationContent).toContain('CHECK (LENGTH(title) > 0)');
    expect(migrationContent).toContain('CHECK (LENGTH(message) > 0)');
    expect(migrationContent).toContain('CHECK (action_type IN (\'task_creation\', \'habit_start\', \'reminder_set\'))');
    expect(migrationContent).toContain('CHECK (impact_kg >= 0)');
  });

  test('nudges table has updated_at trigger', () => {
    // Test that the nudges table has the updated_at trigger
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE TRIGGER update_nudges_updated_at');
    expect(migrationContent).toContain('BEFORE UPDATE ON public.nudges');
    expect(migrationContent).toContain('EXECUTE FUNCTION public.update_updated_at_column()');
  });

  test('nudges table has validation trigger', () => {
    // Test that the nudges table has the validation trigger
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION public.validate_nudge_data()');
    expect(migrationContent).toContain('CREATE TRIGGER validate_nudge_data_trigger');
    expect(migrationContent).toContain('BEFORE INSERT OR UPDATE ON public.nudges');
  });

  test('nudge validation handles title and message', () => {
    // Test that the validation function handles title and message properly
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('IF LENGTH(NEW.title) = 0 THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'Nudge title cannot be empty\'');
    expect(migrationContent).toContain('IF LENGTH(NEW.message) = 0 THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'Nudge message cannot be empty\'');
  });

  test('nudge validation handles impact_kg', () => {
    // Test that the validation function handles impact_kg properly
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.impact_kg IS NOT NULL AND NEW.impact_kg < 0 THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'impact_kg must be non-negative\'');
  });

  test('nudge validation handles expires_at', () => {
    // Test that the validation function handles expires_at properly
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.expires_at IS NOT NULL AND NEW.expires_at <= NOW() THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'expires_at must be in the future\'');
  });

  test('nudge validation handles acted_on and acted_at', () => {
    // Test that the validation function handles acted_on and acted_at properly
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.acted_on = true AND NEW.acted_at IS NULL THEN');
    expect(migrationContent).toContain('NEW.acted_at = NOW()');
    expect(migrationContent).toContain('IF NEW.acted_on = false THEN');
    expect(migrationContent).toContain('NEW.acted_at = NULL');
  });

  test('nudge validation handles shown_at', () => {
    // Test that the validation function handles shown_at properly
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.shown_at IS NOT NULL AND NEW.shown_at > NOW() THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'shown_at cannot be in the future\'');
  });

  test('nudge validation handles action_data', () => {
    // Test that the validation function handles action_data properly
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.action_data IS NOT NULL AND NEW.action_data = \'null\'::jsonb THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'action_data cannot be null JSONB\'');
  });

  test('nudges table has shown trigger', () => {
    // Test that the nudges table has the shown trigger
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION public.handle_nudge_shown()');
    expect(migrationContent).toContain('CREATE TRIGGER on_nudge_shown');
    expect(migrationContent).toContain('BEFORE UPDATE ON public.nudges');
  });

  test('shown trigger handles shown_at', () => {
    // Test that the shown trigger handles shown_at properly
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.shown_at IS NULL AND OLD.shown_at IS NULL THEN');
    expect(migrationContent).toContain('NEW.shown_at = NOW()');
  });

  test('nudges table has performance indexes', () => {
    // Test that the nudges table has proper performance indexes
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    // Check for all required indexes
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_user_id_idx ON public.nudges(user_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_user_type_idx ON public.nudges(user_id, type)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_type_idx ON public.nudges(type)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_acted_on_idx ON public.nudges(acted_on)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_expires_at_idx ON public.nudges(expires_at)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_shown_at_idx ON public.nudges(shown_at)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_action_type_idx ON public.nudges(action_type)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_impact_kg_idx ON public.nudges(impact_kg)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_active_idx ON public.nudges(created_at)');
  });

  test('nudges table has proper documentation', () => {
    // Test that the nudges table has proper documentation
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('COMMENT ON TABLE public.nudges IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.type IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.title IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.message IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.action_type IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.action_data IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.impact_kg IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.shown_at IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.acted_on IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.acted_at IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.expires_at IS');
  });

  test('migration follows SQL best practices', () => {
    // Test that the migration follows SQL best practices
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    // Check for proper SQL formatting
    expect(migrationContent).toContain('-- Create nudges table migration');
    expect(migrationContent).toContain('-- Nudges are AI-powered suggestions for eco-friendly, healthy, and productive actions');
    
    // Check for proper table definition
    expect(migrationContent).toContain('CREATE TABLE IF NOT EXISTS');
    expect(migrationContent).toContain('PRIMARY KEY');
    expect(migrationContent).toContain('DEFAULT');
  });

  test('nudges table handles relationships correctly', () => {
    // Test that the nudges table handles relationships correctly
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    // Check for proper foreign key relationships
    expect(migrationContent).toContain('user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE');
  });

  test('nudges table includes proper defaults', () => {
    // Test that the nudges table includes proper defaults
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('action_data JSONB DEFAULT \'{}\'');
    expect(migrationContent).toContain('acted_on BOOLEAN DEFAULT false');
    expect(migrationContent).toContain('created_at TIMESTAMPTZ DEFAULT NOW()');
  });

  test('nudges table handles data types correctly', () => {
    // Test that the nudges table uses correct data types
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    // Check for appropriate data types
    expect(migrationContent).toContain('UUID PRIMARY KEY');
    expect(migrationContent).toContain('TEXT NOT NULL');
    expect(migrationContent).toContain('JSONB DEFAULT');
    expect(migrationContent).toContain('DECIMAL(8,3) CHECK');
    expect(migrationContent).toContain('BOOLEAN DEFAULT');
    expect(migrationContent).toContain('TIMESTAMPTZ');
  });

  test('migration file is well-formatted', () => {
    // Test that the migration file is properly formatted and readable
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    // Check that the file is not empty
    expect(migrationContent.length).toBeGreaterThan(100);
    
    // Check for proper line breaks and structure
    const lines = migrationContent.split('\n');
    expect(lines.length).toBeGreaterThan(10);
    
    // Check for proper SQL comments
    expect(migrationContent).toContain('-- Create nudges table migration');
    expect(migrationContent).toContain('-- Nudges are AI-powered suggestions');
  });

  test('nudges table supports multiple types', () => {
    // Test that the nudges table supports multiple types
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('eco');
    expect(migrationContent).toContain('health');
    expect(migrationContent).toContain('productivity');
    expect(migrationContent).toContain('social');
    expect(migrationContent).toContain('CHECK (type IN (\'eco\', \'health\', \'productivity\', \'social\'))');
  });

  test('nudges table supports multiple action types', () => {
    // Test that the nudges table supports multiple action types
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('task_creation');
    expect(migrationContent).toContain('habit_start');
    expect(migrationContent).toContain('reminder_set');
    expect(migrationContent).toContain('CHECK (action_type IN (\'task_creation\', \'habit_start\', \'reminder_set\'))');
  });

  test('nudges table supports action data', () => {
    // Test that the nudges table supports action data
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('action_data JSONB DEFAULT \'{}\'');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.action_data IS');
    expect(migrationContent).toContain('JSON data for the suggested action (task details, habit info, etc.)');
  });

  test('nudges table supports impact tracking', () => {
    // Test that the nudges table supports impact tracking
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('impact_kg DECIMAL(8,3) CHECK (impact_kg >= 0)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_impact_kg_idx');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.impact_kg IS');
    expect(migrationContent).toContain('Estimated CO2 impact in kilograms if the nudge is acted upon');
  });

  test('nudges table supports shown tracking', () => {
    // Test that the nudges table supports shown tracking
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('shown_at TIMESTAMPTZ');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_shown_at_idx');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.shown_at IS');
    expect(migrationContent).toContain('When the nudge was first shown to the user (auto-set on first access)');
  });

  test('nudges table supports action tracking', () => {
    // Test that the nudges table supports action tracking
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('acted_on BOOLEAN DEFAULT false');
    expect(migrationContent).toContain('acted_at TIMESTAMPTZ');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_acted_on_idx');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.acted_on IS');
    expect(migrationContent).toContain('Whether the user acted on the nudge suggestion');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.acted_at IS');
    expect(migrationContent).toContain('When the user acted on the nudge (auto-set when acted_on becomes true)');
  });

  test('nudges table supports expiration', () => {
    // Test that the nudges table supports expiration
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('expires_at TIMESTAMPTZ');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_expires_at_idx');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.nudges.expires_at IS');
    expect(migrationContent).toContain('When the nudge expires and should no longer be shown');
  });

  test('nudges table has comprehensive indexing strategy', () => {
    // Test that the nudges table has comprehensive indexing strategy
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    // Check for user-based queries
    expect(migrationContent).toContain('nudges_user_id_idx');
    expect(migrationContent).toContain('nudges_user_type_idx');
    
    // Check for type-based queries
    expect(migrationContent).toContain('nudges_type_idx');
    expect(migrationContent).toContain('nudges_action_type_idx');
    
    // Check for status-based queries
    expect(migrationContent).toContain('nudges_acted_on_idx');
    expect(migrationContent).toContain('nudges_expires_at_idx');
    expect(migrationContent).toContain('nudges_shown_at_idx');
    
    // Check for impact-based queries
    expect(migrationContent).toContain('nudges_impact_kg_idx');
    
    // Check for active nudges query
    expect(migrationContent).toContain('nudges_active_idx');
    expect(migrationContent).toContain('WHERE acted_on = false AND (expires_at IS NULL OR expires_at > NOW())');
  });

  test('validation function has proper error handling', () => {
    // Test that the validation function has proper error handling
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
    expect(migrationContent).toContain('RAISE EXCEPTION');
    expect(migrationContent).toContain('Nudge title cannot be empty');
    expect(migrationContent).toContain('Nudge message cannot be empty');
    expect(migrationContent).toContain('impact_kg must be non-negative');
    expect(migrationContent).toContain('expires_at must be in the future');
    expect(migrationContent).toContain('shown_at cannot be in the future');
    expect(migrationContent).toContain('action_data cannot be null JSONB');
    expect(migrationContent).toContain('LANGUAGE plpgsql');
  });

  test('migration is production ready', () => {
    // Test that the migration is production ready
    const migrationContent = fs.readFileSync('supabase/migrations/006_create_nudges.sql', 'utf8');
    
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
