import { test, expect } from '@playwright/test';

test.describe('Base Layout Tests', () => {
  test('layout renders with proper metadata', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/ClearDay/);
    await expect(page).toHaveTitle(/Your day, already sorted/);
    
    // Check that the HTML lang attribute is set
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveAttribute('lang', 'en');
  });

  test('Inter font loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check that the body has the Inter font class
    const bodyElement = page.locator('body');
    const bodyClasses = await bodyElement.getAttribute('class');
    expect(bodyClasses).toContain('__className_'); // Next.js processed class name
    
    // Verify the font is applied by checking computed styles
    const fontFamily = await page.evaluate(() => {
      return getComputedStyle(document.body).fontFamily;
    });
    
    // Inter font should be in the font stack
    expect(fontFamily.toLowerCase()).toContain('inter');
  });

  test('dark mode CSS variables are available', async ({ page }) => {
    await page.goto('/');
    
    // Check that CSS variables are defined
    const cssVariables = await page.evaluate(() => {
      const root = document.documentElement;
      return {
        background: getComputedStyle(root).getPropertyValue('--background'),
        foreground: getComputedStyle(root).getPropertyValue('--foreground'),
        primary: getComputedStyle(root).getPropertyValue('--primary'),
        radius: getComputedStyle(root).getPropertyValue('--radius'),
      };
    });
    
    expect(cssVariables.background).toBeTruthy();
    expect(cssVariables.foreground).toBeTruthy();
    expect(cssVariables.primary).toBeTruthy();
    expect(cssVariables.radius).toBe('0.5rem');
  });

  test('layout structure is correct', async ({ page }) => {
    await page.goto('/');
    
    // Check that the basic HTML structure exists
    await expect(page.locator('html')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
    
    // Check that the main content area exists
    await expect(page.locator('main')).toBeVisible();
  });

  test('responsive layout works', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });
});
