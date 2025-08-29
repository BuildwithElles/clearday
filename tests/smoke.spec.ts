import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('app loads successfully', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Check that the page loads without errors
    await expect(page).toHaveTitle(/ClearDay/);
    
    // Verify the main hero text is present
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Your day, already sorted');
    
    // Check that the main navigation elements are present
    await expect(page.getByRole('button', { name: 'Get Started Free' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Learn More' })).toBeVisible();
    
    // Verify the page has the expected structure
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('body')).toHaveClass(/__className_/);
  });

  test('app is responsive', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    
    // Wait a moment for any async operations
    await page.waitForTimeout(1000);
    
    expect(consoleErrors).toHaveLength(0);
  });
});
