-- Additional performance indexes for ClearDay
-- These supplement the indexes already created in individual table migrations
-- Focus on query patterns from architecture.md and common application usage

-- Note: Many indexes were already created in previous migrations, 
-- this migration adds any additional indexes for performance optimization

-- Additional indexes for common query patterns

-- Composite index for user's upcoming tasks (Today screen)
CREATE INDEX IF NOT EXISTS tasks_user_upcoming_idx 
ON public.tasks(user_id, due_date, completed) 
WHERE completed = false AND due_date IS NOT NULL;

-- Index for overdue tasks
CREATE INDEX IF NOT EXISTS tasks_user_overdue_idx 
ON public.tasks(user_id, due_date, completed) 
WHERE completed = false AND due_date < CURRENT_DATE;

-- Index for today's events (frequently queried)
CREATE INDEX IF NOT EXISTS events_user_today_idx 
ON public.events(user_id, start_time) 
WHERE DATE(start_time) = CURRENT_DATE;

-- Index for this week's events
CREATE INDEX IF NOT EXISTS events_user_week_idx 
ON public.events(user_id, start_time) 
WHERE start_time >= DATE_TRUNC('week', CURRENT_DATE)
AND start_time < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week';

-- Index for household tasks (shared tasks query optimization)
CREATE INDEX IF NOT EXISTS tasks_household_active_idx 
ON public.tasks(household_id, completed, due_date) 
WHERE household_id IS NOT NULL AND completed = false;

-- Index for recently updated items (for sync operations)
CREATE INDEX IF NOT EXISTS tasks_recently_updated_idx 
ON public.tasks(user_id, updated_at) 
WHERE updated_at > (NOW() - INTERVAL '24 hours');

CREATE INDEX IF NOT EXISTS events_recently_updated_idx 
ON public.events(user_id, updated_at) 
WHERE updated_at > (NOW() - INTERVAL '24 hours');

-- Index for integration sync queries
CREATE INDEX IF NOT EXISTS events_integration_sync_idx 
ON public.events(integration_id, updated_at) 
WHERE integration_id IS NOT NULL;

-- Index for recurring tasks (for recurring rule processing)
CREATE INDEX IF NOT EXISTS tasks_recurring_idx 
ON public.tasks(recurring_rule) 
WHERE recurring_rule IS NOT NULL 
USING gin(recurring_rule);

-- Partial index for completed tasks with completion time
CREATE INDEX IF NOT EXISTS tasks_completed_with_time_idx 
ON public.tasks(user_id, completed_at) 
WHERE completed = true AND completed_at IS NOT NULL;

-- Index for event time conflicts (scheduling optimization)
CREATE INDEX IF NOT EXISTS events_time_conflict_idx 
ON public.events(user_id, start_time, end_time);

-- Index for all-day events
CREATE INDEX IF NOT EXISTS events_all_day_user_idx 
ON public.events(user_id, start_time) 
WHERE all_day = true;

-- Index for events with attendees (meeting queries)
CREATE INDEX IF NOT EXISTS events_with_attendees_idx 
ON public.events(user_id, start_time) 
WHERE jsonb_array_length(attendees) > 0;

-- Index for high priority tasks
CREATE INDEX IF NOT EXISTS tasks_high_priority_idx 
ON public.tasks(user_id, priority, due_date, completed) 
WHERE priority IN (3, 4) AND completed = false;

-- Index for tasks by source (for analytics)
CREATE INDEX IF NOT EXISTS tasks_source_analytics_idx 
ON public.tasks(user_id, source, created_at);

-- Index for tasks with tags (for filtering)
CREATE INDEX IF NOT EXISTS tasks_with_tags_idx 
ON public.tasks(user_id, tags) 
WHERE array_length(tags, 1) > 0 
USING gin(tags);

-- Index for integration token expiry (for refresh operations)
CREATE INDEX IF NOT EXISTS integrations_token_expiry_idx 
ON public.integrations(token_expiry) 
WHERE token_expiry IS NOT NULL AND sync_enabled = true;

-- Indexes for common profile queries
CREATE INDEX IF NOT EXISTS profiles_household_members_idx 
ON public.profiles(household_id) 
WHERE household_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS profiles_privacy_mode_idx 
ON public.profiles(privacy_mode) 
WHERE privacy_mode = true;

-- Covering indexes for frequent SELECT queries (include commonly selected columns)

-- Covering index for task list queries
CREATE INDEX IF NOT EXISTS tasks_list_covering_idx 
ON public.tasks(user_id, due_date, completed) 
INCLUDE (title, priority, tags, created_at);

-- Covering index for today's events
CREATE INDEX IF NOT EXISTS events_today_covering_idx 
ON public.events(user_id, start_time) 
INCLUDE (title, end_time, location, all_day)
WHERE DATE(start_time) = CURRENT_DATE;

-- Expression indexes for common date queries

-- Index for tasks due this week
CREATE INDEX IF NOT EXISTS tasks_due_this_week_idx 
ON public.tasks(user_id, completed)
WHERE due_date >= DATE_TRUNC('week', CURRENT_DATE)
AND due_date < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
AND completed = false;

-- Index for events this month
CREATE INDEX IF NOT EXISTS events_this_month_idx 
ON public.events(user_id)
WHERE start_time >= DATE_TRUNC('month', CURRENT_DATE)
AND start_time < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';

-- ANALYZE tables after creating indexes to update statistics
ANALYZE public.profiles;
ANALYZE public.households;
ANALYZE public.tasks;
ANALYZE public.events;
ANALYZE public.integrations;

-- Add comments for documentation
COMMENT ON INDEX tasks_user_upcoming_idx IS 'Optimizes queries for upcoming tasks in Today screen';
COMMENT ON INDEX events_user_today_idx IS 'Optimizes queries for todays events';
COMMENT ON INDEX tasks_household_active_idx IS 'Optimizes queries for active shared household tasks';
COMMENT ON INDEX tasks_list_covering_idx IS 'Covering index for task list queries with frequently selected columns';
COMMENT ON INDEX events_today_covering_idx IS 'Covering index for today events with frequently selected columns';
COMMENT ON INDEX integrations_token_expiry_idx IS 'Supports token refresh operations for calendar integrations';