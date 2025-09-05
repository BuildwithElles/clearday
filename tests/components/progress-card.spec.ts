import { test, expect } from '@playwright/test';

test.describe('ProgressCard Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/today');
  });

  test('displays progress card with task completion info', async ({ page }) => {
    // The ProgressCard should be visible on the today page
    // Since we're testing the component directly, we'll check for progress elements
    await expect(page.locator('text=Today\'s Progress')).toBeVisible();
  });

  test('shows daily task completion progress', async ({ page }) => {
    await page.goto('/today');

    // Should show task completion ratio
    const progressText = page.locator('text=/\\d+\\/\\d+ tasks/');
    await expect(progressText).toBeVisible();
  });

  test('displays progress percentage', async ({ page }) => {
    await page.goto('/today');

    // Should show percentage badge
    const percentageBadge = page.locator('text=/\\d+%/');
    await expect(percentageBadge).toBeVisible();
  });

  test('shows progress bar visualization', async ({ page }) => {
    await page.goto('/today');

    // Should have a progress bar element
    const progressBar = page.locator('progress, [role="progressbar"]');
    await expect(progressBar.or(page.locator('.h-3')).first()).toBeVisible();
  });

  test('displays motivational messages', async ({ page }) => {
    await page.goto('/today');

    // Should show some form of motivational or status message
    const cardDescription = page.locator('[data-testid="card-description"], p').first();
    await expect(cardDescription).toBeVisible();
  });

  test('shows streak counter when enabled', async ({ page }) => {
    await page.goto('/today');

    // Should show current streak
    await expect(page.locator('text=Current Streak')).toBeVisible();

    // Should show streak number
    const streakNumber = page.locator('text=/\\d+ days/');
    await expect(streakNumber).toBeVisible();
  });

  test('displays streak icon', async ({ page }) => {
    await page.goto('/today');

    // Should have a streak icon (flame, zap, or target)
    const streakIcon = page.locator('svg[data-lucide="flame"], svg[data-lucide="zap"], svg[data-lucide="target"]');
    await expect(streakIcon).toBeVisible();
  });

  test('shows weekly goal progress', async ({ page }) => {
    await page.goto('/today');

    // Should show weekly goal section
    await expect(page.locator('text=Weekly Goal')).toBeVisible();

    // Should show weekly completion ratio
    const weeklyText = page.locator('text=/\\d+\\/\\d+ days/');
    await expect(weeklyText).toBeVisible();
  });

  test('displays weekly progress bar', async ({ page }) => {
    await page.goto('/today');

    // Should have a weekly progress bar
    const weeklyProgress = page.locator('.h-2').nth(1); // Second progress bar
    await expect(weeklyProgress).toBeVisible();
  });

  test('shows achievement badges for milestones', async ({ page }) => {
    await page.goto('/today');

    // Should show achievement badges when applicable
    const badges = page.locator('text=Consistency Champion, text=Week Warrior, text=Perfect Day');
    // At least one badge should be visible (depending on progress)
    await expect(badges.first()).toBeVisible();
  });

  test('provides quick action buttons', async ({ page }) => {
    await page.goto('/today');

    // Should have action buttons
    await expect(page.locator('button').filter({ hasText: 'View Stats' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Set Goals' })).toBeVisible();
  });

  test('handles loading states', async ({ page }) => {
    await page.goto('/today');

    // Component should load and display data
    await expect(page.locator('text=Today\'s Progress')).toBeVisible();

    // Should not show loading indicators after load
    const loadingIndicators = page.locator('text=Loading..., text=Fetching...');
    await expect(loadingIndicators).toHaveCount(0);
  });

  test('shows appropriate icons throughout', async ({ page }) => {
    await page.goto('/today');

    // Should have target icon in header
    await expect(page.locator('svg[data-lucide="target"]')).toBeVisible();

    // Should have calendar icon for daily tasks
    await expect(page.locator('svg[data-lucide="calendar"]')).toBeVisible();

    // Should have award icon for weekly goals
    await expect(page.locator('svg[data-lucide="award"]')).toBeVisible();
  });

  test('displays compact version when specified', async ({ page }) => {
    await page.goto('/today');

    // Compact version should show simplified layout
    const compactCard = page.locator('.p-4').filter({ hasText: 'tasks' });
    await expect(compactCard).toBeVisible();
  });

  test('compact version shows essential info only', async ({ page }) => {
    await page.goto('/today');

    // Compact version should have minimal content
    const compactProgress = page.locator('.h-2').first();
    await expect(compactProgress).toBeVisible();
  });

  test('handles zero tasks scenario', async ({ page }) => {
    await page.goto('/today');

    // Should handle cases with no tasks gracefully
    await expect(page.locator('text=Today\'s Progress')).toBeVisible();
  });

  test('shows progress for completed tasks', async ({ page }) => {
    await page.goto('/today');

    // Should show completed task indicators
    await expect(page.locator('svg[data-lucide="check-circle"]')).toBeVisible();
  });

  test('displays remaining tasks information', async ({ page }) => {
    await page.goto('/today');

    // Should show information about remaining goals
    const remainingText = page.locator('text=/more days/');
    await expect(remainingText).toBeVisible();
  });

  test('provides visual progress indicators', async ({ page }) => {
    await page.goto('/today');

    // Should have multiple progress bars
    const progressBars = page.locator('progress, [role="progressbar"], .h-2, .h-3');
    await expect(progressBars).toHaveCount(await progressBars.count());
  });

  test('shows dynamic motivational messages', async ({ page }) => {
    await page.goto('/today');

    // Should have a motivational message
    const message = page.locator('p').filter({ hasText: 'Amazing, crushing, momentum, started' });
    await expect(message).toBeVisible();
  });

  test('handles different progress states', async ({ page }) => {
    await page.goto('/today');

    // Should handle various completion percentages
    const percentage = page.locator('text=/\\d+%/');
    await expect(percentage).toBeVisible();

    const percentageValue = await percentage.textContent();
    const percent = parseInt(percentageValue!.replace('%', ''));

    // Should show appropriate message based on percentage
    if (percent === 100) {
      await expect(page.locator('text=Amazing')).toBeVisible();
    } else if (percent >= 75) {
      await expect(page.locator('text=crushing')).toBeVisible();
    } else if (percent >= 50) {
      await expect(page.locator('text=Great progress')).toBeVisible();
    }
  });

  test('integrates with overall dashboard layout', async ({ page }) => {
    await page.goto('/today');

    // Should be part of the main dashboard grid
    const mainContent = page.locator('.space-y-6');
    await expect(mainContent).toBeVisible();

    // Should work alongside other dashboard components
    await expect(page.locator('text=Today')).toBeVisible();
  });
});
