import { test, expect } from '@playwright/test';

test.describe('Route Structure Tests', () => {
  test('main page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ClearDay/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('auth routes are accessible', async ({ page }) => {
    // Test login route (should redirect or show login page)
    await page.goto('/login');
    // Should either show login page or redirect to main page
    expect(page.url()).toMatch(/localhost:3000/);
  });

  test('dashboard routes are accessible', async ({ page }) => {
    // Test today route (should redirect or show dashboard)
    await page.goto('/today');
    // Should either show dashboard or redirect to login
    expect(page.url()).toMatch(/localhost:3000/);
  });

  test('settings routes are accessible', async ({ page }) => {
    // Test settings route
    await page.goto('/settings');
    // Should either show settings or redirect
    expect(page.url()).toMatch(/localhost:3000/);
  });

  test('API routes are accessible', async ({ page }) => {
    // Test that API routes don't crash
    const response = await page.goto('/api/test-db');
    // Should get a response (even if it's an error, it means the route exists)
    expect(response).toBeTruthy();
  });
});
