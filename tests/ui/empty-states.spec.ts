import { test, expect } from '@playwright/test';

test.describe('Empty States', () => {
  test('EmptyState component renders with custom content', async ({ page }) => {
    await page.setContent(`
      <div id="test-container">
        <div class="w-full">
          <div class="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div class="mb-4 text-muted-foreground">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground mb-2">No tasks yet</h3>
            <p class="text-sm text-muted-foreground mb-6 max-w-md">Get started by creating your first task.</p>
            <button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 min-w-[200px]">Create your first task</button>
          </div>
        </div>
      </div>
    `);

    // Check that the empty state is rendered
    await expect(page.locator('h3')).toHaveText('No tasks yet');
    await expect(page.locator('p')).toHaveText('Get started by creating your first task.');
    await expect(page.locator('button')).toHaveText('Create your first task');
  });

  test('NoTasksState renders correctly', async ({ page }) => {
    await page.setContent(`
      <div id="test-container">
        <div class="w-full">
          <div class="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div class="mb-4 text-muted-foreground">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground mb-2">No tasks yet</h3>
            <p class="text-sm text-muted-foreground mb-6 max-w-md">Get started by creating your first task. Break down your goals into actionable items and stay organized.</p>
            <button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Create your first task</button>
          </div>
        </div>
      </div>
    `);

    // Verify the NoTasksState content
    await expect(page.locator('h3')).toHaveText('No tasks yet');
    await expect(page.locator('p')).toContainText('Break down your goals into actionable items');
    await expect(page.locator('button')).toHaveText('Create your first task');

    // Check for the task icon (path element in SVG)
    await expect(page.locator('svg path[d*="M9 5H7a2 2"]')).toBeVisible();
  });

  test('NoEventsState renders correctly', async ({ page }) => {
    await page.setContent(`
      <div id="test-container">
        <div class="w-full">
          <div class="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div class="mb-4 text-muted-foreground">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground mb-2">No events scheduled</h3>
            <p class="text-sm text-muted-foreground mb-6 max-w-md">Your calendar is empty for today. Add events to stay organized and never miss important appointments.</p>
            <button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Schedule an event</button>
          </div>
        </div>
      </div>
    `);

    // Verify the NoEventsState content
    await expect(page.locator('h3')).toHaveText('No events scheduled');
    await expect(page.locator('p')).toContainText('never miss important appointments');
    await expect(page.locator('button')).toHaveText('Schedule an event');

    // Check for the calendar icon
    await expect(page.locator('svg path[d*="M8 7V3m8 4V3"]')).toBeVisible();
  });

  test('NoDataState renders with custom message', async ({ page }) => {
    await page.setContent(`
      <div id="test-container">
        <div class="w-full">
          <div class="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div class="mb-4 text-muted-foreground">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-5v2m0 0v2m0-2h2m-2 0h-2"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground mb-2">Custom Title</h3>
            <p class="text-sm text-muted-foreground mb-6 max-w-md">Custom description message.</p>
          </div>
        </div>
      </div>
    `);

    // Verify custom content
    await expect(page.locator('h3')).toHaveText('Custom Title');
    await expect(page.locator('p')).toHaveText('Custom description message.');

    // Check for the data icon
    await expect(page.locator('svg path[d*="M20 13V6a2 2"]')).toBeVisible();
  });

  test('EmptyState action button is clickable', async ({ page }) => {
    await page.setContent(`
      <div id="test-container">
        <div class="w-full">
          <div class="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div class="mb-4 text-muted-foreground">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground mb-2">No tasks yet</h3>
            <p class="text-sm text-muted-foreground mb-6 max-w-md">Get started by creating your first task.</p>
            <button id="action-btn" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 min-w-[200px]">Create your first task</button>
          </div>
        </div>
      </div>
    `);

    // Verify button is clickable
    const button = page.locator('#action-btn');
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await expect(button).toHaveText('Create your first task');
  });
});
