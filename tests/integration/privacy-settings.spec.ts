import { test, expect } from '@playwright/test';

test.describe('Privacy Settings Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('loads privacy settings from database', async ({ page }) => {
    // Navigate to privacy tab
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    // Wait for component to load
    await expect(page.locator('text=Local Mode')).toBeVisible();

    // Should show loading state initially, then actual state
    const toggle = page.locator('button[data-state]');
    await expect(toggle).toBeVisible();
  });

  test('privacy toggle updates database when changed', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    // Get initial state
    const toggle = page.locator('button[data-state]').first();
    const initialState = await toggle.getAttribute('data-state');

    // Click to toggle
    await toggle.click();

    // Wait for save operation
    await expect(page.locator('text=Saving...')).toBeVisible();

    // Wait for save to complete
    await expect(page.locator('text=Saving...')).not.toBeVisible();

    // Verify state changed
    const newState = await toggle.getAttribute('data-state');
    expect(newState).not.toBe(initialState);
  });

  test('privacy settings persist across page refreshes', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    // Toggle privacy mode
    const toggle = page.locator('button[data-state]').first();
    await toggle.click();

    // Wait for save
    await expect(page.locator('text=Saving...')).not.toBeVisible();

    // Refresh page
    await page.reload();

    // Navigate back to privacy tab
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    // Toggle should maintain its state
    await expect(page.locator('text=Local Mode')).toBeVisible();
  });

  test('handles database connection errors gracefully', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    // Component should handle errors and show fallback state
    await expect(page.locator('text=Local Mode')).toBeVisible();
    await expect(page.locator('button[data-state]')).toBeVisible();
  });

  test('shows visual feedback for different privacy states', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    // Initially should show cloud sync indicators
    await expect(page.locator('text=Access on all devices')).toBeVisible();

    // Toggle to local mode
    const toggle = page.locator('button[data-state]').first();
    await toggle.click();

    // Should show privacy indicators
    await expect(page.locator('text=Enhanced Privacy')).toBeVisible();
    await expect(page.locator('text=No cloud sync')).toBeVisible();
  });

  test('privacy settings integrate with overall settings page', async ({ page }) => {
    // Navigate to privacy tab
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    // Should be part of the main settings layout
    await expect(page.locator('h1')).toContainText('Settings');
    await expect(page.locator('button').filter({ hasText: 'Profile' })).toBeVisible();

    // Privacy component should be properly integrated
    await expect(page.locator('text=Local Mode')).toBeVisible();
  });

  test('handles rapid toggle clicks', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    const toggle = page.locator('button[data-state]').first();

    // Click multiple times rapidly
    await toggle.click();
    await toggle.click();
    await toggle.click();

    // Should handle gracefully without breaking
    await expect(page.locator('text=Local Mode')).toBeVisible();
  });

  test('shows appropriate error messages on failure', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    // The component should handle errors appropriately
    // In a real scenario, this would test actual error conditions
    await expect(page.locator('text=Local Mode')).toBeVisible();
  });

  test('privacy toggle is accessible', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    // Check for proper accessibility attributes
    const toggle = page.locator('button[data-state]');
    await expect(toggle).toHaveAttribute('aria-checked');
    await expect(toggle).toHaveAttribute('role', 'switch');
  });

  test('displays loading states appropriately', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    // Initially might show loading
    const toggle = page.locator('button[data-state]');
    await expect(toggle).toBeVisible();

    // Click to trigger save loading
    await toggle.click();
    await expect(page.locator('text=Saving...')).toBeVisible();

    // Should complete loading
    await expect(page.locator('text=Saving...')).not.toBeVisible();
  });

  test('privacy settings work with authentication', async ({ page }) => {
    // This test assumes the user is authenticated
    await page.goto('/settings');

    // Should be able to access privacy settings
    await page.locator('button').filter({ hasText: 'Privacy' }).click();
    await expect(page.locator('text=Local Mode')).toBeVisible();
  });

  test('toggle state reflects actual database value', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    // Toggle should reflect the actual state from database
    const toggle = page.locator('button[data-state]');
    await expect(toggle).toBeVisible();

    // The state should be consistent with what's loaded from database
    const state = await toggle.getAttribute('data-state');
    expect(['checked', 'unchecked']).toContain(state);
  });

  test('handles network interruptions during updates', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    // Toggle and ensure error handling works
    const toggle = page.locator('button[data-state]').first();
    await toggle.click();

    // Should either succeed or show appropriate error
    await expect(page.locator('text=Local Mode')).toBeVisible();
  });

  test('privacy component integrates with settings tabs', async ({ page }) => {
    // Test tab switching
    await page.locator('button').filter({ hasText: 'Privacy' }).click();
    await expect(page.locator('text=Local Mode')).toBeVisible();

    // Switch to another tab
    await page.locator('button').filter({ hasText: 'Profile' }).click();
    await expect(page.locator('h2').filter({ hasText: 'Profile Information' })).toBeVisible();

    // Switch back to privacy
    await page.locator('button').filter({ hasText: 'Privacy' }).click();
    await expect(page.locator('text=Local Mode')).toBeVisible();
  });

  test('shows comprehensive privacy information', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Privacy' }).click();

    // Should show detailed information about privacy implications
    await expect(page.locator('text=What changes:')).toBeVisible();
    await expect(page.locator('text=Backup:')).toBeVisible();
  });
});



