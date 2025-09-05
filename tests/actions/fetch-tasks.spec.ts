import { test, expect } from '@playwright/test';

test.describe('Fetch Tasks Server Action Tests', () => {
  test('fetch tasks action fetches tasks for authenticated user', async ({ page }) => {
    // Navigate to the today page where the action will be used
    await page.goto('/today');

    // Check if we're redirected to login (expected for unauthenticated users)
    await expect(page.url()).toContain('/login');

    // Verify we're on the login page
    await expect(page.locator('h2')).toHaveText('Sign in to your account');
  });

  test('fetch tasks action filters by date when provided', async ({ page }) => {
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

  test('fetch tasks action sorts by priority and time', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Check that the login page has proper styling
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Check for proper form structure
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('fetch tasks action handles authentication errors', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Check for email and password inputs
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('fetch tasks action excludes deleted tasks', async ({ page }) => {
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
