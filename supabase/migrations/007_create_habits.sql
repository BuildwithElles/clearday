-- Create habits table migration
-- Habits are recurring behaviors that users want to track and build

CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (LENGTH(name) > 0),
    description TEXT,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    target_count INTEGER DEFAULT 1 CHECK (target_count > 0),
    current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
    longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
    auto_rules JSONB DEFAULT '{}',
    reminder_time TIME,
    category TEXT,
    impact_per_completion DECIMAL(10,3) CHECK (impact_per_completion >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at trigger
CREATE TRIGGER update_habits_updated_at
    BEFORE UPDATE ON public.habits
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add validation trigger for habit data
CREATE OR REPLACE FUNCTION public.validate_habit_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure name is not empty
    IF LENGTH(NEW.name) = 0 THEN
        RAISE EXCEPTION 'Habit name cannot be empty';
    END IF;
    
    -- Validate target_count is positive
    IF NEW.target_count <= 0 THEN
        RAISE EXCEPTION 'target_count must be positive';
    END IF;
    
    -- Validate streaks are non-negative
    IF NEW.current_streak < 0 THEN
        RAISE EXCEPTION 'current_streak cannot be negative';
    END IF;
    
    IF NEW.longest_streak < 0 THEN
        RAISE EXCEPTION 'longest_streak cannot be negative';
    END IF;
    
    -- Validate longest_streak is not less than current_streak
    IF NEW.longest_streak < NEW.current_streak THEN
        NEW.longest_streak = NEW.current_streak;
    END IF;
    
    -- Validate impact_per_completion is non-negative if provided
    IF NEW.impact_per_completion IS NOT NULL AND NEW.impact_per_completion < 0 THEN
        RAISE EXCEPTION 'impact_per_completion must be non-negative';
    END IF;
    
    -- Validate auto_rules is valid JSONB if provided
    IF NEW.auto_rules IS NOT NULL AND NEW.auto_rules = 'null'::jsonb THEN
        RAISE EXCEPTION 'auto_rules cannot be null JSONB';
    END IF;
    
    -- Validate reminder_time format if provided
    IF NEW.reminder_time IS NOT NULL THEN
        -- TIME format validation is handled by PostgreSQL
        -- Additional validation can be added here if needed
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_habit_data_trigger
    BEFORE INSERT OR UPDATE ON public.habits
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_habit_data();

-- Add trigger to automatically update longest_streak when current_streak increases
CREATE OR REPLACE FUNCTION public.handle_habit_streak_update()
RETURNS TRIGGER AS $$
BEGIN
    -- If current_streak is greater than longest_streak, update longest_streak
    IF NEW.current_streak > NEW.longest_streak THEN
        NEW.longest_streak = NEW.current_streak;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_habit_streak_update
    BEFORE UPDATE ON public.habits
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_habit_streak_update();

-- Performance indexes
CREATE INDEX IF NOT EXISTS habits_user_id_idx ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS habits_user_frequency_idx ON public.habits(user_id, frequency);
CREATE INDEX IF NOT EXISTS habits_frequency_idx ON public.habits(frequency);
CREATE INDEX IF NOT EXISTS habits_category_idx ON public.habits(category) WHERE category IS NOT NULL;
CREATE INDEX IF NOT EXISTS habits_reminder_time_idx ON public.habits(reminder_time) WHERE reminder_time IS NOT NULL;
CREATE INDEX IF NOT EXISTS habits_current_streak_idx ON public.habits(current_streak);
CREATE INDEX IF NOT EXISTS habits_longest_streak_idx ON public.habits(longest_streak);
CREATE INDEX IF NOT EXISTS habits_impact_idx ON public.habits(impact_per_completion) WHERE impact_per_completion IS NOT NULL;
CREATE INDEX IF NOT EXISTS habits_active_idx ON public.habits(created_at) WHERE current_streak > 0;

-- Add comments for documentation
COMMENT ON TABLE public.habits IS 'User habits for tracking recurring behaviors and building sustainable practices';
COMMENT ON COLUMN public.habits.name IS 'Name of the habit (e.g., "Morning Exercise", "Read 30 minutes")';
COMMENT ON COLUMN public.habits.description IS 'Optional description of the habit';
COMMENT ON COLUMN public.habits.frequency IS 'How often the habit should be performed: daily, weekly, or monthly';
COMMENT ON COLUMN public.habits.target_count IS 'Number of times the habit should be completed per frequency period';
COMMENT ON COLUMN public.habits.current_streak IS 'Current consecutive streak of completed habit periods';
COMMENT ON COLUMN public.habits.longest_streak IS 'Longest consecutive streak achieved (auto-updated)';
COMMENT ON COLUMN public.habits.auto_rules IS 'JSON rules for automatic habit detection and completion';
COMMENT ON COLUMN public.habits.reminder_time IS 'Time of day to send reminders for this habit';
COMMENT ON COLUMN public.habits.category IS 'Category of the habit (e.g., "health", "productivity", "eco")';
COMMENT ON COLUMN public.habits.impact_per_completion IS 'CO2 impact in kilograms per habit completion';

