import { test, expect } from '@playwright/test';

test.describe('UI Theme Tests', () => {
  test('Tailwind utilities work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test that Tailwind classes are applied
    const mainElement = page.locator('main');
    await expect(mainElement).toHaveClass(/min-h-screen/);
    await expect(mainElement).toHaveClass(/bg-gradient-to-br/);
    
    // Test that CSS variables are loaded
    const computedStyles = await page.evaluate(() => {
      const root = document.documentElement;
      return {
        background: getComputedStyle(root).getPropertyValue('--background'),
        foreground: getComputedStyle(root).getPropertyValue('--foreground'),
        primary: getComputedStyle(root).getPropertyValue('--primary'),
        radius: getComputedStyle(root).getPropertyValue('--radius'),
      };
    });
    
    expect(computedStyles.background).toBeTruthy();
    expect(computedStyles.foreground).toBeTruthy();
    expect(computedStyles.primary).toBeTruthy();
    expect(computedStyles.radius).toBe('0.5rem');
  });

  test('shadcn/ui components render with proper styling', async ({ page }) => {
    await page.goto('/');
    
    // Test that Button components have proper styling
    const buttons = page.getByRole('button');
    await expect(buttons.first()).toBeVisible();
    
    // Check that buttons have the expected classes
    const buttonClasses = await buttons.first().getAttribute('class');
    expect(buttonClasses).toContain('inline-flex');
    expect(buttonClasses).toContain('items-center');
  });

  test('responsive design works', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopLayout = await page.locator('main .container').isVisible();
    expect(desktopLayout).toBe(true);
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileLayout = await page.locator('main .container').isVisible();
    expect(mobileLayout).toBe(true);
  });
});
