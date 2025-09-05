import { test, expect } from '@playwright/test';

test.describe('Add Task Dialog', () => {
  // Test user data
  const testUser = {
    fullName: 'Test User',
    email: `test-add-task-${Date.now()}@example.com`,
    password: 'TestPassword123!',
  };

  test.beforeEach(async ({ page }) => {
    // Clear any existing session/cookies before each test
    await page.context().clearCookies();
    await page.context().clearPermissions();
    test.setTimeout(60000);
  });

  test('should open dialog when Add Task button is clicked', async ({ page }) => {
    // First, create a test account and login
    await page.goto('/signup');
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[placeholder="Create a password"]', testUser.password);
    await page.fill('input[placeholder="Confirm your password"]', testUser.password);
    await page.locator('role=checkbox').check();
    await page.click('button[type="submit"]');

    // Wait for redirect to login or dashboard
    try {
      await page.waitForURL('/login?message=signup-success', { timeout: 15000 });
      // Complete login
      await page.fill('input[type="email"]', testUser.email);
      await page.fill('input[type="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/today', { timeout: 15000 });
    } catch {
      // If already on dashboard, continue
      if (!page.url().includes('/today')) {
        throw new Error('Failed to authenticate user');
      }
    }

    // Now test the Add Task Dialog
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify dialog is open
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Add New Task')).toBeVisible();
    await expect(page.getByText('Create a new task to add to your list. Fill in the details below.')).toBeVisible();
  });

  test('should display form fields correctly', async ({ page }) => {
    // First, create a test account and login
    await page.goto('/signup');
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[placeholder="Create a password"]', testUser.password);
    await page.fill('input[placeholder="Confirm your password"]', testUser.password);
    await page.locator('role=checkbox').check();
    await page.click('button[type="submit"]');

    // Wait for redirect to login or dashboard
    try {
      await page.waitForURL('/login?message=signup-success', { timeout: 15000 });
      // Complete login
      await page.fill('input[type="email"]', testUser.email);
      await page.fill('input[type="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/today', { timeout: 15000 });
    } catch {
      // If already on dashboard, continue
      if (!page.url().includes('/today')) {
        throw new Error('Failed to authenticate user');
      }
    }

    // Click the Add Task button
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify form fields are present
    await expect(page.getByLabel('Title')).toBeVisible();
    await expect(page.getByLabel('Description (Optional)')).toBeVisible();
    await expect(page.getByLabel('Due Date (Optional)')).toBeVisible();
    await expect(page.getByLabel('Priority')).toBeVisible();

    // Verify buttons are present
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Task' })).toBeVisible();
  });

  test('should close dialog when Cancel button is clicked', async ({ page }) => {
    // First, create a test account and login
    await page.goto('/signup');
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[placeholder="Create a password"]', testUser.password);
    await page.fill('input[placeholder="Confirm your password"]', testUser.password);
    await page.locator('role=checkbox').check();
    await page.click('button[type="submit"]');

    // Wait for redirect to login or dashboard
    try {
      await page.waitForURL('/login?message=signup-success', { timeout: 15000 });
      // Complete login
      await page.fill('input[type="email"]', testUser.email);
      await page.fill('input[type="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/today', { timeout: 15000 });
    } catch {
      // If already on dashboard, continue
      if (!page.url().includes('/today')) {
        throw new Error('Failed to authenticate user');
      }
    }

    // Click the Add Task button
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify dialog is open
    await expect(page.getByRole('dialog')).toBeVisible();

    // Click Cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify dialog is closed
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('should show validation errors for required fields', async ({ page }) => {
    // First, create a test account and login
    await page.goto('/signup');
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[placeholder="Create a password"]', testUser.password);
    await page.fill('input[placeholder="Confirm your password"]', testUser.password);
    await page.locator('role=checkbox').check();
    await page.click('button[type="submit"]');

    // Wait for redirect to login or dashboard
    try {
      await page.waitForURL('/login?message=signup-success', { timeout: 15000 });
      // Complete login
      await page.fill('input[type="email"]', testUser.email);
      await page.fill('input[type="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/today', { timeout: 15000 });
    } catch {
      // If already on dashboard, continue
      if (!page.url().includes('/today')) {
        throw new Error('Failed to authenticate user');
      }
    }

    // Click the Add Task button
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Try to submit without filling required fields
    await page.getByRole('button', { name: 'Create Task' }).click();

    // Verify validation error for title
    await expect(page.getByText('Title is required')).toBeVisible();
  });

  test('should allow filling out the form', async ({ page }) => {
    // First, create a test account and login
    await page.goto('/signup');
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[placeholder="Create a password"]', testUser.password);
    await page.fill('input[placeholder="Confirm your password"]', testUser.password);
    await page.locator('role=checkbox').check();
    await page.click('button[type="submit"]');

    // Wait for redirect to login or dashboard
    try {
      await page.waitForURL('/login?message=signup-success', { timeout: 15000 });
      // Complete login
      await page.fill('input[type="email"]', testUser.email);
      await page.fill('input[type="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/today', { timeout: 15000 });
    } catch {
      // If already on dashboard, continue
      if (!page.url().includes('/today')) {
        throw new Error('Failed to authenticate user');
      }
    }

    // Click the Add Task button
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Fill out the form
    await page.getByLabel('Title').fill('Test Task');
    await page.getByLabel('Description (Optional)').fill('This is a test task description');
    await page.getByLabel('Due Date (Optional)').fill('2025-12-31');
    await page.getByLabel('Priority').click();
    await page.getByRole('option', { name: 'High' }).click();

    // Verify form values
    await expect(page.getByLabel('Title')).toHaveValue('Test Task');
    await expect(page.getByLabel('Description (Optional)')).toHaveValue('This is a test task description');
    await expect(page.getByLabel('Due Date (Optional)')).toHaveValue('2025-12-31');
    await expect(page.getByRole('button', { name: 'High' })).toBeVisible();
  });

  test('should show loading state during submission', async ({ page }) => {
    // First, create a test account and login
    await page.goto('/signup');
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[placeholder="Create a password"]', testUser.password);
    await page.fill('input[placeholder="Confirm your password"]', testUser.password);
    await page.locator('role=checkbox').check();
    await page.click('button[type="submit"]');

    // Wait for redirect to login or dashboard
    try {
      await page.waitForURL('/login?message=signup-success', { timeout: 15000 });
      // Complete login
      await page.fill('input[type="email"]', testUser.email);
      await page.fill('input[type="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/today', { timeout: 15000 });
    } catch {
      // If already on dashboard, continue
      if (!page.url().includes('/today')) {
        throw new Error('Failed to authenticate user');
      }
    }

    // Click the Add Task button
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Fill out the form
    await page.getByLabel('Title').fill('Test Task');
    await page.getByLabel('Priority').click();
    await page.getByRole('option', { name: 'Medium' }).click();

    // Click Create Task button
    await page.getByRole('button', { name: 'Create Task' }).click();

    // Verify loading state
    await expect(page.getByRole('button', { name: 'Creating...' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  test('should close dialog after successful submission', async ({ page }) => {
    // First, create a test account and login
    await page.goto('/signup');
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[placeholder="Create a password"]', testUser.password);
    await page.fill('input[placeholder="Confirm your password"]', testUser.password);
    await page.locator('role=checkbox').check();
    await page.click('button[type="submit"]');

    // Wait for redirect to login or dashboard
    try {
      await page.waitForURL('/login?message=signup-success', { timeout: 15000 });
      // Complete login
      await page.fill('input[type="email"]', testUser.email);
      await page.fill('input[type="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/today', { timeout: 15000 });
    } catch {
      // If already on dashboard, continue
      if (!page.url().includes('/today')) {
        throw new Error('Failed to authenticate user');
      }
    }

    // Click the Add Task button
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Fill out the form
    await page.getByLabel('Title').fill('Test Task');
    await page.getByLabel('Priority').click();
    await page.getByRole('option', { name: 'Medium' }).click();

    // Click Create Task button
    await page.getByRole('button', { name: 'Create Task' }).click();

    // Wait for dialog to close (simulated success)
    await expect(page.getByRole('dialog')).toBeHidden();
  });
});
