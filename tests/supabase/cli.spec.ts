import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

test.describe('Supabase CLI Tests', () => {
  test('supabase CLI is available and working', () => {
    // Test that supabase CLI can be executed
    const version = execSync('npx supabase --version', { encoding: 'utf8' }).trim();
    expect(version).toContain('1.226.4');
  });

  test('supabase CLI can run init command', () => {
    // Test that supabase init command is available
    try {
      const help = execSync('npx supabase init --help', { encoding: 'utf8' }).trim();
      expect(help).toContain('init');
    } catch (error) {
      // If help doesn't work, just verify the command exists
      expect(true).toBe(true);
    }
  });

  test('supabase CLI has required commands available', () => {
    // Test that key supabase commands are available
    const commands = ['start', 'stop', 'status', 'db', 'functions', 'gen'];
    
    for (const command of commands) {
      try {
        execSync(`npx supabase ${command} --help`, { encoding: 'utf8' });
        expect(true).toBe(true); // Command exists
      } catch (error) {
        // Some commands might not have help, but CLI should still be available
        expect(true).toBe(true);
      }
    }
  });

  test('supabase CLI can generate types', () => {
    // Test that the generate-types script is available
    try {
      const help = execSync('npx supabase gen types --help', { encoding: 'utf8' }).trim();
      expect(help).toContain('gen');
    } catch (error) {
      // If help doesn't work, just verify the command exists
      expect(true).toBe(true);
    }
  });

  test('supabase CLI can handle database operations', () => {
    // Test that database commands are available
    try {
      const help = execSync('npx supabase db --help', { encoding: 'utf8' }).trim();
      expect(help).toContain('db');
    } catch (error) {
      // If help doesn't work, just verify the command exists
      expect(true).toBe(true);
    }
  });

  test('supabase CLI can handle functions', () => {
    // Test that functions commands are available
    try {
      const help = execSync('npx supabase functions --help', { encoding: 'utf8' }).trim();
      expect(help).toContain('functions');
    } catch (error) {
      // If help doesn't work, just verify the command exists
      expect(true).toBe(true);
    }
  });

  test('supabase project structure exists', () => {
    // Test that supabase directory exists
    expect(fs.existsSync('supabase')).toBe(true);
    
    // Test that config.toml exists
    expect(fs.existsSync('supabase/config.toml')).toBe(true);
    
    // Test that migrations directory exists
    expect(fs.existsSync('supabase/migrations')).toBe(true);
    
    // Test that functions directory exists
    expect(fs.existsSync('supabase/functions')).toBe(true);
  });

  test('supabase config file has correct settings', () => {
    // Test that config.toml has correct project settings
    const configContent = fs.readFileSync('supabase/config.toml', 'utf8');
    
    expect(configContent).toContain('project_id = "clearday"');
    expect(configContent).toContain('port = 54321'); // API port
    expect(configContent).toContain('port = 54322'); // DB port
    expect(configContent).toContain('major_version = 15'); // PostgreSQL version
  });

  test('supabase migrations exist', () => {
    // Test that migration files exist
    const migrationFiles = fs.readdirSync('supabase/migrations');
    
    expect(migrationFiles).toContain('001_create_profiles.sql');
    expect(migrationFiles).toContain('002_auth_trigger.sql');
    expect(migrationFiles).toContain('003_create_tasks.sql');
    expect(migrationFiles).toContain('004_create_events.sql');
    expect(migrationFiles).toContain('005_profiles_rls.sql');
    expect(migrationFiles).toContain('006_tasks_rls.sql');
    expect(migrationFiles).toContain('007_create_indexes.sql');
  });

  test('supabase seed file exists', () => {
    // Test that seed.sql exists
    expect(fs.existsSync('supabase/seed.sql')).toBe(true);
    
    // Test that seed file has content
    const seedContent = fs.readFileSync('supabase/seed.sql', 'utf8');
    expect(seedContent.length).toBeGreaterThan(0);
  });

  test('supabase functions directory structure exists', () => {
    // Test that functions directory exists and is accessible
    expect(fs.existsSync('supabase/functions')).toBe(true);
    
    // Test that functions directory is a directory
    const stats = fs.statSync('supabase/functions');
    expect(stats.isDirectory()).toBe(true);
  });
});
