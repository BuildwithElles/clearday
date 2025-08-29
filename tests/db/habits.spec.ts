import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

test.describe('Habits Table Migration Tests', () => {
  test('habits migration file exists', () => {
    // Test that the migration file exists
    expect(fs.existsSync('supabase/migrations/007_create_habits.sql')).toBe(true);
  });

  test('habits migration file has correct content', () => {
    // Test that the migration file contains the expected SQL
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    // Check for table creation
    expect(migrationContent).toContain('CREATE TABLE IF NOT EXISTS public.habits');
    expect(migrationContent).toContain('id UUID PRIMARY KEY DEFAULT gen_random_uuid()');
  });

  test('habits table has correct structure', () => {
    // Test that the habits table has all required columns
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    // Check for all required columns in habits table
    expect(migrationContent).toContain('id UUID PRIMARY KEY');
    expect(migrationContent).toContain('user_id UUID NOT NULL');
    expect(migrationContent).toContain('name TEXT NOT NULL');
    expect(migrationContent).toContain('description TEXT');
    expect(migrationContent).toContain('frequency TEXT NOT NULL');
    expect(migrationContent).toContain('target_count INTEGER DEFAULT 1');
    expect(migrationContent).toContain('current_streak INTEGER DEFAULT 0');
    expect(migrationContent).toContain('longest_streak INTEGER DEFAULT 0');
    expect(migrationContent).toContain('auto_rules JSONB DEFAULT \'{}\'');
    expect(migrationContent).toContain('reminder_time TIME');
    expect(migrationContent).toContain('category TEXT');
    expect(migrationContent).toContain('impact_per_completion DECIMAL(10,3)');
    expect(migrationContent).toContain('created_at TIMESTAMPTZ DEFAULT NOW()');
    expect(migrationContent).toContain('updated_at TIMESTAMPTZ DEFAULT NOW()');
  });

  test('habits table has proper constraints', () => {
    // Test that the habits table has proper constraints
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    // Check for foreign key constraints
    expect(migrationContent).toContain('REFERENCES public.profiles(id) ON DELETE CASCADE');
    
    // Check for check constraints
    expect(migrationContent).toContain('CHECK (LENGTH(name) > 0)');
    expect(migrationContent).toContain('CHECK (frequency IN (\'daily\', \'weekly\', \'monthly\'))');
    expect(migrationContent).toContain('CHECK (target_count > 0)');
    expect(migrationContent).toContain('CHECK (current_streak >= 0)');
    expect(migrationContent).toContain('CHECK (longest_streak >= 0)');
    expect(migrationContent).toContain('CHECK (impact_per_completion >= 0)');
  });

  test('habits table has updated_at trigger', () => {
    // Test that the habits table has the updated_at trigger
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE TRIGGER update_habits_updated_at');
    expect(migrationContent).toContain('BEFORE UPDATE ON public.habits');
    expect(migrationContent).toContain('EXECUTE FUNCTION public.update_updated_at_column()');
  });

  test('habits table has validation trigger', () => {
    // Test that the habits table has the validation trigger
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION public.validate_habit_data()');
    expect(migrationContent).toContain('CREATE TRIGGER validate_habit_data_trigger');
    expect(migrationContent).toContain('BEFORE INSERT OR UPDATE ON public.habits');
  });

  test('habit validation handles name', () => {
    // Test that the validation function handles name properly
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('IF LENGTH(NEW.name) = 0 THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'Habit name cannot be empty\'');
  });

  test('habit validation handles target_count', () => {
    // Test that the validation function handles target_count properly
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.target_count <= 0 THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'target_count must be positive\'');
  });

  test('habit validation handles streaks', () => {
    // Test that the validation function handles streaks properly
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.current_streak < 0 THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'current_streak cannot be negative\'');
    expect(migrationContent).toContain('IF NEW.longest_streak < 0 THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'longest_streak cannot be negative\'');
  });

  test('habit validation handles longest_streak logic', () => {
    // Test that the validation function handles longest_streak logic properly
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.longest_streak < NEW.current_streak THEN');
    expect(migrationContent).toContain('NEW.longest_streak = NEW.current_streak');
  });

  test('habit validation handles impact_per_completion', () => {
    // Test that the validation function handles impact_per_completion properly
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.impact_per_completion IS NOT NULL AND NEW.impact_per_completion < 0 THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'impact_per_completion must be non-negative\'');
  });

  test('habit validation handles auto_rules', () => {
    // Test that the validation function handles auto_rules properly
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.auto_rules IS NOT NULL AND NEW.auto_rules = \'null\'::jsonb THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'auto_rules cannot be null JSONB\'');
  });

  test('habits table has streak update trigger', () => {
    // Test that the habits table has the streak update trigger
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION public.handle_habit_streak_update()');
    expect(migrationContent).toContain('CREATE TRIGGER on_habit_streak_update');
    expect(migrationContent).toContain('BEFORE UPDATE ON public.habits');
  });

  test('streak update trigger handles longest_streak', () => {
    // Test that the streak update trigger handles longest_streak properly
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.current_streak > NEW.longest_streak THEN');
    expect(migrationContent).toContain('NEW.longest_streak = NEW.current_streak');
  });

  test('habits table has performance indexes', () => {
    // Test that the habits table has proper performance indexes
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    // Check for all required indexes
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_user_id_idx ON public.habits(user_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_user_frequency_idx ON public.habits(user_id, frequency)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_frequency_idx ON public.habits(frequency)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_category_idx ON public.habits(category)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_reminder_time_idx ON public.habits(reminder_time)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_current_streak_idx ON public.habits(current_streak)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_longest_streak_idx ON public.habits(longest_streak)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_impact_idx ON public.habits(impact_per_completion)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_active_idx ON public.habits(created_at)');
  });

  test('habits table has proper documentation', () => {
    // Test that the habits table has proper documentation
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('COMMENT ON TABLE public.habits IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.name IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.description IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.frequency IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.target_count IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.current_streak IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.longest_streak IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.auto_rules IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.reminder_time IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.category IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.impact_per_completion IS');
  });

  test('migration follows SQL best practices', () => {
    // Test that the migration follows SQL best practices
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    // Check for proper SQL formatting
    expect(migrationContent).toContain('-- Create habits table migration');
    expect(migrationContent).toContain('-- Habits are recurring behaviors that users want to track and build');
    
    // Check for proper table definition
    expect(migrationContent).toContain('CREATE TABLE IF NOT EXISTS');
    expect(migrationContent).toContain('PRIMARY KEY');
    expect(migrationContent).toContain('DEFAULT');
  });

  test('habits table handles relationships correctly', () => {
    // Test that the habits table handles relationships correctly
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    // Check for proper foreign key relationships
    expect(migrationContent).toContain('user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE');
  });

  test('habits table includes proper defaults', () => {
    // Test that the habits table includes proper defaults
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('auto_rules JSONB DEFAULT \'{}\'');
    expect(migrationContent).toContain('target_count INTEGER DEFAULT 1');
    expect(migrationContent).toContain('current_streak INTEGER DEFAULT 0');
    expect(migrationContent).toContain('longest_streak INTEGER DEFAULT 0');
    expect(migrationContent).toContain('created_at TIMESTAMPTZ DEFAULT NOW()');
    expect(migrationContent).toContain('updated_at TIMESTAMPTZ DEFAULT NOW()');
  });

  test('habits table handles data types correctly', () => {
    // Test that the habits table uses correct data types
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    // Check for appropriate data types
    expect(migrationContent).toContain('UUID PRIMARY KEY');
    expect(migrationContent).toContain('TEXT NOT NULL');
    expect(migrationContent).toContain('JSONB DEFAULT');
    expect(migrationContent).toContain('DECIMAL(10,3) CHECK');
    expect(migrationContent).toContain('INTEGER DEFAULT');
    expect(migrationContent).toContain('TIME');
    expect(migrationContent).toContain('TIMESTAMPTZ');
  });

  test('migration file is well-formatted', () => {
    // Test that the migration file is properly formatted and readable
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    // Check that the file is not empty
    expect(migrationContent.length).toBeGreaterThan(100);
    
    // Check for proper line breaks and structure
    const lines = migrationContent.split('\n');
    expect(lines.length).toBeGreaterThan(10);
    
    // Check for proper SQL comments
    expect(migrationContent).toContain('-- Create habits table migration');
    expect(migrationContent).toContain('-- Habits are recurring behaviors');
  });

  test('habits table supports multiple frequencies', () => {
    // Test that the habits table supports multiple frequencies
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('daily');
    expect(migrationContent).toContain('weekly');
    expect(migrationContent).toContain('monthly');
    expect(migrationContent).toContain('CHECK (frequency IN (\'daily\', \'weekly\', \'monthly\'))');
  });

  test('habits table supports streak tracking', () => {
    // Test that the habits table supports streak tracking
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('current_streak INTEGER DEFAULT 0');
    expect(migrationContent).toContain('longest_streak INTEGER DEFAULT 0');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_current_streak_idx');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_longest_streak_idx');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.current_streak IS');
    expect(migrationContent).toContain('Current consecutive streak of completed habit periods');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.longest_streak IS');
    expect(migrationContent).toContain('Longest consecutive streak achieved (auto-updated)');
  });

  test('habits table supports auto rules', () => {
    // Test that the habits table supports auto rules
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('auto_rules JSONB DEFAULT \'{}\'');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.auto_rules IS');
    expect(migrationContent).toContain('JSON rules for automatic habit detection and completion');
  });

  test('habits table supports reminders', () => {
    // Test that the habits table supports reminders
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('reminder_time TIME');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_reminder_time_idx');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.reminder_time IS');
    expect(migrationContent).toContain('Time of day to send reminders for this habit');
  });

  test('habits table supports categories', () => {
    // Test that the habits table supports categories
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('category TEXT');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_category_idx');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.category IS');
    expect(migrationContent).toContain('Category of the habit (e.g., "health", "productivity", "eco")');
  });

  test('habits table supports impact tracking', () => {
    // Test that the habits table supports impact tracking
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('impact_per_completion DECIMAL(10,3) CHECK (impact_per_completion >= 0)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_impact_idx');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.impact_per_completion IS');
    expect(migrationContent).toContain('CO2 impact in kilograms per habit completion');
  });

  test('habits table supports target counts', () => {
    // Test that the habits table supports target counts
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('target_count INTEGER DEFAULT 1 CHECK (target_count > 0)');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.habits.target_count IS');
    expect(migrationContent).toContain('Number of times the habit should be completed per frequency period');
  });

  test('habits table has comprehensive indexing strategy', () => {
    // Test that the habits table has comprehensive indexing strategy
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    // Check for user-based queries
    expect(migrationContent).toContain('habits_user_id_idx');
    expect(migrationContent).toContain('habits_user_frequency_idx');
    
    // Check for frequency-based queries
    expect(migrationContent).toContain('habits_frequency_idx');
    
    // Check for category-based queries
    expect(migrationContent).toContain('habits_category_idx');
    expect(migrationContent).toContain('WHERE category IS NOT NULL');
    
    // Check for reminder-based queries
    expect(migrationContent).toContain('habits_reminder_time_idx');
    expect(migrationContent).toContain('WHERE reminder_time IS NOT NULL');
    
    // Check for streak-based queries
    expect(migrationContent).toContain('habits_current_streak_idx');
    expect(migrationContent).toContain('habits_longest_streak_idx');
    
    // Check for impact-based queries
    expect(migrationContent).toContain('habits_impact_idx');
    expect(migrationContent).toContain('WHERE impact_per_completion IS NOT NULL');
    
    // Check for active habits query
    expect(migrationContent).toContain('habits_active_idx');
    expect(migrationContent).toContain('WHERE current_streak > 0');
  });

  test('validation function has proper error handling', () => {
    // Test that the validation function has proper error handling
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('RAISE EXCEPTION');
    expect(migrationContent).toContain('Habit name cannot be empty');
    expect(migrationContent).toContain('target_count must be positive');
    expect(migrationContent).toContain('current_streak cannot be negative');
    expect(migrationContent).toContain('longest_streak cannot be negative');
    expect(migrationContent).toContain('impact_per_completion must be non-negative');
    expect(migrationContent).toContain('auto_rules cannot be null JSONB');
    expect(migrationContent).toContain('LANGUAGE plpgsql');
  });

  test('streak update function has proper logic', () => {
    // Test that the streak update function has proper logic
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.current_streak > NEW.longest_streak THEN');
    expect(migrationContent).toContain('NEW.longest_streak = NEW.current_streak');
    expect(migrationContent).toContain('RETURN NEW');
  });

  test('migration is production ready', () => {
    // Test that the migration is production ready
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
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

  test('habits table supports all required fields from type definition', () => {
    // Test that the habits table supports all fields from the Habit type definition
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    // Check for all fields from the Habit interface
    expect(migrationContent).toContain('id UUID PRIMARY KEY');
    expect(migrationContent).toContain('user_id UUID NOT NULL');
    expect(migrationContent).toContain('name TEXT NOT NULL');
    expect(migrationContent).toContain('description TEXT');
    expect(migrationContent).toContain('frequency TEXT NOT NULL');
    expect(migrationContent).toContain('target_count INTEGER');
    expect(migrationContent).toContain('current_streak INTEGER');
    expect(migrationContent).toContain('longest_streak INTEGER');
    expect(migrationContent).toContain('auto_rules JSONB');
    expect(migrationContent).toContain('reminder_time TIME');
    expect(migrationContent).toContain('category TEXT');
    expect(migrationContent).toContain('impact_per_completion DECIMAL');
    expect(migrationContent).toContain('created_at TIMESTAMPTZ');
    expect(migrationContent).toContain('updated_at TIMESTAMPTZ');
  });

  test('habits table supports frequency constraints', () => {
    // Test that the habits table supports frequency constraints
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('CHECK (frequency IN (\'daily\', \'weekly\', \'monthly\'))');
  });

  test('habits table supports positive constraints', () => {
    // Test that the habits table supports positive constraints
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('CHECK (target_count > 0)');
    expect(migrationContent).toContain('CHECK (current_streak >= 0)');
    expect(migrationContent).toContain('CHECK (longest_streak >= 0)');
    expect(migrationContent).toContain('CHECK (impact_per_completion >= 0)');
  });

  test('habits table supports name validation', () => {
    // Test that the habits table supports name validation
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('CHECK (LENGTH(name) > 0)');
  });

  test('habits table supports cascade deletion', () => {
    // Test that the habits table supports cascade deletion
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('ON DELETE CASCADE');
  });

  test('habits table supports automatic timestamps', () => {
    // Test that the habits table supports automatic timestamps
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('created_at TIMESTAMPTZ DEFAULT NOW()');
    expect(migrationContent).toContain('updated_at TIMESTAMPTZ DEFAULT NOW()');
  });

  test('habits table supports UUID primary key', () => {
    // Test that the habits table supports UUID primary key
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('id UUID PRIMARY KEY DEFAULT gen_random_uuid()');
  });

  test('habits table supports JSONB for auto rules', () => {
    // Test that the habits table supports JSONB for auto rules
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('auto_rules JSONB DEFAULT \'{}\'');
  });

  test('habits table supports TIME for reminders', () => {
    // Test that the habits table supports TIME for reminders
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('reminder_time TIME');
  });

  test('habits table supports DECIMAL for impact', () => {
    // Test that the habits table supports DECIMAL for impact
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('impact_per_completion DECIMAL(10,3)');
  });

  test('habits table supports conditional indexes', () => {
    // Test that the habits table supports conditional indexes
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('WHERE category IS NOT NULL');
    expect(migrationContent).toContain('WHERE reminder_time IS NOT NULL');
    expect(migrationContent).toContain('WHERE impact_per_completion IS NOT NULL');
    expect(migrationContent).toContain('WHERE current_streak > 0');
  });

  test('habits table supports comprehensive documentation', () => {
    // Test that the habits table supports comprehensive documentation
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_habits.sql', 'utf8');
    
    expect(migrationContent).toContain('User habits for tracking recurring behaviors and building sustainable practices');
    expect(migrationContent).toContain('Name of the habit (e.g., "Morning Exercise", "Read 30 minutes")');
    expect(migrationContent).toContain('How often the habit should be performed: daily, weekly, or monthly');
    expect(migrationContent).toContain('Number of times the habit should be completed per frequency period');
    expect(migrationContent).toContain('Current consecutive streak of completed habit periods');
    expect(migrationContent).toContain('Longest consecutive streak achieved (auto-updated)');
    expect(migrationContent).toContain('JSON rules for automatic habit detection and completion');
    expect(migrationContent).toContain('Time of day to send reminders for this habit');
    expect(migrationContent).toContain('Category of the habit (e.g., "health", "productivity", "eco")');
    expect(migrationContent).toContain('CO2 impact in kilograms per habit completion');
  });
});
