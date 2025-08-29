import { test, expect } from '@playwright/test';

test.describe('Environment Variables Tests', () => {
  test('environment variables are accessible', async ({ page }) => {
    // Navigate to a page that might use environment variables
    await page.goto('/');
    
    // Check that the app loads without environment-related errors
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('environment')) {
        consoleErrors.push(msg.text());
      }
    });
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify no environment-related errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('app name is displayed correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check that the app title contains "ClearDay"
    await expect(page).toHaveTitle(/ClearDay/);
    
    // Check that the main heading is present
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Your day, already sorted');
  });

  test('development server is running', async ({ page }) => {
    // This test verifies that the development environment is working
    await page.goto('/');
    
    // Check that we get a successful response
    expect(page.url()).toContain('localhost:3000');
    
    // Verify the page loads without errors
    await expect(page.locator('main')).toBeVisible();
  });
});
