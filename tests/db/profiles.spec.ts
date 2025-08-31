import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

test.describe('Profiles Table Migration Tests', () => {
  test('profiles migration file exists', () => {
    // Test that the migration file exists
    expect(fs.existsSync('supabase/migrations/001_create_profiles.sql')).toBe(true);
  });

  test('profiles migration file has correct content', () => {
    // Test that the migration file contains the expected SQL
    const migrationContent = fs.readFileSync('supabase/migrations/001_create_profiles.sql', 'utf8');
    
    // Check for key table creation statements
    expect(migrationContent).toContain('CREATE TABLE IF NOT EXISTS public.profiles');
    expect(migrationContent).toContain('CREATE TABLE IF NOT EXISTS public.households');
    
    // Check for key columns
    expect(migrationContent).toContain('id UUID PRIMARY KEY REFERENCES auth.users(id)');
    expect(migrationContent).toContain('email TEXT UNIQUE NOT NULL');
    expect(migrationContent).toContain('full_name TEXT');
    expect(migrationContent).toContain('avatar_url TEXT');
    expect(migrationContent).toContain('household_id UUID REFERENCES public.households(id)');
    expect(migrationContent).toContain('privacy_mode BOOLEAN DEFAULT false');
    expect(migrationContent).toContain('local_mode BOOLEAN DEFAULT false');
    expect(migrationContent).toContain('timezone TEXT DEFAULT \'UTC\'');
    expect(migrationContent).toContain('created_at TIMESTAMPTZ DEFAULT NOW()');
    expect(migrationContent).toContain('updated_at TIMESTAMPTZ DEFAULT NOW()');
  });

  test('profiles migration includes households table', () => {
    // Test that households table is created
    const migrationContent = fs.readFileSync('supabase/migrations/001_create_profiles.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE TABLE IF NOT EXISTS public.households');
    expect(migrationContent).toContain('id UUID PRIMARY KEY DEFAULT gen_random_uuid()');
    expect(migrationContent).toContain('name TEXT NOT NULL');
    expect(migrationContent).toContain('owner_id UUID');
  });

  test('profiles migration includes foreign key constraints', () => {
    // Test that foreign key constraints are properly defined
    const migrationContent = fs.readFileSync('supabase/migrations/001_create_profiles.sql', 'utf8');
    
    expect(migrationContent).toContain('REFERENCES auth.users(id) ON DELETE CASCADE');
    expect(migrationContent).toContain('REFERENCES public.households(id)');
    expect(migrationContent).toContain('FOREIGN KEY (owner_id) REFERENCES public.profiles(id)');
  });

  test('profiles migration includes triggers', () => {
    // Test that updated_at triggers are created
    const migrationContent = fs.readFileSync('supabase/migrations/001_create_profiles.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION public.update_updated_at_column()');
    expect(migrationContent).toContain('CREATE TRIGGER update_profiles_updated_at');
    expect(migrationContent).toContain('CREATE TRIGGER update_households_updated_at');
  });

  test('profiles migration includes indexes', () => {
    // Test that performance indexes are created
    const migrationContent = fs.readFileSync('supabase/migrations/001_create_profiles.sql', 'utf8');
    
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS profiles_email_idx');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS profiles_household_id_idx');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS households_owner_id_idx');
  });

  test('profiles migration includes documentation comments', () => {
    // Test that documentation comments are included
    const migrationContent = fs.readFileSync('supabase/migrations/001_create_profiles.sql', 'utf8');
    
    expect(migrationContent).toContain('COMMENT ON TABLE public.profiles');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.profiles.privacy_mode');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.profiles.local_mode');
    expect(migrationContent).toContain('COMMENT ON COLUMN public.profiles.timezone');
    expect(migrationContent).toContain('COMMENT ON TABLE public.households');
  });

  test('profiles migration has correct table structure', () => {
    // Test that the table structure matches the architecture requirements
    const migrationContent = fs.readFileSync('supabase/migrations/001_create_profiles.sql', 'utf8');
    
    // Check for all required columns from the User type
    const requiredColumns = [
      'id UUID PRIMARY KEY',
      'email TEXT UNIQUE NOT NULL',
      'full_name TEXT',
      'avatar_url TEXT',
      'household_id UUID',
      'privacy_mode BOOLEAN',
      'local_mode BOOLEAN',
      'timezone TEXT',
      'created_at TIMESTAMPTZ',
      'updated_at TIMESTAMPTZ'
    ];
    
    for (const column of requiredColumns) {
      expect(migrationContent).toContain(column);
    }
  });

  test('profiles migration follows SQL best practices', () => {
    // Test that the migration follows SQL best practices
    const migrationContent = fs.readFileSync('supabase/migrations/001_create_profiles.sql', 'utf8');
    
    // Check for IF NOT EXISTS clauses
    expect(migrationContent).toContain('CREATE TABLE IF NOT EXISTS');
    expect(migrationContent).toContain('CREATE INDEX IF NOT EXISTS');
    
    // Check for proper data types
    expect(migrationContent).toContain('UUID');
    expect(migrationContent).toContain('TEXT');
    expect(migrationContent).toContain('BOOLEAN');
    expect(migrationContent).toContain('TIMESTAMPTZ');
    
    // Check for proper constraints
    expect(migrationContent).toContain('PRIMARY KEY');
    expect(migrationContent).toContain('UNIQUE');
    expect(migrationContent).toContain('DEFAULT');
  });

  test('profiles migration handles relationships correctly', () => {
    // Test that relationships between tables are properly defined
    const migrationContent = fs.readFileSync('supabase/migrations/001_create_profiles.sql', 'utf8');
    
    // Check for proper foreign key relationships
    expect(migrationContent).toContain('REFERENCES auth.users(id)');
    expect(migrationContent).toContain('REFERENCES public.households(id)');
    expect(migrationContent).toContain('REFERENCES public.profiles(id)');
    
    // Check for cascade delete
    expect(migrationContent).toContain('ON DELETE CASCADE');
  });

  test('profiles migration includes proper defaults', () => {
    // Test that appropriate default values are set
    const migrationContent = fs.readFileSync('supabase/migrations/001_create_profiles.sql', 'utf8');
    
    expect(migrationContent).toContain('privacy_mode BOOLEAN DEFAULT false');
    expect(migrationContent).toContain('local_mode BOOLEAN DEFAULT false');
    expect(migrationContent).toContain('timezone TEXT DEFAULT \'UTC\'');
    expect(migrationContent).toContain('created_at TIMESTAMPTZ DEFAULT NOW()');
    expect(migrationContent).toContain('updated_at TIMESTAMPTZ DEFAULT NOW()');
  });

  test('profiles migration file is well-formatted', () => {
    // Test that the migration file is properly formatted and readable
    const migrationContent = fs.readFileSync('supabase/migrations/001_create_profiles.sql', 'utf8');
    
    // Check for proper SQL formatting
    expect(migrationContent).toContain('-- Create profiles table migration');
    expect(migrationContent).toContain('-- This table extends Supabase auth.users');
    
    // Check that the file is not empty
    expect(migrationContent.length).toBeGreaterThan(100);
    
    // Check for proper line breaks and structure
    const lines = migrationContent.split('\n');
    expect(lines.length).toBeGreaterThan(20);
  });
});

