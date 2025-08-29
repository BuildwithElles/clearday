import { test, expect } from '@playwright/test';

test.describe('Landing Page Tests', () => {
  test('hero text displays correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check that the hero text is present
    const heroHeading = page.getByRole('heading', { level: 1 });
    await expect(heroHeading).toContainText('Your day, already sorted');
    
    // Check that the hero text has proper styling
    await expect(heroHeading).toHaveClass(/text-5xl/);
    await expect(heroHeading).toHaveClass(/md:text-7xl/);
    await expect(heroHeading).toHaveClass(/font-bold/);
  });

  test('sign up and login buttons are visible', async ({ page }) => {
    await page.goto('/');
    
    // Check that both buttons are present
    const getStartedButton = page.getByRole('button', { name: 'Get Started Free' });
    const learnMoreButton = page.getByRole('button', { name: 'Learn More' });
    
    await expect(getStartedButton).toBeVisible();
    await expect(learnMoreButton).toBeVisible();
    
    // Verify buttons are enabled
    await expect(getStartedButton).toBeEnabled();
    await expect(learnMoreButton).toBeEnabled();
  });

  test('landing page is responsive', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopHero = page.getByRole('heading', { level: 1 });
    await expect(desktopHero).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileHero = page.getByRole('heading', { level: 1 });
    await expect(mobileHero).toBeVisible();
    
    // Check that buttons stack on mobile
    const buttonContainer = page.locator('.flex.flex-col.sm\\:flex-row');
    await expect(buttonContainer).toBeVisible();
  });

  test('features section is present', async ({ page }) => {
    await page.goto('/');
    
    // Check that the features grid exists
    const featuresGrid = page.locator('.grid.md\\:grid-cols-3');
    await expect(featuresGrid).toBeVisible();
    
    // Check that all three feature cards are present
    const featureCards = page.locator('.grid.md\\:grid-cols-3 > div');
    await expect(featureCards).toHaveCount(3);
    
    // Verify feature titles
    await expect(page.getByText('AI-Powered Organization')).toBeVisible();
    await expect(page.getByText('Privacy First')).toBeVisible();
    await expect(page.getByText('Impact Tracking')).toBeVisible();
  });

  test('landing page has proper styling', async ({ page }) => {
    await page.goto('/');
    
    // Check that the main container has proper styling
    const mainElement = page.locator('main');
    await expect(mainElement).toHaveClass(/min-h-screen/);
    await expect(mainElement).toHaveClass(/bg-gradient-to-br/);
    
    // Check that the main content container has proper spacing
    const mainContainer = page.locator('main .container');
    await expect(mainContainer).toHaveClass(/mx-auto/);
    await expect(mainContainer).toHaveClass(/px-4/);
    await expect(mainContainer).toHaveClass(/py-16/);
  });

  test('landing page accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page has proper heading structure
    const h1 = page.getByRole('heading', { level: 1 });
    const h3s = page.getByRole('heading', { level: 3 });
    
    await expect(h1).toBeVisible();
    await expect(h3s).toHaveCount(3);
    
    // Check that buttons have proper labels
    const buttons = page.getByRole('button');
    await expect(buttons).toHaveCount(2);
    
    // Verify button text is accessible
    await expect(page.getByRole('button', { name: 'Get Started Free' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Learn More' })).toBeVisible();
  });

  test('header is present on landing page', async ({ page }) => {
    await page.goto('/');
    
    // Check that header is present
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check that logo and brand name are present
    await expect(page.getByText('ClearDay')).toBeVisible();
    
    // Check that auth buttons are present in header
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
  });
});
