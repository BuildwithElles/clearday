import { test, expect } from '@playwright/test';
import { existsSync } from 'fs';
import { join } from 'path';

test.describe('Folder Structure Tests', () => {
  test('main directories exist', () => {
    const requiredDirs = [
      'app',
      'components',
      'lib',
      'types',
      'tests',
      'public',
      'styles',
      'scripts',
      'supabase'
    ];

    requiredDirs.forEach(dir => {
      expect(existsSync(dir), `${dir} directory should exist`).toBe(true);
    });
  });

  test('app route directories exist', () => {
    const requiredAppDirs = [
      'app/(auth)',
      'app/(dashboard)',
      'app/actions',
      'app/api'
    ];

    requiredAppDirs.forEach(dir => {
      expect(existsSync(dir), `${dir} directory should exist`).toBe(true);
    });
  });

  test('auth route directories exist', () => {
    const requiredAuthDirs = [
      'app/(auth)/login',
      'app/(auth)/signup'
    ];

    requiredAuthDirs.forEach(dir => {
      expect(existsSync(dir), `${dir} directory should exist`).toBe(true);
    });
  });

  test('dashboard route directories exist', () => {
    const requiredDashboardDirs = [
      'app/(dashboard)/today',
      'app/(dashboard)/calendar',
      'app/(dashboard)/tasks',
      'app/(dashboard)/habits',
      'app/(dashboard)/progress',
      'app/(dashboard)/settings',
      'app/(dashboard)/settings/privacy',
      'app/(dashboard)/settings/integrations',
      'app/(dashboard)/settings/household'
    ];

    requiredDashboardDirs.forEach(dir => {
      expect(existsSync(dir), `${dir} directory should exist`).toBe(true);
    });
  });

  test('component directories exist', () => {
    const requiredComponentDirs = [
      'components/ui',
      'components/auth',
      'components/dashboard',
      'components/layouts',
      'components/nudges',
      'components/privacy'
    ];

    requiredComponentDirs.forEach(dir => {
      expect(existsSync(dir), `${dir} directory should exist`).toBe(true);
    });
  });

  test('lib directories exist', () => {
    const requiredLibDirs = [
      'lib/supabase',
      'lib/ai',
      'lib/hooks',
      'lib/stripe',
      'lib/utils'
    ];

    requiredLibDirs.forEach(dir => {
      expect(existsSync(dir), `${dir} directory should exist`).toBe(true);
    });
  });

  test('types files exist', () => {
    const requiredTypeFiles = [
      'types/index.ts',
      'types/database.ts'
    ];

    requiredTypeFiles.forEach(file => {
      expect(existsSync(file), `${file} should exist`).toBe(true);
    });
  });
});
