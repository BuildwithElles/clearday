import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

test.describe('Auth Trigger Migration Tests', () => {
  test('auth trigger migration file exists', () => {
    // Test that the migration file exists
    expect(fs.existsSync('supabase/migrations/002_auth_trigger.sql')).toBe(true);
  });

  test('auth trigger migration file has correct content', () => {
    // Test that the migration file contains the expected SQL
    const migrationContent = fs.readFileSync('supabase/migrations/002_auth_trigger.sql', 'utf8');
    
    // Check for key function creation
    expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION public.handle_new_user()');
    expect(migrationContent).toContain('RETURNS TRIGGER AS');
    
    // Check for trigger creation
    expect(migrationContent).toContain('CREATE TRIGGER on_auth_user_created');
    expect(migrationContent).toContain('AFTER INSERT ON auth.users');
    expect(migrationContent).toContain('FOR EACH ROW');
    expect(migrationContent).toContain('EXECUTE FUNCTION public.handle_new_user()');
  });

  test('auth trigger function handles profile creation', () => {
    // Test that the function inserts profile data correctly
    const migrationContent = fs.readFileSync('supabase/migrations/002_auth_trigger.sql', 'utf8');
    
    expect(migrationContent).toContain('INSERT INTO public.profiles (id, email, full_name, avatar_url)');
    expect(migrationContent).toContain('NEW.id');
    expect(migrationContent).toContain('NEW.email');
    expect(migrationContent).toContain('COALESCE(NEW.raw_user_meta_data');
  });

  test('auth trigger function handles metadata extraction', () => {
    // Test that the function properly extracts user metadata
    const migrationContent = fs.readFileSync('supabase/migrations/002_auth_trigger.sql', 'utf8');
    
    expect(migrationContent).toContain('raw_user_meta_data->>\'full_name\'');
    expect(migrationContent).toContain('raw_user_meta_data->>\'name\'');
    expect(migrationContent).toContain('raw_user_meta_data->>\'avatar_url\'');
    expect(migrationContent).toContain('raw_user_meta_data->>\'picture\'');
  });

  test('auth trigger function has proper error handling', () => {
    // Test that the function handles errors gracefully
    const migrationContent = fs.readFileSync('supabase/migrations/002_auth_trigger.sql', 'utf8');
    
    expect(migrationContent).toContain('EXCEPTION');
    expect(migrationContent).toContain('WHEN unique_violation THEN');
    expect(migrationContent).toContain('WHEN OTHERS THEN');
    expect(migrationContent).toContain('RAISE WARNING');
    expect(migrationContent).toContain('RETURN NEW');
  });

  test('auth trigger function has correct security settings', () => {
    // Test that the function has proper security settings
    const migrationContent = fs.readFileSync('supabase/migrations/002_auth_trigger.sql', 'utf8');
    
    expect(migrationContent).toContain('SECURITY DEFINER');
    expect(migrationContent).toContain('LANGUAGE plpgsql');
  });

  test('auth trigger has proper permissions', () => {
    // Test that the function has proper permissions granted
    const migrationContent = fs.readFileSync('supabase/migrations/002_auth_trigger.sql', 'utf8');
    
    expect(migrationContent).toContain('GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated');
    expect(migrationContent).toContain('GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role');
  });

  test('auth trigger includes documentation', () => {
    // Test that the function and trigger have proper documentation
    const migrationContent = fs.readFileSync('supabase/migrations/002_auth_trigger.sql', 'utf8');
    
    expect(migrationContent).toContain('COMMENT ON FUNCTION public.handle_new_user()');
    expect(migrationContent).toContain('COMMENT ON TRIGGER on_auth_user_created');
    expect(migrationContent).toContain('Automatically creates a profile record');
    expect(migrationContent).toContain('Triggers profile creation after user signup');
  });

  test('auth trigger handles duplicate prevention', () => {
    // Test that the trigger prevents duplicate profiles
    const migrationContent = fs.readFileSync('supabase/migrations/002_auth_trigger.sql', 'utf8');
    
    expect(migrationContent).toContain('DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users');
    expect(migrationContent).toContain('unique_violation');
  });

  test('auth trigger function structure is correct', () => {
    // Test that the function has the correct structure
    const migrationContent = fs.readFileSync('supabase/migrations/002_auth_trigger.sql', 'utf8');
    
    // Check for proper function structure
    expect(migrationContent).toContain('BEGIN');
    expect(migrationContent).toContain('END;');
    expect(migrationContent).toContain('$$');
  });

  test('auth trigger function handles null metadata gracefully', () => {
    // Test that the function handles null metadata properly
    const migrationContent = fs.readFileSync('supabase/migrations/002_auth_trigger.sql', 'utf8');
    
    expect(migrationContent).toContain('COALESCE');
    expect(migrationContent).toContain('\'\''); // Empty string fallback
  });

  test('auth trigger function logs errors appropriately', () => {
    // Test that the function logs errors without failing
    const migrationContent = fs.readFileSync('supabase/migrations/002_auth_trigger.sql', 'utf8');
    
    expect(migrationContent).toContain('RAISE WARNING');
    expect(migrationContent).toContain('Failed to create profile for user');
    expect(migrationContent).toContain('SQLERRM');
  });

  test('auth trigger migration follows SQL best practices', () => {
    // Test that the migration follows SQL best practices
    const migrationContent = fs.readFileSync('supabase/migrations/002_auth_trigger.sql', 'utf8');
    
    // Check for proper SQL formatting
    expect(migrationContent).toContain('-- Auto-create profile when a new user signs up');
    expect(migrationContent).toContain('-- This trigger ensures every auth.users record');
    
    // Check for proper function definition
    expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION');
    expect(migrationContent).toContain('RETURNS TRIGGER');
  });

  test('auth trigger migration file is well-formatted', () => {
    // Test that the migration file is properly formatted and readable
    const migrationContent = fs.readFileSync('supabase/migrations/002_auth_trigger.sql', 'utf8');
    
    // Check that the file is not empty
    expect(migrationContent.length).toBeGreaterThan(100);
    
    // Check for proper line breaks and structure
    const lines = migrationContent.split('\n');
    expect(lines.length).toBeGreaterThan(10);
    
    // Check for proper SQL comments
    expect(migrationContent).toContain('-- Auto-create profile');
    expect(migrationContent).toContain('-- This trigger ensures');
  });

  test('auth trigger function integrates with profiles table', () => {
    // Test that the function properly integrates with the profiles table structure
    const migrationContent = fs.readFileSync('supabase/migrations/002_auth_trigger.sql', 'utf8');
    
    // Check that it inserts into the correct table with correct columns
    expect(migrationContent).toContain('INSERT INTO public.profiles');
    expect(migrationContent).toContain('(id, email, full_name, avatar_url)');
    
    // Check that it uses the correct values from auth.users
    expect(migrationContent).toContain('NEW.id');
    expect(migrationContent).toContain('NEW.email');
  });

  test('auth trigger function handles edge cases', () => {
    // Test that the function handles various edge cases
    const migrationContent = fs.readFileSync('supabase/migrations/002_auth_trigger.sql', 'utf8');
    
    // Check for COALESCE to handle null values
    expect(migrationContent).toContain('COALESCE');
    
    // Check for exception handling
    expect(migrationContent).toContain('EXCEPTION');
    expect(migrationContent).toContain('WHEN OTHERS THEN');
    
    // Check that it always returns NEW
    expect(migrationContent).toContain('RETURN NEW');
  });
});
