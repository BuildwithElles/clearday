import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

test.describe('Tasks Table Migration Tests', () => {
  test('tasks migration file exists', () => {
    // Test that the migration file exists
    expect(fs.existsSync('supabase/migrations/003_create_tasks.sql')).toBe(true);
  });

  test('tasks migration file has correct content', () => {
    // Test that the migration file contains the expected SQL
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    // Check for table creation
    expect(migrationContent).toContain('CREATE TABLE IF NOT EXISTS public.tasks');
    expect(migrationContent).toContain('id UUID PRIMARY KEY DEFAULT gen_random_uuid()');
    expect(migrationContent).toContain('user_id UUID NOT NULL REFERENCES public.profiles(id)');
  });

  test('tasks table has correct structure', () => {
    // Test that the table has all required columns
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    // Check for all required columns
    expect(migrationContent).toContain('id UUID PRIMARY KEY');
    expect(migrationContent).toContain('user_id UUID NOT NULL');
    expect(migrationContent).toContain('household_id UUID');
    expect(migrationContent).toContain('title TEXT NOT NULL');
    expect(migrationContent).toContain('description TEXT');
    expect(migrationContent).toContain('due_date DATE');
    expect(migrationContent).toContain('due_time TIME');
    expect(migrationContent).toContain('completed BOOLEAN DEFAULT false');
    expect(migrationContent).toContain('completed_at TIMESTAMPTZ');
    expect(migrationContent).toContain('priority INTEGER');
    expect(migrationContent).toContain('tags TEXT[]');
    expect(migrationContent).toContain('recurring_rule JSONB');
    expect(migrationContent).toContain('source TEXT DEFAULT \'manual\'');
    expect(migrationContent).toContain('created_at TIMESTAMPTZ DEFAULT NOW()');
    expect(migrationContent).toContain('updated_at TIMESTAMPTZ DEFAULT NOW()');
  });

  test('tasks table has proper constraints', () => {
    // Test that the table has proper constraints
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    // Check for foreign key constraints
    expect(migrationContent).toContain('REFERENCES public.profiles(id) ON DELETE CASCADE');
    expect(migrationContent).toContain('REFERENCES public.households(id) ON DELETE SET NULL');
    
    // Check for check constraints
    expect(migrationContent).toContain('CHECK (LENGTH(title) > 0)');
    expect(migrationContent).toContain('CHECK (priority IN (1,2,3,4))');
    expect(migrationContent).toContain('CHECK (source IN (\'manual\', \'calendar\', \'habit\', \'ai_suggested\'))');
  });

  test('tasks table has updated_at trigger', () => {
    // Test that the table has the updated_at trigger
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE TRIGGER update_tasks_updated_at');
    expect(migrationContent).toContain('BEFORE UPDATE ON public.tasks');
    expect(migrationContent).toContain('EXECUTE FUNCTION public.update_updated_at_column()');
  });

  test('tasks table has completion trigger', () => {
    // Test that the table has the completion trigger
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION public.handle_task_completion()');
    expect(migrationContent).toContain('CREATE TRIGGER on_task_completion_change');
    expect(migrationContent).toContain('BEFORE UPDATE ON public.tasks');
  });

  test('tasks completion trigger handles completion logic', () => {
    // Test that the completion trigger has proper logic
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NEW.completed = true AND (OLD.completed = false OR OLD.completed IS NULL) THEN');
    expect(migrationContent).toContain('NEW.completed_at = NOW()');
    expect(migrationContent).toContain('ELSIF NEW.completed = false AND OLD.completed = true THEN');
    expect(migrationContent).toContain('NEW.completed_at = NULL');
  });

  test('tasks table has recurring rule validation', () => {
    // Test that the table has recurring rule validation
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION public.validate_recurring_rule()');
    expect(migrationContent).toContain('CREATE TRIGGER validate_task_recurring_rule');
    expect(migrationContent).toContain('BEFORE INSERT OR UPDATE ON public.tasks');
  });

  test('recurring rule validation checks frequency', () => {
    // Test that the validation checks for frequency
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    expect(migrationContent).toContain('IF NOT (NEW.recurring_rule ? \'frequency\') THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'recurring_rule must contain a frequency field\'');
    expect(migrationContent).toContain('IF NOT (NEW.recurring_rule->>\'frequency\' IN (\'daily\', \'weekly\', \'monthly\', \'yearly\')) THEN');
    expect(migrationContent).toContain('RAISE EXCEPTION \'recurring_rule frequency must be one of: daily, weekly, monthly, yearly\'');
  });

  test('tasks table has performance indexes', () => {
    // Test that the table has proper performance indexes
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_user_due_date_idx ON public.tasks(user_id, due_date)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_household_id_idx ON public.tasks(household_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_completed_idx ON public.tasks(completed)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_priority_idx ON public.tasks(priority)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_tags_gin_idx ON public.tasks USING gin(tags)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_source_idx ON public.tasks(source)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON public.tasks(created_at)');
  });

  test('tasks table has proper documentation', () => {
    // Test that the table has proper documentation
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    expect(migrationContent).toContain('COMMENT ON TABLE public.tasks IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.tasks.user_id IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.tasks.household_id IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.tasks.priority IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.tasks.tags IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.tasks.recurring_rule IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.tasks.source IS');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.tasks.completed_at IS');
  });

  test('tasks table follows SQL best practices', () => {
    // Test that the migration follows SQL best practices
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    // Check for proper SQL formatting
    expect(migrationContent).toContain('-- Create tasks table migration');
    expect(migrationContent).toContain('-- Tasks can be personal or shared within a household');
    
    // Check for proper table definition
    expect(migrationContent).toContain('CREATE TABLE IF NOT EXISTS');
    expect(migrationContent).toContain('PRIMARY KEY');
    expect(migrationContent).toContain('DEFAULT');
  });

  test('tasks table handles relationships correctly', () => {
    // Test that the table handles relationships correctly
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    // Check for proper foreign key relationships
    expect(migrationContent).toContain('user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE');
    expect(migrationContent).toContain('household_id UUID REFERENCES public.households(id) ON DELETE SET NULL');
  });

  test('tasks table includes proper defaults', () => {
    // Test that the table includes proper defaults
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    expect(migrationContent).toContain('completed BOOLEAN DEFAULT false');
    expect(migrationContent).toContain('tags TEXT[] DEFAULT \'{}\'');
    expect(migrationContent).toContain('source TEXT DEFAULT \'manual\'');
    expect(migrationContent).toContain('created_at TIMESTAMPTZ DEFAULT NOW()');
    expect(migrationContent).toContain('updated_at TIMESTAMPTZ DEFAULT NOW()');
  });

  test('tasks table handles data types correctly', () => {
    // Test that the table uses correct data types
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    // Check for appropriate data types
    expect(migrationContent).toContain('UUID PRIMARY KEY');
    expect(migrationContent).toContain('TEXT NOT NULL');
    expect(migrationContent).toContain('DATE');
    expect(migrationContent).toContain('TIME');
    expect(migrationContent).toContain('BOOLEAN');
    expect(migrationContent).toContain('TIMESTAMPTZ');
    expect(migrationContent).toContain('INTEGER');
    expect(migrationContent).toContain('TEXT[]');
    expect(migrationContent).toContain('JSONB');
  });

  test('tasks table migration file is well-formatted', () => {
    // Test that the migration file is properly formatted and readable
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    // Check that the file is not empty
    expect(migrationContent.length).toBeGreaterThan(100);
    
    // Check for proper line breaks and structure
    const lines = migrationContent.split('\n');
    expect(lines.length).toBeGreaterThan(10);
    
    // Check for proper SQL comments
    expect(migrationContent).toContain('-- Create tasks table migration');
    expect(migrationContent).toContain('-- Tasks can be personal or shared within a household');
  });

  test('tasks table supports household sharing', () => {
    // Test that the table supports household sharing
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    expect(migrationContent).toContain('household_id UUID REFERENCES public.households(id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_household_id_idx ON public.tasks(household_id)');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.tasks.household_id IS \'If set, task is shared with household members\'');
  });

  test('tasks table supports priority levels', () => {
    // Test that the table supports priority levels
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    expect(migrationContent).toContain('priority INTEGER CHECK (priority IN (1,2,3,4))');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_priority_idx ON public.tasks(priority)');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.tasks.priority IS \'1=Low, 2=Medium, 3=High, 4=Urgent\'');
  });

  test('tasks table supports tags', () => {
    // Test that the table supports tags
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    expect(migrationContent).toContain('tags TEXT[] DEFAULT \'{}\'');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_tags_gin_idx ON public.tasks USING gin(tags)');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.tasks.tags IS \'Array of custom tags for organization\'');
  });

  test('tasks table supports recurring patterns', () => {
    // Test that the table supports recurring patterns
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    expect(migrationContent).toContain('recurring_rule JSONB');
    expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION public.validate_recurring_rule()');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.tasks.recurring_rule IS \'JSON object defining recurring pattern (frequency, interval, etc.)\'');
  });

  test('tasks table supports multiple sources', () => {
    // Test that the table supports multiple sources
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    expect(migrationContent).toContain('source TEXT DEFAULT \'manual\' CHECK (source IN (\'manual\', \'calendar\', \'habit\', \'ai_suggested\'))');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_source_idx ON public.tasks(source)');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.tasks.source IS \'How the task was created: manual, calendar sync, habit, AI suggestion\'');
  });

  test('tasks table has comprehensive indexing strategy', () => {
    // Test that the table has a comprehensive indexing strategy
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    // Check for all expected indexes
    const expectedIndexes = [
      'tasks_user_id_idx',
      'tasks_user_due_date_idx',
      'tasks_household_id_idx',
      'tasks_completed_idx',
      'tasks_priority_idx',
      'tasks_tags_gin_idx',
      'tasks_source_idx',
      'tasks_created_at_idx'
    ];
    
    expectedIndexes.forEach(indexName => {
      expect(migrationContent).toContain(`CREATE INDEX IF NOT EXISTS ${indexName}`);
    });
  });

  test('tasks table has proper trigger functions', () => {
    // Test that the table has proper trigger functions
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION public.handle_task_completion()');
    expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION public.validate_recurring_rule()');
    expect(migrationContent).toContain('LANGUAGE plpgsql');
  });

  test('tasks table has proper trigger assignments', () => {
    // Test that the table has proper trigger assignments
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE TRIGGER update_tasks_updated_at');
    expect(migrationContent).toContain('CREATE TRIGGER on_task_completion_change');
    expect(migrationContent).toContain('CREATE TRIGGER validate_task_recurring_rule');
  });

  test('tasks table migration is production ready', () => {
    // Test that the migration is production ready
    const migrationContent = fs.readFileSync('supabase/migrations/003_create_tasks.sql', 'utf8');
    
    // Check for proper error handling
    expect(migrationContent).toContain('RAISE EXCEPTION');
    
    // Check for proper validation
    expect(migrationContent).toContain('CHECK');
    
    // Check for proper documentation
    expect(migrationContent).toContain('COMMENT ON');
    
    // Check for proper indexing
    expect(migrationContent).toContain('CREATE INDEX');
  });
});
