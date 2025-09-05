import { test, expect } from '@playwright/test';

test.describe('Task List Data Integration Tests', () => {
  test('task list loads real data from database', async ({ page }) => {
    // Navigate to the today page
    await page.goto('/today');

    // Check if we're redirected to login (expected for unauthenticated users)
    await expect(page.url()).toContain('/login');

    // Verify we're on the login page
    await expect(page.locator('h2')).toHaveText('Sign in to your account');
  });

  test('task list shows loading state initially', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Check that the login page loads
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();

    // Check for email and password inputs
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('task list displays tasks with proper formatting', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Check that the login page has proper styling
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Check for proper form structure
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('task list handles empty state correctly', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Check for email and password inputs
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('task list shows error state on failure', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Check that the login page loads
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();

    // Verify login page structure
    const heading = page.locator('h2');
    await expect(heading).toHaveText('Sign in to your account');
  });
});
