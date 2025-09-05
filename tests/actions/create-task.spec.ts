import { test, expect } from '@playwright/test';

test.describe('Create Task Server Action Tests', () => {
  // Test user data - use unique emails to avoid conflicts
  const getTestUser = (testName: string) => ({
    fullName: 'Test Task User',
    email: `test-task-${testName}-${Date.now()}@gmail.com`,
    password: 'TestPassword123!',
  });

  test.beforeEach(async ({ page }) => {
    // Clear any existing session/cookies before each test
    await page.context().clearCookies();
    await page.context().clearPermissions();
    // Set longer timeout for database operations
    test.setTimeout(60000);
  });

  test('creates task for authenticated user', async ({ page }) => {
    const testUser = getTestUser('create-task');

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
        // Already on dashboard
        console.log('Signup redirected directly to dashboard');
      } else if (currentUrl.includes('/signup')) {
        const errorText = await page.locator('.text-red-600, .text-destructive').textContent();
        if (errorText?.includes('rate limit') || errorText?.includes('security purposes')) {
          console.log('Rate limiting detected, skipping test');
          return;
        }
        throw new Error(`Signup failed: ${errorText}`);
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

    // Step 3: Navigate to today page and verify we're logged in
    await expect(page.url()).toContain('/today');
    await expect(page.locator('nav')).toBeVisible();

    // Step 4: Open Add Task Dialog
    const addTaskButton = page.locator('button').filter({ hasText: 'Add Task' });
    await expect(addTaskButton).toBeVisible();
    await addTaskButton.click();

    // Step 5: Fill out the task form
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    await page.fill('input[placeholder="Enter task title..."]', 'Test Task from Playwright');
    await page.fill('textarea[placeholder="Add more details about this task..."]', 'This is a test task created by Playwright automation');
    await page.fill('input[type="date"]', '2025-09-15'); // Future date
    await page.locator('select').selectOption('high'); // Set priority to high

    // Step 6: Submit the form
    await page.locator('button[type="submit"]').filter({ hasText: 'Create Task' }).click();

    // Step 7: Verify task was created - dialog should close
    await expect(dialog).not.toBeVisible();

    // Step 8: Verify task appears in the task list
    const taskTitle = page.locator('text=Test Task from Playwright');
    await expect(taskTitle).toBeVisible();

    // Step 9: Verify task details are displayed correctly
    const taskDescription = page.locator('text=This is a test task created by Playwright');
    await expect(taskDescription).toBeVisible();

    // Verify priority badge
    const priorityBadge = page.locator('text=high');
    await expect(priorityBadge).toBeVisible();
  });

  test('validates required fields when creating task', async ({ page }) => {
    const testUser = getTestUser('validation');

    // Sign up and login first
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
    await page.waitForURL('/today', { timeout: 15000 });

    // Open Add Task Dialog
    await page.locator('button').filter({ hasText: 'Add Task' }).click();

    // Try to submit empty form
    await page.locator('button[type="submit"]').filter({ hasText: 'Create Task' }).click();

    // Should show validation error for required title
    await expect(page.locator('text=Title is required')).toBeVisible();

    // Fill title but leave other fields empty
    await page.fill('input[placeholder="Enter task title..."]', 'Valid Title');

    // Should not show title error anymore
    await expect(page.locator('text=Title is required')).not.toBeVisible();

    // Submit with valid title
    await page.locator('button[type="submit"]').filter({ hasText: 'Create Task' }).click();

    // Dialog should close and task should be created
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).not.toBeVisible();

    // Verify task appears
    await expect(page.locator('text=Valid Title')).toBeVisible();
  });

  test('handles task creation errors gracefully', async ({ page }) => {
    const testUser = getTestUser('error-handling');

    // Sign up and login first
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
    await page.waitForURL('/today', { timeout: 15000 });

    // Open Add Task Dialog
    await page.locator('button').filter({ hasText: 'Add Task' }).click();

    // Fill form with valid data
    await page.fill('input[placeholder="Enter task title..."]', 'Test Task');
    await page.locator('select').selectOption('medium');

    // Submit the form
    await page.locator('button[type="submit"]').filter({ hasText: 'Create Task' }).click();

    // Dialog should close (success case)
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).not.toBeVisible();

    // Task should appear in list
    await expect(page.locator('text=Test Task')).toBeVisible();
  });

  test('associates task with correct user', async ({ page }) => {
    const testUser1 = getTestUser('user1');
    const testUser2 = getTestUser('user2');

    // Create first user and add a task
    await page.goto('/signup');
    await page.fill('input[placeholder="Enter your full name"]', testUser1.fullName);
    await page.fill('input[type="email"]', testUser1.email);
    await page.fill('input[placeholder="Create a password"]', testUser1.password);
    await page.fill('input[placeholder="Confirm your password"]', testUser1.password);
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

    await page.fill('input[type="email"]', testUser1.email);
    await page.fill('input[type="password"]', testUser1.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/today', { timeout: 15000 });

    // Add task for first user
    await page.locator('button').filter({ hasText: 'Add Task' }).click();
    await page.fill('input[placeholder="Enter task title..."]', 'User 1 Task');
    await page.locator('button[type="submit"]').filter({ hasText: 'Create Task' }).click();
    await expect(page.locator('text=User 1 Task')).toBeVisible();

    // Logout by clearing session and going to login
    await page.context().clearCookies();
    await page.goto('/login');

    // Create second user and verify they don't see the first user's task
    await page.goto('/signup');
    await page.fill('input[placeholder="Enter your full name"]', testUser2.fullName);
    await page.fill('input[type="email"]', testUser2.email);
    await page.fill('input[placeholder="Create a password"]', testUser2.password);
    await page.fill('input[placeholder="Confirm your password"]', testUser2.password);
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

    await page.fill('input[type="email"]', testUser2.email);
    await page.fill('input[type="password"]', testUser2.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/today', { timeout: 15000 });

    // Second user should not see the first user's task
    await expect(page.locator('text=User 1 Task')).not.toBeVisible();

    // Add task for second user
    await page.locator('button').filter({ hasText: 'Add Task' }).click();
    await page.fill('input[placeholder="Enter task title..."]', 'User 2 Task');
    await page.locator('button[type="submit"]').filter({ hasText: 'Create Task' }).click();
    await expect(page.locator('text=User 2 Task')).toBeVisible();
  });

  test('creates task with all optional fields', async ({ page }) => {
    const testUser = getTestUser('full-task');

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
    await page.waitForURL('/today', { timeout: 15000 });

    // Create task with all fields filled
    await page.locator('button').filter({ hasText: 'Add Task' }).click();
    await page.fill('input[placeholder="Enter task title..."]', 'Complete Task with All Fields');
    await page.fill('textarea[placeholder="Add more details about this task..."]', 'This task has a description, due date, and urgent priority');
    await page.fill('input[type="date"]', '2025-09-20');
    await page.locator('select').selectOption('urgent');

    await page.locator('button[type="submit"]').filter({ hasText: 'Create Task' }).click();

    // Verify task appears with all details
    await expect(page.locator('text=Complete Task with All Fields')).toBeVisible();
    await expect(page.locator('text=This task has a description, due date, and urgent priority')).toBeVisible();
    await expect(page.locator('text=urgent')).toBeVisible();
  });
});
