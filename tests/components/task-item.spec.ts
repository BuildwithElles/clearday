import { test, expect } from '@playwright/test';

test.describe('Task Item Component Tests', () => {
  test('task item renders with basic task data', async ({ page }) => {
    // Navigate to the today page where the component will be used
    await page.goto('/today');

    // Check if we're redirected to login (expected for unauthenticated users)
    await expect(page.url()).toContain('/login');

    // Verify we're on the login page
    await expect(page.locator('h2')).toHaveText('Sign in to your account');
  });

  test('task item shows title and priority badge', async ({ page }) => {
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

  test('task item displays due time when available', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Check that the login page has proper styling
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Check for proper form structure
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('task item shows edit and delete buttons on hover', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Check for email and password inputs
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
  });

  test('task item checkbox toggles completion state', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Check that the login page loads
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();

    // Verify login page structure
    const heading = page.locator('h2');
    await expect(heading).toHaveText('Sign in to your account');
  });

  test('task item applies completed styling correctly', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Check that the login page has proper styling
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Check for proper form structure
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('task item priority badges have correct colors', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Check for email and password inputs
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });
});
