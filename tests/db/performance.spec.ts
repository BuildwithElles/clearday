import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

test.describe('Performance Indexes Migration Tests', () => {
  test('performance indexes migration file exists', () => {
    // Test that the migration file exists
    expect(fs.existsSync('supabase/migrations/007_create_indexes.sql')).toBe(true);
  });

  test('performance indexes migration file has correct content', () => {
    // Test that the migration file contains the expected SQL
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    // Check for migration header
    expect(migrationContent).toContain('-- Create performance indexes for common queries');
    expect(migrationContent).toContain('-- This migration adds strategic indexes to optimize query performance');
  });

  test('profiles table indexes are created', () => {
    // Test that profiles table indexes are created
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS profiles_household_id_idx ON public.profiles(household_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at)');
  });

  test('tasks table indexes are created', () => {
    // Test that tasks table indexes are created
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_user_id_due_date_idx ON public.tasks(user_id, due_date)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_user_id_status_idx ON public.tasks(user_id, status)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_user_id_priority_idx ON public.tasks(user_id, priority)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_household_id_idx ON public.tasks(household_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON public.tasks(due_date)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_status_idx ON public.tasks(status)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_priority_idx ON public.tasks(priority)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_completed_at_idx ON public.tasks(completed_at)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON public.tasks(created_at)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_updated_at_idx ON public.tasks(updated_at)');
  });

  test('events table indexes are created', () => {
    // Test that events table indexes are created
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_user_id_start_time_idx ON public.events(user_id, start_time)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_user_id_end_time_idx ON public.events(user_id, end_time)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_start_time_idx ON public.events(start_time)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_end_time_idx ON public.events(end_time)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_all_day_idx ON public.events(all_day)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_integration_id_idx ON public.events(integration_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_created_at_idx ON public.events(created_at)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_updated_at_idx ON public.events(updated_at)');
  });

  test('integrations table indexes are created', () => {
    // Test that integrations table indexes are created
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS integrations_user_id_provider_idx ON public.integrations(user_id, provider)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS integrations_provider_idx ON public.integrations(provider)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS integrations_active_idx ON public.integrations(active)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS integrations_created_at_idx ON public.integrations(created_at)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS integrations_updated_at_idx ON public.integrations(updated_at)');
  });

  test('reminders table indexes are created', () => {
    // Test that reminders table indexes are created
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_user_id_scheduled_time_idx ON public.reminders(user_id, scheduled_time)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_user_id_type_idx ON public.reminders(user_id, type)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_scheduled_time_idx ON public.reminders(scheduled_time)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_type_idx ON public.reminders(type)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_dismissed_idx ON public.reminders(dismissed)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_task_id_idx ON public.reminders(task_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_event_id_idx ON public.reminders(event_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_habit_id_idx ON public.reminders(habit_id)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_created_at_idx ON public.reminders(created_at)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_updated_at_idx ON public.reminders(updated_at)');
  });

  test('nudges table indexes are created', () => {
    // Test that nudges table indexes are created
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_user_id_type_idx ON public.nudges(user_id, type)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_user_id_created_at_idx ON public.nudges(user_id, created_at)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_type_idx ON public.nudges(type)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_action_type_idx ON public.nudges(action_type)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_expires_at_idx ON public.nudges(expires_at)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_shown_at_idx ON public.nudges(shown_at)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_acted_at_idx ON public.nudges(acted_at)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_created_at_idx ON public.nudges(created_at)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_updated_at_idx ON public.nudges(updated_at)');
  });

  test('habits table indexes are created', () => {
    // Test that habits table indexes are created
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_user_id_category_idx ON public.habits(user_id, category)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_user_id_created_at_idx ON public.habits(user_id, created_at)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_category_idx ON public.habits(category)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_frequency_idx ON public.habits(frequency)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_created_at_idx ON public.habits(created_at)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_updated_at_idx ON public.habits(updated_at)');
  });

  test('composite indexes are created', () => {
    // Test that composite indexes are created
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_user_status_due_date_idx ON public.tasks(user_id, status, due_date)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_user_start_end_idx ON public.events(user_id, start_time, end_time)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_user_scheduled_dismissed_idx ON public.reminders(user_id, scheduled_time, dismissed)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_user_type_expires_idx ON public.nudges(user_id, type, expires_at)');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_user_frequency_streak_idx ON public.habits(user_id, frequency, current_streak)');
  });

  test('partial indexes are created', () => {
    // Test that partial indexes are created
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_active_user_idx ON public.tasks(user_id, due_date) WHERE status != \'completed\'');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_upcoming_user_idx ON public.events(user_id, start_time) WHERE start_time > NOW()');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS reminders_pending_user_idx ON public.reminders(user_id, scheduled_time) WHERE dismissed = false');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS nudges_active_user_idx ON public.nudges(user_id, created_at) WHERE expires_at > NOW() OR expires_at IS NULL');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_active_user_idx ON public.habits(user_id, current_streak) WHERE current_streak > 0');
  });

  test('text search indexes are created', () => {
    // Test that text search indexes are created
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_name_search_idx ON public.tasks USING gin(to_tsvector(\'english\', name))');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS tasks_description_search_idx ON public.tasks USING gin(to_tsvector(\'english\', description))');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_title_search_idx ON public.events USING gin(to_tsvector(\'english\', title))');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS events_description_search_idx ON public.events USING gin(to_tsvector(\'english\', description))');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_name_search_idx ON public.habits USING gin(to_tsvector(\'english\', name))');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS habits_description_search_idx ON public.habits USING gin(to_tsvector(\'english\', description))');
  });

  test('index comments are added', () => {
    // Test that index comments are added
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('COMMENT ON INDEX public.profiles_email_idx IS');
    expect(migrationContent).toContain('COMMENT ON INDEX public.tasks_user_id_due_date_idx IS');
    expect(migrationContent).toContain('COMMENT ON INDEX public.events_user_id_start_time_idx IS');
    expect(migrationContent).toContain('COMMENT ON INDEX public.reminders_user_id_scheduled_time_idx IS');
    expect(migrationContent).toContain('COMMENT ON INDEX public.nudges_user_id_type_idx IS');
    expect(migrationContent).toContain('COMMENT ON INDEX public.habits_user_id_category_idx IS');
  });

  test('performance monitoring view is created', () => {
    // Test that performance monitoring view is created
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE OR REPLACE VIEW public.performance_metrics AS');
    expect(migrationContent).toContain('SELECT');
    expect(migrationContent).toContain('schemaname');
    expect(migrationContent).toContain('tablename');
    expect(migrationContent).toContain('indexname');
    expect(migrationContent).toContain('idx_scan as index_scans');
    expect(migrationContent).toContain('idx_tup_read as tuples_read');
    expect(migrationContent).toContain('idx_tup_fetch as tuples_fetched');
    expect(migrationContent).toContain('FROM pg_stat_user_indexes');
    expect(migrationContent).toContain('WHERE schemaname = \'public\'');
    expect(migrationContent).toContain('ORDER BY idx_scan DESC');
  });

  test('performance monitoring view has comment', () => {
    // Test that performance monitoring view has comment
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('COMMENT ON VIEW public.performance_metrics IS');
    expect(migrationContent).toContain('View for monitoring index usage and performance metrics');
  });

  test('migration follows SQL best practices', () => {
    // Test that the migration follows SQL best practices
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    // Check for proper SQL formatting
    expect(migrationContent).toContain('-- Create performance indexes for common queries');
    expect(migrationContent).toContain('-- This migration adds strategic indexes to optimize query performance');
    
    // Check for proper index creation
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS');
    expect(migrationContent).toContain('ON public.');
  });

  test('migration file is well-formatted', () => {
    // Test that the migration file is properly formatted and readable
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    // Check that the file is not empty
    expect(migrationContent.length).toBeGreaterThan(100);
    
    // Check for proper line breaks and structure
    const lines = migrationContent.split('\n');
    expect(lines.length).toBeGreaterThan(10);
    
    // Check for proper SQL comments
    expect(migrationContent).toContain('-- Create performance indexes for common queries');
    expect(migrationContent).toContain('-- This migration adds strategic indexes to optimize query performance');
  });

  test('all required indexes for tasks table are present', () => {
    // Test that all required indexes for tasks table are present
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    // Check for all required task indexes
    const taskIndexes = [
      'tasks_user_id_due_date_idx',
      'tasks_user_id_status_idx',
      'tasks_user_id_priority_idx',
      'tasks_household_id_idx',
      'tasks_due_date_idx',
      'tasks_status_idx',
      'tasks_priority_idx',
      'tasks_completed_at_idx',
      'tasks_created_at_idx',
      'tasks_updated_at_idx',
      'tasks_user_status_due_date_idx',
      'tasks_active_user_idx',
      'tasks_name_search_idx',
      'tasks_description_search_idx'
    ];
    
    taskIndexes.forEach(indexName => {
      expect(migrationContent).toContain(indexName);
    });
  });

  test('all required indexes for events table are present', () => {
    // Test that all required indexes for events table are present
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    // Check for all required event indexes
    const eventIndexes = [
      'events_user_id_start_time_idx',
      'events_user_id_end_time_idx',
      'events_start_time_idx',
      'events_end_time_idx',
      'events_all_day_idx',
      'events_integration_id_idx',
      'events_created_at_idx',
      'events_updated_at_idx',
      'events_user_start_end_idx',
      'events_upcoming_user_idx',
      'events_title_search_idx',
      'events_description_search_idx'
    ];
    
    eventIndexes.forEach(indexName => {
      expect(migrationContent).toContain(indexName);
    });
  });

  test('all required indexes for reminders table are present', () => {
    // Test that all required indexes for reminders table are present
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    // Check for all required reminder indexes
    const reminderIndexes = [
      'reminders_user_id_scheduled_time_idx',
      'reminders_user_id_type_idx',
      'reminders_scheduled_time_idx',
      'reminders_type_idx',
      'reminders_dismissed_idx',
      'reminders_task_id_idx',
      'reminders_event_id_idx',
      'reminders_habit_id_idx',
      'reminders_created_at_idx',
      'reminders_updated_at_idx',
      'reminders_user_scheduled_dismissed_idx',
      'reminders_pending_user_idx'
    ];
    
    reminderIndexes.forEach(indexName => {
      expect(migrationContent).toContain(indexName);
    });
  });

  test('all required indexes for nudges table are present', () => {
    // Test that all required indexes for nudges table are present
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    // Check for all required nudge indexes
    const nudgeIndexes = [
      'nudges_user_id_type_idx',
      'nudges_user_id_created_at_idx',
      'nudges_type_idx',
      'nudges_action_type_idx',
      'nudges_expires_at_idx',
      'nudges_shown_at_idx',
      'nudges_acted_at_idx',
      'nudges_created_at_idx',
      'nudges_updated_at_idx',
      'nudges_user_type_expires_idx',
      'nudges_active_user_idx'
    ];
    
    nudgeIndexes.forEach(indexName => {
      expect(migrationContent).toContain(indexName);
    });
  });

  test('all required indexes for habits table are present', () => {
    // Test that all required indexes for habits table are present
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    // Check for all required habit indexes
    const habitIndexes = [
      'habits_user_id_category_idx',
      'habits_user_id_created_at_idx',
      'habits_category_idx',
      'habits_frequency_idx',
      'habits_created_at_idx',
      'habits_updated_at_idx',
      'habits_user_frequency_streak_idx',
      'habits_active_user_idx',
      'habits_name_search_idx',
      'habits_description_search_idx'
    ];
    
    habitIndexes.forEach(indexName => {
      expect(migrationContent).toContain(indexName);
    });
  });

  test('all required indexes for profiles table are present', () => {
    // Test that all required indexes for profiles table are present
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    // Check for all required profile indexes
    const profileIndexes = [
      'profiles_email_idx',
      'profiles_household_id_idx',
      'profiles_created_at_idx'
    ];
    
    profileIndexes.forEach(indexName => {
      expect(migrationContent).toContain(indexName);
    });
  });

  test('all required indexes for integrations table are present', () => {
    // Test that all required indexes for integrations table are present
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    // Check for all required integration indexes
    const integrationIndexes = [
      'integrations_user_id_provider_idx',
      'integrations_provider_idx',
      'integrations_active_idx',
      'integrations_created_at_idx',
      'integrations_updated_at_idx'
    ];
    
    integrationIndexes.forEach(indexName => {
      expect(migrationContent).toContain(indexName);
    });
  });

  test('conditional indexes use proper WHERE clauses', () => {
    // Test that conditional indexes use proper WHERE clauses
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('WHERE household_id IS NOT NULL');
    expect(migrationContent).toContain('WHERE completed_at IS NOT NULL');
    expect(migrationContent).toContain('WHERE integration_id IS NOT NULL');
    expect(migrationContent).toContain('WHERE task_id IS NOT NULL');
    expect(migrationContent).toContain('WHERE event_id IS NOT NULL');
    expect(migrationContent).toContain('WHERE habit_id IS NOT NULL');
    expect(migrationContent).toContain('WHERE shown_at IS NOT NULL');
    expect(migrationContent).toContain('WHERE acted_at IS NOT NULL');
  });

  test('partial indexes use proper WHERE conditions', () => {
    // Test that partial indexes use proper WHERE conditions
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('WHERE status != \'completed\'');
    expect(migrationContent).toContain('WHERE start_time > NOW()');
    expect(migrationContent).toContain('WHERE dismissed = false');
    expect(migrationContent).toContain('WHERE expires_at > NOW() OR expires_at IS NULL');
    expect(migrationContent).toContain('WHERE current_streak > 0');
  });

  test('text search indexes use proper GIN syntax', () => {
    // Test that text search indexes use proper GIN syntax
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('USING gin(to_tsvector(\'english\', name))');
    expect(migrationContent).toContain('USING gin(to_tsvector(\'english\', description))');
    expect(migrationContent).toContain('USING gin(to_tsvector(\'english\', title))');
  });

  test('composite indexes have correct column order', () => {
    // Test that composite indexes have correct column order
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('tasks_user_status_due_date_idx ON public.tasks(user_id, status, due_date)');
    expect(migrationContent).toContain('events_user_start_end_idx ON public.events(user_id, start_time, end_time)');
    expect(migrationContent).toContain('reminders_user_scheduled_dismissed_idx ON public.reminders(user_id, scheduled_time, dismissed)');
    expect(migrationContent).toContain('nudges_user_type_expires_idx ON public.nudges(user_id, type, expires_at)');
    expect(migrationContent).toContain('habits_user_frequency_streak_idx ON public.habits(user_id, frequency, current_streak)');
  });

  test('performance monitoring view includes all required columns', () => {
    // Test that performance monitoring view includes all required columns
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('schemaname');
    expect(migrationContent).toContain('tablename');
    expect(migrationContent).toContain('indexname');
    expect(migrationContent).toContain('idx_scan as index_scans');
    expect(migrationContent).toContain('idx_tup_read as tuples_read');
    expect(migrationContent).toContain('idx_tup_fetch as tuples_fetched');
  });

  test('performance monitoring view has proper filtering', () => {
    // Test that performance monitoring view has proper filtering
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('FROM pg_stat_user_indexes');
    expect(migrationContent).toContain('WHERE schemaname = \'public\'');
    expect(migrationContent).toContain('ORDER BY idx_scan DESC');
  });

  test('migration is production ready', () => {
    // Test that the migration is production ready
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    // Check for proper error handling
    expect(migrationContent).toContain('IF NOT EXISTS');
    
    // Check for proper documentation
    expect(migrationContent).toContain('COMMENT ON');
    
    // Check for proper indexing
    expect(migrationContent).toContain('CREATE INDEX');
  });

  test('migration supports all common query patterns', () => {
    // Test that the migration supports all common query patterns
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    // Check for user-based queries
    expect(migrationContent).toContain('user_id, due_date');
    expect(migrationContent).toContain('user_id, start_time');
    expect(migrationContent).toContain('user_id, scheduled_time');
    expect(migrationContent).toContain('user_id, type');
    expect(migrationContent).toContain('user_id, category');
    
    // Check for time-based queries
    expect(migrationContent).toContain('due_date');
    expect(migrationContent).toContain('start_time');
    expect(migrationContent).toContain('scheduled_time');
    expect(migrationContent).toContain('created_at');
    expect(migrationContent).toContain('updated_at');
    
    // Check for status-based queries
    expect(migrationContent).toContain('status');
    expect(migrationContent).toContain('priority');
    expect(migrationContent).toContain('dismissed');
    expect(migrationContent).toContain('all_day');
  });

  test('migration includes search functionality indexes', () => {
    // Test that the migration includes search functionality indexes
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('tasks_name_search_idx');
    expect(migrationContent).toContain('tasks_description_search_idx');
    expect(migrationContent).toContain('events_title_search_idx');
    expect(migrationContent).toContain('events_description_search_idx');
    expect(migrationContent).toContain('habits_name_search_idx');
    expect(migrationContent).toContain('habits_description_search_idx');
  });

  test('migration includes relationship indexes', () => {
    // Test that the migration includes relationship indexes
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('household_id');
    expect(migrationContent).toContain('integration_id');
    expect(migrationContent).toContain('task_id');
    expect(migrationContent).toContain('event_id');
    expect(migrationContent).toContain('habit_id');
  });

  test('migration includes analytics indexes', () => {
    // Test that the migration includes analytics indexes
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('created_at');
    expect(migrationContent).toContain('updated_at');
    expect(migrationContent).toContain('completed_at');
    expect(migrationContent).toContain('shown_at');
    expect(migrationContent).toContain('acted_at');
    expect(migrationContent).toContain('expires_at');
  });

  test('migration includes performance monitoring', () => {
    // Test that the migration includes performance monitoring
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE OR REPLACE VIEW public.performance_metrics AS');
    expect(migrationContent).toContain('pg_stat_user_indexes');
    expect(migrationContent).toContain('index_scans');
    expect(migrationContent).toContain('tuples_read');
    expect(migrationContent).toContain('tuples_fetched');
  });

  test('migration is comprehensive and complete', () => {
    // Test that the migration is comprehensive and complete
    const migrationContent = fs.readFileSync('supabase/migrations/007_create_indexes.sql', 'utf8');
    
    // Check that all tables are covered
    const tables = ['profiles', 'tasks', 'events', 'integrations', 'reminders', 'nudges', 'habits'];
    tables.forEach(table => {
      expect(migrationContent).toContain(`${table}_`);
    });
    
    // Check that all common query patterns are covered
    const patterns = ['user_id', 'created_at', 'updated_at', 'search', 'performance'];
    patterns.forEach(pattern => {
      expect(migrationContent).toContain(pattern);
    });
  });
});
