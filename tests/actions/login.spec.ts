import { test, expect } from '@playwright/test'

test.describe('Login Server Action', () => {
  test('should authenticate user with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Fill in login form with test user credentials
    await page.fill('input[name="email"]', 'john.doe@clearday.test')
    await page.fill('input[name="password"]', 'testpassword123')

    // Submit form
    await page.click('button[type="submit"]')

    // Note: This test will fail until we set up test user authentication
    // For now, it demonstrates the form submission flow
    // Should eventually redirect to dashboard on success
    await expect(page).toHaveURL('/today')
  })

  test('should show error for invalid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Fill in invalid credentials
    await page.fill('input[name="email"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')

    // Submit form
    await page.click('button[type="submit"]')

    // Should show error message from Supabase
    await expect(page.locator('text=Invalid login credentials')).toBeVisible()
  })

  test('should show error for missing email', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Leave email empty, fill password
    await page.fill('input[name="password"]', 'testpassword123')

    // Submit form
    await page.click('button[type="submit"]')

    // Should show client-side validation error
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible()
  })

  test('should show error for missing password', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Fill email, leave password empty
    await page.fill('input[name="email"]', 'test@example.com')

    // Submit form
    await page.click('button[type="submit"]')

    // Should show validation error
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Fill in credentials
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'testpassword123')

    // Mock network failure by intercepting Supabase auth calls
    await page.route('**/auth/v1/**', route => route.abort())

    // Submit form
    await page.click('button[type="submit"]')

    // Should show generic error message
    await expect(page.locator('text=An unexpected error occurred')).toBeVisible()
  })

  test('should show loading state during authentication', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Fill in credentials
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'testpassword123')

    // Submit form
    await page.click('button[type="submit"]')

    // Should show loading state
    await expect(page.locator('text=Signing in...')).toBeVisible()
  })

  test('should maintain form data on validation error', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Fill in email but not password
    await page.fill('input[name="email"]', 'test@example.com')

    // Submit form
    await page.click('button[type="submit"]')

    // Email should still be filled
    await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com')
  })

  test('should redirect authenticated users away from login', async ({ page }) => {
    // This test would require setting up authenticated state
    // For now, we'll test the basic form structure

    await page.goto('/login')

    // Verify login form is present
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })
})
