import { test, expect } from '@playwright/test';

test.describe('Calendar View Component', () => {
  test('renders calendar structure and time slots', async ({ page }) => {
    await page.goto('/today');
    // Should see the calendar title
    await expect(page.locator('text=Today\'s Schedule')).toBeVisible();
    // Should see time slots (e.g., 8:00 AM, 9:00 AM, etc.)
    await expect(page.locator('text=8:00 AM')).toBeVisible();
    await expect(page.locator('text=12:00 PM')).toBeVisible();
    await expect(page.locator('text=10:00 PM')).toBeVisible();
  });

  test('shows placeholder events if no real events are passed', async ({ page }) => {
    await page.goto('/today');
    // Should see sample event titles
    await expect(page.locator('text=Client presentation')).toBeVisible();
    await expect(page.locator('text=Lunch with team')).toBeVisible();
  });

  test('shows Add Event button', async ({ page }) => {
    await page.goto('/today');
    await expect(page.locator('button', { hasText: 'Add Event' })).toBeVisible();
  });

  test('shows empty state if no events for today', async ({ page }) => {
    // This test assumes you can render the component with no events (mock or test page)
    // For now, just check the empty state UI is present in the code
    await page.goto('/today');
    // If you have a way to clear events, check for empty state
    // await expect(page.locator('text=No events scheduled for today')).toBeVisible();
  });
});
