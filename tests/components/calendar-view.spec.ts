import { test, expect } from '@playwright/test';

test.describe('Calendar View Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/today');
  });

  test('renders calendar structure and time slots', async ({ page }) => {
    // Should see the calendar title
    await expect(page.locator('text=Today\'s Schedule')).toBeVisible();
    
    // Should see time slots from 6 AM to 10 PM
    await expect(page.locator('text=6:00 AM')).toBeVisible();
    await expect(page.locator('text=8:00 AM')).toBeVisible();
    await expect(page.locator('text=12:00 PM')).toBeVisible();
    await expect(page.locator('text=6:00 PM')).toBeVisible();
    await expect(page.locator('text=10:00 PM')).toBeVisible();
    
    // Should not see times outside the range
    await expect(page.locator('text=5:00 AM')).not.toBeVisible();
    await expect(page.locator('text=11:00 PM')).not.toBeVisible();
  });

  test('shows placeholder events if no real events are passed', async ({ page }) => {
    // Should see sample event titles
    await expect(page.locator('text=Client presentation')).toBeVisible();
    await expect(page.locator('text=Lunch with team')).toBeVisible();
    
    // Should see event times
    await expect(page.locator('text=10:00 AM - 11:00 AM')).toBeVisible();
    await expect(page.locator('text=12:30 PM - 1:00 PM')).toBeVisible();
    
    // Should see event location for events that have it
    await expect(page.locator('text=Conference Room A')).toBeVisible();
  });

  test('shows Add Event button', async ({ page }) => {
    await expect(page.locator('button', { hasText: 'Add Event' })).toBeVisible();
    
    // Button should be clickable
    await expect(page.locator('button', { hasText: 'Add Event' })).toBeEnabled();
  });

  test('displays EventCard components with proper information', async ({ page }) => {
    // Check that EventCard components are rendered
    await expect(page.locator('h3').filter({ hasText: 'Client presentation' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Lunch with team' })).toBeVisible();

    // Should show event duration badges
    await expect(page.locator('text=1h')).toBeVisible();
    await expect(page.locator('text=0.5h')).toBeVisible();

    // Should show time information with clock icons
    await expect(page.locator('svg[data-lucide="clock"]')).toBeVisible();

    // Should show location with map pin icon for events that have location
    await expect(page.locator('text=Conference Room A')).toBeVisible();
    await expect(page.locator('svg[data-lucide="map-pin"]')).toBeVisible();
  });

  test('handles time slot interactions', async ({ page }) => {
    // Click on a time slot
    const timeSlot = page.locator('text=8:00 AM').locator('..');
    await timeSlot.click();
    
    // Should show visual feedback (background change)
    await expect(timeSlot).toHaveClass(/bg-muted/);
    
    // Click again to deselect
    await timeSlot.click();
    await expect(timeSlot).not.toHaveClass(/bg-muted/);
  });

  test('shows proper time formatting', async ({ page }) => {
    // Check AM/PM formatting
    await expect(page.locator('text=6:00 AM')).toBeVisible();
    await expect(page.locator('text=12:00 PM')).toBeVisible();
    await expect(page.locator('text=1:00 PM')).toBeVisible();
    await expect(page.locator('text=10:00 PM')).toBeVisible();
    
    // Check 12-hour format (no 0:00 AM, should be 12:00 AM)
    await expect(page.locator('text=0:00 AM')).not.toBeVisible();
  });

  test('displays empty time slots with dashed lines', async ({ page }) => {
    // Find an empty time slot (one without events)
    const emptySlot = page.locator('text=7:00 AM').locator('..');
    await expect(emptySlot).toBeVisible();
    
    // Should have dashed line indicator
    await expect(emptySlot.locator('.border-dashed')).toBeVisible();
  });

  test('shows calendar icon in header', async ({ page }) => {
    const header = page.locator('text=Today\'s Schedule').locator('..');
    await expect(header.locator('svg[data-lucide="calendar"]')).toBeVisible();
  });

  test('handles responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Calendar should still be visible and functional
    await expect(page.locator('text=Today\'s Schedule')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Add Event' })).toBeVisible();
    
    // Time slots should still be readable
    await expect(page.locator('text=8:00 AM')).toBeVisible();
  });

  test('shows event duration calculations', async ({ page }) => {
    // Check that duration badges are shown
    await expect(page.locator('text=1h')).toBeVisible(); // 1 hour event
    await expect(page.locator('text=0.5h')).toBeVisible(); // 30 minute event
  });

  test('EventCard components are clickable', async ({ page }) => {
    // EventCard components should be clickable
    const eventCard = page.locator('h3').filter({ hasText: 'Client presentation' }).locator('..').locator('..').locator('..');
    await expect(eventCard).toBeVisible();

    // Should have cursor pointer styling
    await expect(eventCard).toHaveClass(/cursor-pointer/);
  });
});
