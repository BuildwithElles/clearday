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

                   SSUUMMMMAARRYY OOFF LLEESSSS CCOOMMMMAANNDDSS

      Commands marked with * may be preceded by a number, _N.
      Notes in parentheses indicate the behavior if _N is given.
      A key preceded by a caret indicates the Ctrl key; thus ^K is ctrl-K.

  h  H                 Display this help.
  q  :q  Q  :Q  ZZ     Exit.
 ---------------------------------------------------------------------------

                           MMOOVVIINNGG

  e  ^E  j  ^N  CR  *  Forward  one line   (or _N lines).
  y  ^Y  k  ^K  ^P  *  Backward one line   (or _N lines).
  ESC-j             *  Forward  one file line (or _N file lines).
  ESC-k             *  Backward one file line (or _N file lines).
  f  ^F  ^V  SPACE  *  Forward  one window (or _N lines).
  b  ^B  ESC-v      *  Backward one window (or _N lines).
  z                 *  Forward  one window (and set window to _N).
  w                 *  Backward one window (and set window to _N).
  ESC-SPACE         *  Forward  one window, but don't stop at end-of-file.
  ESC-b             *  Backward one window, but don't stop at beginning-of-file.
  d  ^D             *  Forward  one half-window (and set half-window to _N).
  u  ^U             *  Backward one half-window (and set half-window to _N).
  ESC-)  RightArrow *  Right one half screen width (or _N positions).
  ESC-(  LeftArrow  *  Left  one half screen width (or _N positions).
  ESC-}  ^RightArrow   Right to last column displayed.
  ESC-{  ^LeftArrow    Left  to first column.
  F                    Forward forever; like "tail -f".
  ESC-F                Like F but stop when search pattern is found.
  r  ^R  ^L            Repaint screen.
  R                    Repaint screen, discarding buffered input.
        ---------------------------------------------------
        Default "window" is the screen height.
        Default "half-window" is half of the screen height.
 ---------------------------------------------------------------------------

                          SSEEAARRCCHHIINNGG

  /_p_a_t_t_e_r_n          *  Search forward for (_N-th) matching line.
  ?_p_a_t_t_e_r_n          *  Search backward for (_N-th) matching line.
  n                 *  Repeat previous search (for _N-th occurrence).
  N                 *  Repeat previous search in reverse direction.
  ESC-n             *  Repeat previous search, spanning files.
  ESC-N             *  Repeat previous search, reverse dir. & spanning files.
  ^O^N  ^On         *  Search forward for (_N-th) OSC8 hyperlink.
  ^O^P  ^Op         *  Search backward for (_N-th) OSC8 hyperlink.
  ^O^L  ^Ol            Jump to the currently selected OSC8 hyperlink.
  ESC-u                Undo (toggle) search highlighting.
  ESC-U                Clear search highlighting.
  &_p_a_t_t_e_r_n          *  Display only matching lines.
        ---------------------------------------------------
		Search is case-sensitive unless changed with -i or -I.
        A search pattern may begin with one or more of:
        ^N or !  Search for NON-matching lines.
        ^E or *  Search multiple files (pass thru END OF FILE).
        ^F or @  Start search at FIRST file (for /) or last file (for ?).
        ^K       Highlight matches, but don't move (KEEP position).
        ^R       Don't use REGULAR EXPRESSIONS.
        ^S _n     Search for match in _n-th parenthesized subpattern.
        ^W       WRAP search if no match found.
        ^L       Enter next character literally into pattern.
 ---------------------------------------------------------------------------

                           JJUUMMPPIINNGG

  g  <  ESC-<       *  Go to first line in file (or line _N).
  G  >  ESC->       *  Go to last line in file (or line _N).
  p  %              *  Go to beginning of file (or _N percent into file).
  t                 *  Go to the (_N-th) next tag.
  T                 *  Go to the (_N-th) previous tag.
  {  (  [           *  Find close bracket } ) ].
  }  )  ]           *  Find open bracket { ( [.
  ESC-^F _<_c_1_> _<_c_2_>  *  Find close bracket _<_c_2_>.
  ESC-^B _<_c_1_> _<_c_2_>  *  Find open bracket _<_c_1_>.
        ---------------------------------------------------
        Each "find close bracket" command goes forward to the close bracket 
          matching the (_N-th) open bracket in the top line.
        Each "find open bracket" command goes backward to the open bracket 
          matching the (_N-th) close bracket in the bottom line.

  m_<_l_e_t_t_e_r_>            Mark the current top line with <letter>.
  M_<_l_e_t_t_e_r_>            Mark the current bottom line with <letter>.
  '_<_l_e_t_t_e_r_>            Go to a previously marked position.
  ''                   Go to the previous position.
  ^X^X                 Same as '.
  ESC-m_<_l_e_t_t_e_r_>        Clear a mark.
        ---------------------------------------------------
        A mark is any upper-case or lower-case letter.
        Certain marks are predefined:
             ^  means  beginning of the file
             $  means  end of the file
 ---------------------------------------------------------------------------

                        CCHHAANNGGIINNGG FFIILLEESS

  :e [_f_i_l_e]            Examine a new file.
  ^X^V                 Same as :e.
  :n                *  Examine the (_N-th) next file from the command line.
  :p                *  Examine the (_N-th) previous file from the command line.
  :x                *  Examine the first (or _N-th) file from the command line.
  ^O^O                 Open the currently selected OSC8 hyperlink.
  :d                   Delete the current file from the command line list.
  =  ^G  :f            Print current file name.
 ---------------------------------------------------------------------------

                    MMIISSCCEELLLLAANNEEOOUUSS CCOOMMMMAANNDDSS

  -_<_f_l_a_g_>              Toggle a command line option [see OPTIONS below].
  --_<_n_a_m_e_>             Toggle a command line option, by name.
  __<_f_l_a_g_>              Display the setting of a command line option.
  ___<_n_a_m_e_>             Display the setting of an option, by name.
  +_c_m_d                 Execute the less cmd each time a new file is examined.

  !_c_o_m_m_a_n_d             Execute the shell command with $SHELL.
  #_c_o_m_m_a_n_d             Execute the shell command, expanded like a prompt.
  |XX_c_o_m_m_a_n_d            Pipe file between current pos & mark XX to shell command.
  s _f_i_l_e               Save input to a file.
  v                    Edit the current file with $VISUAL or $EDITOR.
  V                    Print version number of "less".
 ---------------------------------------------------------------------------

                           OOPPTTIIOONNSS

        Most options may be changed either on the command line,
        or from within less by using the - or -- command.
        Options may be given in one of two forms: either a single
        character preceded by a -, or a name preceded by --.

  -?  ........  --help
                  Display help (from command line).
  -a  ........  --search-skip-screen
                  Search skips current screen.
  -A  ........  --SEARCH-SKIP-SCREEN
                  Search starts just after target line.
  -b [_N]  ....  --buffers=[_N]
                  Number of buffers.
  -B  ........  --auto-buffers
                  Don't automatically allocate buffers for pipes.
  -c  ........  --clear-screen
                  Repaint by clearing rather than scrolling.
  -d  ........  --dumb
                  Dumb terminal.
  -D xx_c_o_l_o_r  .  --color=xx_c_o_l_o_r
                  Set screen colors.
  -e  -E  ....  --quit-at-eof  --QUIT-AT-EOF
                  Quit at end of file.
  -f  ........  --force
                  Force open non-regular files.
  -F  ........  --quit-if-one-screen
                  Quit if entire file fits on first screen.
  -g  ........  --hilite-search
                  Highlight only last match for searches.
  -G  ........  --HILITE-SEARCH
                  Don't highlight any matches for searches.
  -h [_N]  ....  --max-back-scroll=[_N]
                  Backward scroll limit.
  -i  ........  --ignore-case
                  Ignore case in searches that do not contain uppercase.
  -I  ........  --IGNORE-CASE
                  Ignore case in all searches.
  -j [_N]  ....  --jump-target=[_N]
                  Screen position of target lines.
  -J  ........  --status-column
                  Display a status column at left edge of screen.
  -k _f_i_l_e  ...  --lesskey-file=_f_i_l_e
                  Use a compiled lesskey file.
  -K  ........  --quit-on-intr
                  Exit less in response to ctrl-C.
  -L  ........  --no-lessopen
                  Ignore the LESSOPEN environment variable.
  -m  -M  ....  --long-prompt  --LONG-PROMPT
                  Set prompt style.
  -n .........  --line-numbers
                  Suppress line numbers in prompts and messages.
  -N .........  --LINE-NUMBERS
                  Display line number at start of each line.
  -o [_f_i_l_e] ..  --log-file=[_f_i_l_e]
                  Copy to log file (standard input only).
  -O [_f_i_l_e] ..  --LOG-FILE=[_f_i_l_e]
                  Copy to log file (unconditionally overwrite).
  -p _p_a_t_t_e_r_n .  --pattern=[_p_a_t_t_e_r_n]
                  Start at pattern (from command line).
  -P [_p_r_o_m_p_t]   --prompt=[_p_r_o_m_p_t]
                  Define new prompt.
  -q  -Q  ....  --quiet  --QUIET  --silent --SILENT
                  Quiet the terminal bell.
  -r  -R  ....  --raw-control-chars  --RAW-CONTROL-CHARS
                  Output "raw" control characters.
  -s  ........  --squeeze-blank-lines
                  Squeeze multiple blank lines.
  -S  ........  --chop-long-lines
                  Chop (truncate) long lines rather than wrapping.
  -t _t_a_g  ....  --tag=[_t_a_g]
                  Find a tag.
  -T [_t_a_g_s_f_i_l_e] --tag-file=[_t_a_g_s_f_i_l_e]
                  Use an alternate tags file.
  -u  -U  ....  --underline-special  --UNDERLINE-SPECIAL
                  Change handling of backspaces, tabs and carriage returns.
  -V  ........  --version
                  Display the version number of "less".
  -w  ........  --hilite-unread
                  Highlight first new line after forward-screen.
  -W  ........  --HILITE-UNREAD
                  Highlight first new line after any forward movement.
  -x [_N[,...]]  --tabs=[_N[,...]]
                  Set tab stops.
  -X  ........  --no-init
                  Don't use termcap init/deinit strings.
  -y [_N]  ....  --max-forw-scroll=[_N]
                  Forward scroll limit.
  -z [_N]  ....  --window=[_N]
                  Set size of window.
  -" [_c[_c]]  .  --quotes=[_c[_c]]
                  Set shell quote characters.
  -~  ........  --tilde
                  Don't display tildes after end of file.
  -# [_N]  ....  --shift=[_N]
                  Set horizontal scroll amount (0 = one half screen width).

                --exit-follow-on-close
                  Exit F command on a pipe when writer closes pipe.
                --file-size
                  Automatically determine the size of the input file.
                --follow-name
                  The F command changes files if the input file is renamed.
                --form-feed
                  Stop scrolling when a form feed character is reached.
                --header=[_L[,_C[,_N]]]
                  Use _L lines (starting at line _N) and _C columns as headers.
                --incsearch
                  Search file as each pattern character is typed in.
                --intr=[_C]
                  Use _C instead of ^X to interrupt a read.
                --lesskey-context=_t_e_x_t
                  Use lesskey source file contents.
                --lesskey-src=_f_i_l_e
                  Use a lesskey source file.
                --line-num-width=[_N]
                  Set the width of the -N line number field to _N characters.
                --match-shift=[_N]
                  Show at least _N characters to the left of a search match.
                --modelines=[_N]
                  Read _N lines from the input file and look for vim modelines.
                --mouse
                  Enable mouse input.
                --no-edit-warn
                  Don't warn when using v command on a file opened via LESSOPEN.
                --no-keypad
                  Don't send termcap keypad init/deinit strings.
                --no-histdups
                  Remove duplicates from command history.
                --no-number-headers
                  Don't give line numbers to header lines.
                --no-paste
                  Ignore pasted input.
                --no-search-header-lines
                  Searches do not include header lines.
                --no-search-header-columns
                  Searches do not include header columns.
                --no-search-headers
                  Searches do not include header lines or columns.
                --no-vbell
                  Disable the terminal's visual bell.
                --redraw-on-quit
                  Redraw final screen when quitting.
                --rscroll=[_C]
                  Set the character used to mark truncated lines.
                --save-marks
                  Retain marks across invocations of less.
                --search-options=[EFKNRW-]
                  Set default options for every search.
                --show-preproc-errors
                  Display a message if preprocessor exits with an error status.
                --proc-backspace
                  Process backspaces for bold/underline.
                --PROC-BACKSPACE
                  Treat backspaces as control characters.
                --proc-return
                  Delete carriage returns before newline.
                --PROC-RETURN
                  Treat carriage returns as control characters.
                --proc-tab
                  Expand tabs to spaces.
                --PROC-TAB
                  Treat tabs as control characters.
                --status-col-width=[_N]
                  Set the width of the -J status column to _N characters.
                --status-line
                  Highlight or color the entire line containing a mark.
                --use-backslash
                  Subsequent options use backslash as escape char.
                --use-color
                  Enables colored text.
                --wheel-lines=[_N]
                  Each click of the mouse wheel moves _N lines.
                --wordwrap
                  Wrap lines at spaces.


 ---------------------------------------------------------------------------

                          LLIINNEE EEDDIITTIINNGG

        These keys can be used to edit text being entered 
        on the "command line" at the bottom of the screen.

 RightArrow ..................... ESC-l ... Move cursor right one character.
 LeftArrow ...................... ESC-h ... Move cursor left one character.
 ctrl-RightArrow  ESC-RightArrow  ESC-w ... Move cursor right one word.
 ctrl-LeftArrow   ESC-LeftArrow   ESC-b ... Move cursor left one word.
 HOME ........................... ESC-0 ... Move cursor to start of line.
 END ............................ ESC-$ ... Move cursor to end of line.
 BACKSPACE ................................ Delete char to left of cursor.
 DELETE ......................... ESC-x ... Delete char under cursor.
 ctrl-BACKSPACE   ESC-BACKSPACE ........... Delete word to left of cursor.
 ctrl-DELETE .... ESC-DELETE .... ESC-X ... Delete word under cursor.
 ctrl-U ......... ESC (MS-DOS only) ....... Delete entire line.
 UpArrow ........................ ESC-k ... Retrieve previous command line.
 DownArrow ...................... ESC-j ... Retrieve next command line.
 TAB ...................................... Complete filename & cycle.
 SHIFT-TAB ...................... ESC-TAB   Complete filename & reverse cycle.
 ctrl-L ................................... Complete filename, list all.
