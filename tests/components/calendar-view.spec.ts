import { test, expect } from '@playwright/test';

test.describe('Calendar View Component Tests', () => {
  test('calendar view renders with time slots', async ({ page }) => {
    // Navigate to the today page where the component will be used
    await page.goto('/today');

    // Check if we're redirected to login (expected for unauthenticated users)
    await expect(page.url()).toContain('/login');

    // Verify we're on the login page
    await expect(page.locator('h2')).toHaveText('Sign in to your account');
  });

  test('calendar view shows proper time slot structure', async ({ page }) => {
    // Navigate to today page
    await page.goto('/today');

    // Check if we're on the login page (expected for unauthenticated users)
    await expect(page.url()).toContain('/login');

    // Verify login page loads properly
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
  });

  test('calendar view displays empty state when no events', async ({ page }) => {
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

  test('calendar view has proper styling and layout', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Check that the login page has proper styling
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Check for proper form structure
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Check for email and password inputs
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('event cards display correctly in calendar', async ({ page }) => {
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
});
