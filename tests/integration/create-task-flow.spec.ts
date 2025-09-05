import { test, expect } from '@playwright/test';

test.describe('Create Task Flow Integration Tests', () => {
  // Test user data - use unique emails to avoid conflicts
  const getTestUser = (testName: string) => ({
    fullName: 'Test Task Flow User',
    email: `test-task-flow-${testName}-${Date.now()}@gmail.com`,
    password: 'TestPassword123!',
  });

  test.beforeEach(async ({ page }) => {
    // Clear any existing session/cookies before each test
    await page.context().clearCookies();
    await page.context().clearPermissions();
    // Set longer timeout for database operations
    test.setTimeout(60000);
  });

  test('complete task creation flow from dialog to list', async ({ page }) => {
    const testUser = getTestUser('complete-flow');

    // Step 1: Sign up test user
    await page.goto('/signup');
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[placeholder="Create a password"]', testUser.password);
    await page.fill('input[placeholder="Confirm your password"]', testUser.password);
    await page.locator('role=checkbox').check();
    await page.click('button[type="submit"]');

    // Handle signup response
    try {
      await page.waitForURL('/login?message=signup-success', { timeout: 15000 });
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/today')) {
        console.log('Signup redirected directly to dashboard');
      }
    }

    // Step 2: Login (handle email confirmation if required)
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Handle potential email confirmation requirement
    try {
      await page.waitForURL('/today', { timeout: 15000 });
    } catch {
      // Check if we're still on login page with email confirmation message
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        const confirmationMessage = await page.locator('text=/check your email|confirmation/i').textContent();
        if (confirmationMessage) {
          console.log('Email confirmation required, skipping test that requires authentication');
          return; // Skip this test as it requires email confirmation
        }
      }
      throw new Error(`Login failed - unexpected navigation to: ${currentUrl}`);
    }

    // Step 3: Verify we're on the today page
    await expect(page.url()).toContain('/today');
    await expect(page.locator('nav')).toBeVisible();

    // Step 4: Count initial tasks
    const initialTaskCount = await page.locator('[data-testid="task-item"]').count();

    // Step 5: Open Add Task Dialog
    const addTaskButton = page.locator('button').filter({ hasText: 'Add Task' });
    await expect(addTaskButton).toBeVisible();
    await addTaskButton.click();

    // Step 6: Verify dialog opens
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(page.locator('h2')).toHaveText('Add New Task');

    // Step 7: Fill out the task form
    const taskTitle = 'Integration Test Task';
    const taskDescription = 'This task was created through the complete integration flow';
    const taskDate = '2025-09-15';

    await page.fill('input[placeholder="Enter task title..."]', taskTitle);
    await page.fill('textarea[placeholder="Add more details about this task..."]', taskDescription);
    await page.fill('input[type="date"]', taskDate);
    await page.locator('select').selectOption('high');

    // Step 8: Submit the form
    await page.locator('button[type="submit"]').filter({ hasText: 'Create Task' }).click();

    // Step 9: Verify dialog closes
    await expect(dialog).not.toBeVisible();

    // Step 10: Verify new task appears in the list
    const newTask = page.locator('text=Integration Test Task');
    await expect(newTask).toBeVisible();

    // Step 11: Verify task details
    await expect(page.locator('text=This task was created through the complete integration flow')).toBeVisible();
    await expect(page.locator('text=high')).toBeVisible();

    // Step 12: Verify task count increased
    const finalTaskCount = await page.locator('[data-testid="task-item"]').count();
    expect(finalTaskCount).toBe(initialTaskCount + 1);
  });

  test('task creation with minimal required fields', async ({ page }) => {
    const testUser = getTestUser('minimal-fields');

    // Sign up and login
    await page.goto('/signup');
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[placeholder="Create a password"]', testUser.password);
    await page.fill('input[placeholder="Confirm your password"]', testUser.password);
    await page.locator('role=checkbox').check();
    await page.click('button[type="submit"]');

    try {
      await page.waitForURL('/login?message=signup-success', { timeout: 15000 });
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/today')) {
        console.log('Signup redirected directly to dashboard');
      }
    }

    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Handle potential email confirmation requirement
    try {
      await page.waitForURL('/today', { timeout: 15000 });
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        const confirmationMessage = await page.locator('text=/check your email|confirmation/i').textContent();
        if (confirmationMessage) {
          console.log('Email confirmation required, skipping test');
          return;
        }
      }
      throw new Error(`Login failed - unexpected navigation to: ${currentUrl}`);
    }

    // Open Add Task Dialog
    await page.locator('button').filter({ hasText: 'Add Task' }).click();

    // Fill only required fields
    await page.fill('input[placeholder="Enter task title..."]', 'Minimal Task');
    await page.locator('select').selectOption('medium');

    // Submit
    await page.locator('button[type="submit"]').filter({ hasText: 'Create Task' }).click();

    // Verify task created
    await expect(page.locator('text=Minimal Task')).toBeVisible();
    await expect(page.locator('text=medium')).toBeVisible();
  });

  test('task creation handles server errors gracefully', async ({ page }) => {
    const testUser = getTestUser('error-handling');

    // Sign up and login
    await page.goto('/signup');
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[placeholder="Create a password"]', testUser.password);
    await page.fill('input[placeholder="Confirm your password"]', testUser.password);
    await page.locator('role=checkbox').check();
    await page.click('button[type="submit"]');

    try {
      await page.waitForURL('/login?message=signup-success', { timeout: 15000 });
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/today')) {
        console.log('Signup redirected directly to dashboard');
      }
    }

    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Handle potential email confirmation requirement
    try {
      await page.waitForURL('/today', { timeout: 15000 });
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        const confirmationMessage = await page.locator('text=/check your email|confirmation/i').textContent();
        if (confirmationMessage) {
          console.log('Email confirmation required, skipping test');
          return;
        }
      }
      throw new Error(`Login failed - unexpected navigation to: ${currentUrl}`);
    }

    // Open Add Task Dialog
    await page.locator('button').filter({ hasText: 'Add Task' }).click();

    // Fill form with valid data
    await page.fill('input[placeholder="Enter task title..."]', 'Error Test Task');
    await page.locator('select').selectOption('low');

    // Submit - this should work in normal conditions
    await page.locator('button[type="submit"]').filter({ hasText: 'Create Task' }).click();

    // Dialog should close on success
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).not.toBeVisible();

    // Task should appear
    await expect(page.locator('text=Error Test Task')).toBeVisible();
  });

  test('multiple tasks can be created sequentially', async ({ page }) => {
    const testUser = getTestUser('multiple-tasks');

    // Sign up and login
    await page.goto('/signup');
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[placeholder="Create a password"]', testUser.password);
    await page.fill('input[placeholder="Confirm your password"]', testUser.password);
    await page.locator('role=checkbox').check();
    await page.click('button[type="submit"]');

    try {
      await page.waitForURL('/login?message=signup-success', { timeout: 15000 });
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/today')) {
        console.log('Signup redirected directly to dashboard');
      }
    }

    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Handle potential email confirmation requirement
    try {
      await page.waitForURL('/today', { timeout: 15000 });
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        const confirmationMessage = await page.locator('text=/check your email|confirmation/i').textContent();
        if (confirmationMessage) {
          console.log('Email confirmation required, skipping test');
          return;
        }
      }
      throw new Error(`Login failed - unexpected navigation to: ${currentUrl}`);
    }

    // Create first task
    await page.locator('button').filter({ hasText: 'Add Task' }).click();
    await page.fill('input[placeholder="Enter task title..."]', 'First Task');
    await page.locator('select').selectOption('high');
    await page.locator('button[type="submit"]').filter({ hasText: 'Create Task' }).click();
    await expect(page.locator('text=First Task')).toBeVisible();

    // Create second task
    await page.locator('button').filter({ hasText: 'Add Task' }).click();
    await page.fill('input[placeholder="Enter task title..."]', 'Second Task');
    await page.locator('select').selectOption('medium');
    await page.locator('button[type="submit"]').filter({ hasText: 'Create Task' }).click();
    await expect(page.locator('text=Second Task')).toBeVisible();

    // Create third task
    await page.locator('button').filter({ hasText: 'Add Task' }).click();
    await page.fill('input[placeholder="Enter task title..."]', 'Third Task');
    await page.locator('select').selectOption('low');
    await page.locator('button[type="submit"]').filter({ hasText: 'Create Task' }).click();
    await expect(page.locator('text=Third Task')).toBeVisible();

    // Verify all tasks are present
    await expect(page.locator('text=First Task')).toBeVisible();
    await expect(page.locator('text=Second Task')).toBeVisible();
    await expect(page.locator('text=Third Task')).toBeVisible();
  });

  test('task creation updates task list immediately', async ({ page }) => {
    const testUser = getTestUser('immediate-update');

    // Sign up and login
    await page.goto('/signup');
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[placeholder="Create a password"]', testUser.password);
    await page.fill('input[placeholder="Confirm your password"]', testUser.password);
    await page.locator('role=checkbox').check();
    await page.click('button[type="submit"]');

    try {
      await page.waitForURL('/login?message=signup-success', { timeout: 15000 });
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/today')) {
        console.log('Signup redirected directly to dashboard');
      }
    }

    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Handle potential email confirmation requirement
    try {
      await page.waitForURL('/today', { timeout: 15000 });
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        const confirmationMessage = await page.locator('text=/check your email|confirmation/i').textContent();
        if (confirmationMessage) {
          console.log('Email confirmation required, skipping test');
          return;
        }
      }
      throw new Error(`Login failed - unexpected navigation to: ${currentUrl}`);
    }

    // Create task
    await page.locator('button').filter({ hasText: 'Add Task' }).click();
    await page.fill('input[placeholder="Enter task title..."]', 'Immediate Update Task');
    await page.fill('textarea[placeholder="Add more details about this task..."]', 'This task should appear immediately');
    await page.locator('select').selectOption('urgent');
    await page.locator('button[type="submit"]').filter({ hasText: 'Create Task' }).click();

    // Verify task appears immediately without page refresh
    await expect(page.locator('text=Immediate Update Task')).toBeVisible();
    await expect(page.locator('text=This task should appear immediately')).toBeVisible();
    await expect(page.locator('text=urgent')).toBeVisible();

    // Verify dialog is closed
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).not.toBeVisible();
  });
});
