import { test, expect } from '@playwright/test';

test.describe('Button Component Tests', () => {
  test('button renders with default styling', async ({ page }) => {
    await page.goto('/');
    
    // Check that buttons are visible and have proper styling
    const buttons = page.getByRole('button');
    await expect(buttons.first()).toBeVisible();
    
    // Check that buttons have the expected classes
    const buttonClasses = await buttons.first().getAttribute('class');
    expect(buttonClasses).toContain('inline-flex');
    expect(buttonClasses).toContain('items-center');
    expect(buttonClasses).toContain('justify-center');
    expect(buttonClasses).toContain('rounded-md');
  });

  test('button variants work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check that different button variants are present
    const getStartedButton = page.getByRole('button', { name: 'Get Started Free' });
    const learnMoreButton = page.getByRole('button', { name: 'Learn More' });
    
    await expect(getStartedButton).toBeVisible();
    await expect(learnMoreButton).toBeVisible();
    
    // Verify buttons are enabled and clickable
    await expect(getStartedButton).toBeEnabled();
    await expect(learnMoreButton).toBeEnabled();
  });

  test('button interactions work', async ({ page }) => {
    await page.goto('/');
    
    // Test that buttons can be focused
    const button = page.getByRole('button').first();
    await button.focus();
    
    // Verify focus state
    await expect(button).toBeFocused();
  });

  test('button accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Check that buttons have proper ARIA attributes
    const buttons = page.getByRole('button');
    await expect(buttons.first()).toBeVisible();
    
    // Verify buttons are accessible
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('button responsive design', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopButton = page.getByRole('button').first();
    await expect(desktopButton).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileButton = page.getByRole('button').first();
    await expect(mobileButton).toBeVisible();
  });
});
