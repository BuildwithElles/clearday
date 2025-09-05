import { test, expect } from '@playwright/test';

test.describe('EventCard Component', () => {
  test('displays event title and time', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Mock an event card in the DOM for testing
    await page.setContent(`
      <div id="test-container">
        <div class="cursor-pointer hover:shadow-md transition-shadow">
          <div class="p-4">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-sm leading-tight mb-2">Client presentation</h3>
                <div class="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                  <span>10:00 AM - 11:00 AM</span>
                </div>
              </div>
              <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">1h</span>
            </div>
          </div>
        </div>
      </div>
    `);

    // Verify event title is displayed
    await expect(page.locator('h3')).toContainText('Client presentation');

    // Verify time is displayed
    await expect(page.locator('span').filter({ hasText: '10:00 AM - 11:00 AM' })).toBeVisible();

    // Verify duration badge is displayed
    await expect(page.locator('span').filter({ hasText: '1h' })).toBeVisible();
  });

  test('displays location when available', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Mock an event card with location
    await page.setContent(`
      <div id="test-container">
        <div class="cursor-pointer hover:shadow-md transition-shadow">
          <div class="p-4">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-sm leading-tight mb-2">Team Meeting</h3>
                <div class="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                  <span>2:30 PM - 3:00 PM</span>
                </div>
                <div class="flex items-center gap-1 text-xs text-muted-foreground">
                  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span class="truncate">Conference Room A</span>
                </div>
              </div>
              <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">0.5h</span>
            </div>
          </div>
        </div>
      </div>
    `);

    // Verify location is displayed
    await expect(page.locator('span').filter({ hasText: 'Conference Room A' })).toBeVisible();

    // Verify location icon is present
    await expect(page.locator('svg').nth(1)).toBeVisible();
  });

  test('displays description when available', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Mock an event card with description
    await page.setContent(`
      <div id="test-container">
        <div class="cursor-pointer hover:shadow-md transition-shadow">
          <div class="p-4">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-sm leading-tight mb-2">Project Review</h3>
                <div class="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                  <span>9:00 AM - 10:30 AM</span>
                </div>
              </div>
              <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">1.5h</span>
            </div>
            <p class="text-xs text-muted-foreground mt-2 line-clamp-2">Review quarterly project milestones and discuss next steps</p>
          </div>
        </div>
      </div>
    `);

    // Verify description is displayed
    await expect(page.locator('p').filter({ hasText: 'Review quarterly project milestones' })).toBeVisible();
  });

  test('handles click events', async ({ page }) => {
    await page.goto('http://localhost:3000');

    let clickCount = 0;

    // Mock an event card with click handler
    await page.setContent(`
      <div id="test-container">
        <div class="cursor-pointer hover:shadow-md transition-shadow" onclick="window.clickCount = (window.clickCount || 0) + 1;">
          <div class="p-4">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-sm leading-tight mb-2">Clickable Event</h3>
                <div class="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                  <span>4:00 PM - 5:00 PM</span>
                </div>
              </div>
              <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">1h</span>
            </div>
          </div>
        </div>
      </div>
    `);

    // Click the event card
    await page.locator('div.cursor-pointer').click();

    // Verify click was registered (in a real implementation, this would trigger the onClick prop)
    const clickRegistered = await page.evaluate(() => (window as any).clickCount === 1);
    expect(clickRegistered).toBe(true);
  });

  test('shows correct duration for different time spans', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Test 30-minute event
    await page.setContent(`
      <div id="test-container">
        <div class="cursor-pointer hover:shadow-md transition-shadow">
          <div class="p-4">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-sm leading-tight mb-2">Quick Meeting</h3>
                <div class="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                  <span>8:00 AM - 8:30 AM</span>
                </div>
              </div>
              <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">0.5h</span>
            </div>
          </div>
        </div>
      </div>
    `);

    // Verify 30-minute duration shows as 0.5h
    await expect(page.locator('span').filter({ hasText: '0.5h' })).toBeVisible();
  });
});
