import { test, expect } from '@playwright/test';

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('displays settings page with proper title', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Settings');

    // Check page description
    await expect(page.locator('text=Manage your account settings')).toBeVisible();
  });

  test('shows tabs for different settings sections', async ({ page }) => {
    // Check that tabs are visible
    await expect(page.locator('button').filter({ hasText: 'Profile' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Privacy' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Notifications' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Appearance' })).toBeVisible();
  });

  test('displays profile section by default', async ({ page }) => {
    // Profile tab should be active by default
    await expect(page.locator('h2').filter({ hasText: 'Profile Information' })).toBeVisible();

    // Check profile section content
    await expect(page.locator('text=Update your profile information')).toBeVisible();
  });

  test('profile section shows form fields', async ({ page }) => {
    // Check for profile form elements
    await expect(page.locator('label').filter({ hasText: 'First Name' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Last Name' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Email' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Timezone' })).toBeVisible();

    // Check for avatar section
    await expect(page.locator('text=Change Photo')).toBeVisible();
  });

  test('privacy section is accessible via tabs', async ({ page }) => {
    // Click on Privacy tab
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    // Check privacy section content
    await expect(page.locator('h2').filter({ hasText: 'Privacy Settings' })).toBeVisible();
    await expect(page.locator('text=Control your privacy')).toBeVisible();
  });

  test('privacy section shows privacy controls', async ({ page }) => {
    // Navigate to privacy tab
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    // Check for privacy toggles
    await expect(page.locator('text=Local Mode')).toBeVisible();
    await expect(page.locator('text=Analytics')).toBeVisible();
    await expect(page.locator('text=Crash Reports')).toBeVisible();
  });

  test('notifications tab shows notification preferences', async ({ page }) => {
    // Navigate to notifications tab
    await page.locator('button').filter({ hasText: 'Notifications' }).click();

    // Check notifications section
    await expect(page.locator('h2').filter({ hasText: 'Notification Preferences' })).toBeVisible();
    await expect(page.locator('text=Choose how you want to be notified')).toBeVisible();
  });

  test('notifications section shows toggle options', async ({ page }) => {
    // Navigate to notifications tab
    await page.locator('button').filter({ hasText: 'Notifications' }).click();

    // Check notification toggles
    await expect(page.locator('text=Email Notifications')).toBeVisible();
    await expect(page.locator('text=Push Notifications')).toBeVisible();
    await expect(page.locator('text=Task Reminders')).toBeVisible();
  });

  test('appearance tab shows theme options', async ({ page }) => {
    // Navigate to appearance tab
    await page.locator('button').filter({ hasText: 'Appearance' }).click();

    // Check appearance section
    await expect(page.locator('h2').filter({ hasText: 'Appearance Settings' })).toBeVisible();
    await expect(page.locator('text=Customize the look')).toBeVisible();
  });

  test('appearance section shows theme buttons', async ({ page }) => {
    // Navigate to appearance tab
    await page.locator('button').filter({ hasText: 'Appearance' }).click();

    // Check theme options
    await expect(page.locator('button').filter({ hasText: 'Light' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Dark' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'System' })).toBeVisible();
  });

  test('tab switching works correctly', async ({ page }) => {
    // Start with profile tab
    await expect(page.locator('h2').filter({ hasText: 'Profile Information' })).toBeVisible();

    // Switch to privacy tab
    await page.locator('button').filter({ hasText: 'Privacy' }).click();
    await expect(page.locator('h2').filter({ hasText: 'Privacy Settings' })).toBeVisible();

    // Switch to notifications tab
    await page.locator('button').filter({ hasText: 'Notifications' }).click();
    await expect(page.locator('h2').filter({ hasText: 'Notification Preferences' })).toBeVisible();

    // Switch back to profile tab
    await page.locator('button').filter({ hasText: 'Profile' }).click();
    await expect(page.locator('h2').filter({ hasText: 'Profile Information' })).toBeVisible();
  });

  test('settings page is responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that main elements are still visible
    await expect(page.locator('h1')).toContainText('Settings');
    await expect(page.locator('button').filter({ hasText: 'Profile' })).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toContainText('Settings');

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toContainText('Settings');
  });

  test('save button is present in profile section', async ({ page }) => {
    // Check for save button in profile section
    await expect(page.locator('button').filter({ hasText: 'Save Changes' })).toBeVisible();
  });

  test('icons are displayed in tab navigation', async ({ page }) => {
    // Check that icons are present in tabs (using data attributes or classes)
    const profileTab = page.locator('button').filter({ hasText: 'Profile' });
    const privacyTab = page.locator('button').filter({ hasText: 'Privacy' });

    // Check for SVG icons within tabs
    await expect(profileTab.locator('svg')).toBeVisible();
    await expect(privacyTab.locator('svg')).toBeVisible();
  });

  test('page loads within reasonable time', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    await page.goto('/settings');
    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    // Verify content is loaded
    await expect(page.locator('h1')).toContainText('Settings');
  });
});
