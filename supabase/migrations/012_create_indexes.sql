-- Create performance indexes for common queries
-- This migration adds strategic indexes to optimize query performance

-- Profiles table indexes
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_household_id_idx ON public.profiles(household_id);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at);

-- Tasks table indexes
CREATE INDEX IF NOT EXISTS tasks_user_id_due_date_idx ON public.tasks(user_id, due_date);
CREATE INDEX IF NOT EXISTS tasks_user_id_completed_idx ON public.tasks(user_id, completed);
CREATE INDEX IF NOT EXISTS tasks_user_id_priority_idx ON public.tasks(user_id, priority);
CREATE INDEX IF NOT EXISTS tasks_household_id_idx ON public.tasks(household_id) WHERE household_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS tasks_completed_idx ON public.tasks(completed);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS tasks_completed_at_idx ON public.tasks(completed_at) WHERE completed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON public.tasks(created_at);
CREATE INDEX IF NOT EXISTS tasks_updated_at_idx ON public.tasks(updated_at);

-- Events table indexes
CREATE INDEX IF NOT EXISTS events_user_id_start_time_idx ON public.events(user_id, start_time);
CREATE INDEX IF NOT EXISTS events_user_id_end_time_idx ON public.events(user_id, end_time);
CREATE INDEX IF NOT EXISTS events_start_time_idx ON public.events(start_time);
CREATE INDEX IF NOT EXISTS events_end_time_idx ON public.events(end_time);
CREATE INDEX IF NOT EXISTS events_all_day_idx ON public.events(all_day);
CREATE INDEX IF NOT EXISTS events_integration_id_idx ON public.events(integration_id) WHERE integration_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS events_created_at_idx ON public.events(created_at);
CREATE INDEX IF NOT EXISTS events_updated_at_idx ON public.events(updated_at);

-- Integrations table indexes
CREATE INDEX IF NOT EXISTS integrations_user_id_provider_idx ON public.integrations(user_id, provider);
CREATE INDEX IF NOT EXISTS integrations_provider_idx ON public.integrations(provider);
CREATE INDEX IF NOT EXISTS integrations_user_id_idx ON public.integrations(user_id);
CREATE INDEX IF NOT EXISTS integrations_created_at_idx ON public.integrations(created_at);
CREATE INDEX IF NOT EXISTS integrations_updated_at_idx ON public.integrations(updated_at);

-- Reminders table indexes
CREATE INDEX IF NOT EXISTS reminders_user_id_scheduled_time_idx ON public.reminders(user_id, scheduled_time);
CREATE INDEX IF NOT EXISTS reminders_user_id_type_idx ON public.reminders(user_id, type);
CREATE INDEX IF NOT EXISTS reminders_scheduled_time_idx ON public.reminders(scheduled_time);
CREATE INDEX IF NOT EXISTS reminders_type_idx ON public.reminders(type);
CREATE INDEX IF NOT EXISTS reminders_dismissed_idx ON public.reminders(dismissed);
CREATE INDEX IF NOT EXISTS reminders_task_id_idx ON public.reminders(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS reminders_event_id_idx ON public.reminders(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS reminders_type_idx ON public.reminders(type);
CREATE INDEX IF NOT EXISTS reminders_created_at_idx ON public.reminders(created_at);
CREATE INDEX IF NOT EXISTS reminders_updated_at_idx ON public.reminders(updated_at);

-- Nudges table indexes
CREATE INDEX IF NOT EXISTS nudges_user_id_type_idx ON public.nudges(user_id, type);
CREATE INDEX IF NOT EXISTS nudges_user_id_created_at_idx ON public.nudges(user_id, created_at);
CREATE INDEX IF NOT EXISTS nudges_type_idx ON public.nudges(type);
CREATE INDEX IF NOT EXISTS nudges_action_type_idx ON public.nudges(action_type);
CREATE INDEX IF NOT EXISTS nudges_expires_at_idx ON public.nudges(expires_at);
CREATE INDEX IF NOT EXISTS nudges_shown_at_idx ON public.nudges(shown_at) WHERE shown_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS nudges_acted_at_idx ON public.nudges(acted_at) WHERE acted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS nudges_created_at_idx ON public.nudges(created_at);

-- Habits table indexes (already created in previous migration, but adding additional ones)
CREATE INDEX IF NOT EXISTS habits_user_id_category_idx ON public.habits(user_id, category);
CREATE INDEX IF NOT EXISTS habits_user_id_created_at_idx ON public.habits(user_id, created_at);
CREATE INDEX IF NOT EXISTS habits_category_idx ON public.habits(category);
CREATE INDEX IF NOT EXISTS habits_frequency_idx ON public.habits(frequency);
CREATE INDEX IF NOT EXISTS habits_created_at_idx ON public.habits(created_at);
CREATE INDEX IF NOT EXISTS habits_updated_at_idx ON public.habits(updated_at);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS tasks_user_completed_due_date_idx ON public.tasks(user_id, completed, due_date);
CREATE INDEX IF NOT EXISTS events_user_start_end_idx ON public.events(user_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS reminders_user_scheduled_dismissed_idx ON public.reminders(user_id, scheduled_time, dismissed);
CREATE INDEX IF NOT EXISTS nudges_user_type_expires_idx ON public.nudges(user_id, type, expires_at);
CREATE INDEX IF NOT EXISTS habits_user_frequency_streak_idx ON public.habits(user_id, frequency, current_streak);

-- Partial indexes for active/current data
CREATE INDEX IF NOT EXISTS tasks_active_user_idx ON public.tasks(user_id, due_date) WHERE completed = false;
CREATE INDEX IF NOT EXISTS events_user_start_time_idx ON public.events(user_id, start_time);
CREATE INDEX IF NOT EXISTS reminders_pending_user_idx ON public.reminders(user_id, scheduled_time) WHERE dismissed = false;
CREATE INDEX IF NOT EXISTS nudges_user_created_idx ON public.nudges(user_id, created_at);
CREATE INDEX IF NOT EXISTS habits_active_user_idx ON public.habits(user_id, current_streak) WHERE current_streak > 0;

-- Text search indexes for search functionality
CREATE INDEX IF NOT EXISTS tasks_title_search_idx ON public.tasks USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS tasks_description_search_idx ON public.tasks USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS events_title_search_idx ON public.events USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS events_description_search_idx ON public.events USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS habits_name_search_idx ON public.habits USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS habits_description_search_idx ON public.habits USING gin(to_tsvector('english', description));

-- Add comments for documentation
COMMENT ON INDEX public.profiles_email_idx IS 'Index for email-based user lookups';
COMMENT ON INDEX public.tasks_user_id_due_date_idx IS 'Index for user tasks sorted by due date';
COMMENT ON INDEX public.events_user_id_start_time_idx IS 'Index for user events sorted by start time';
COMMENT ON INDEX public.reminders_user_id_scheduled_time_idx IS 'Index for user reminders sorted by scheduled time';
COMMENT ON INDEX public.nudges_user_id_type_idx IS 'Index for user nudges by type';
COMMENT ON INDEX public.habits_user_id_category_idx IS 'Index for user habits by category';

-- Performance monitoring views
CREATE OR REPLACE VIEW public.performance_metrics AS
SELECT
    schemaname,
    relname as tablename,
    indexrelname as indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

COMMENT ON VIEW public.performance_metrics IS 'View for monitoring index usage and performance metrics';