import { test, expect } from '@playwright/test';

test.describe('Example Tests', () => {
  test('Playwright is working correctly', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Verify the page loads
    await expect(page).toHaveTitle(/ClearDay/);
    
    // Check that we can interact with elements
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Your day, already sorted');
    
    // Test that we can click buttons
    const getStartedButton = page.getByRole('button', { name: 'Get Started Free' });
    await expect(getStartedButton).toBeVisible();
    await expect(getStartedButton).toBeEnabled();
  });

  test('Page has expected structure', async ({ page }) => {
    await page.goto('/');
    
    // Check main sections exist
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('.container')).toBeVisible();
    
    // Check that features section exists
    const featuresSection = page.locator('.grid');
    await expect(featuresSection).toBeVisible();
    
    // Verify we have the expected number of feature cards
    const featureCards = page.locator('.grid > div');
    await expect(featureCards).toHaveCount(3);
  });

  test('Navigation elements are accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check that all buttons are accessible
    const buttons = page.getByRole('button');
    await expect(buttons).toHaveCount(2); // Get Started Free and Learn More
    
    // Verify button text
    await expect(page.getByRole('button', { name: 'Get Started Free' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Learn More' })).toBeVisible();
  });
});
