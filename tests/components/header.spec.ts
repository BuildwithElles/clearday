import { test, expect } from '@playwright/test';

test.describe('Header Component Tests', () => {
  test('header displays logo and brand name', async ({ page }) => {
    await page.goto('/');
    
    // Check that the logo is present
    const logo = page.locator('header .w-8.h-8');
    await expect(logo).toBeVisible();
    
    // Check that the brand name is present
    const brandName = page.getByText('ClearDay');
    await expect(brandName).toBeVisible();
    
    // Check that the logo and brand name are linked to home
    const logoLink = page.locator('header a[href="/"]');
    await expect(logoLink).toBeVisible();
  });

  test('navigation links are present on desktop', async ({ page }) => {
    await page.goto('/');
    
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Check that navigation links are visible
    await expect(page.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pricing' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  });

  test('navigation links are hidden on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that navigation links are hidden on mobile
    const nav = page.locator('nav');
    await expect(nav).toHaveClass(/hidden/);
    
    // Check that individual nav links are not visible
    await expect(page.getByRole('link', { name: 'Features' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Pricing' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).not.toBeVisible();
  });

  test('auth buttons are present', async ({ page }) => {
    await page.goto('/');
    
    // Check that both auth buttons are present
    const signInButton = page.getByRole('link', { name: 'Sign In' });
    const getStartedButton = page.getByRole('link', { name: 'Get Started' });
    
    await expect(signInButton).toBeVisible();
    await expect(getStartedButton).toBeVisible();
    
    // Check that buttons have correct href attributes
    await expect(signInButton).toHaveAttribute('href', '/login');
    await expect(getStartedButton).toHaveAttribute('href', '/signup');
  });

  test('header is sticky and has proper styling', async ({ page }) => {
    await page.goto('/');
    
    // Check that header has sticky positioning
    const header = page.locator('header');
    await expect(header).toHaveClass(/sticky/);
    await expect(header).toHaveClass(/top-0/);
    await expect(header).toHaveClass(/z-50/);
    
    // Check that header has backdrop blur
    await expect(header).toHaveClass(/backdrop-blur-sm/);
    await expect(header).toHaveClass(/bg-white/);
  });

  test('header layout is responsive', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop layout
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopHeader = page.locator('header');
    await expect(desktopHeader).toBeVisible();
    
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileHeader = page.locator('header');
    await expect(mobileHeader).toBeVisible();
    
    // Logo and auth buttons should always be visible
    await expect(page.getByText('ClearDay')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
  });
});
