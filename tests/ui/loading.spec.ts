import { test, expect } from '@playwright/test'

test.describe('Loading States', () => {
  test('should show loading page during auth operations', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Verify loading page is not shown initially
    await expect(page.locator('text=Loading...')).not.toBeVisible()

    // Fill out the form
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')

    // Click submit and check for loading state
    await page.click('button[type="submit"]')

    // Verify button shows loading state
    await expect(page.locator('button[type="submit"]').locator('text=Signing in...')).toBeVisible()
    await expect(page.locator('button[type="submit"]').locator('.animate-spin')).toBeVisible()

    // Verify form inputs are disabled during loading
    await expect(page.locator('input[type="email"]')).toBeDisabled()
    await expect(page.locator('input[type="password"]')).toBeDisabled()
  })

  test('should show loading state on signup form', async ({ page }) => {
    // Navigate to signup page
    await page.goto('/signup')

    // Fill out the form
    await page.fill('input[placeholder="Enter your full name"]', 'Test User')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[placeholder="Create a password"]', 'password123')
    await page.fill('input[placeholder="Confirm your password"]', 'password123')
    await page.check('input[type="checkbox"]')

    // Click submit and check for loading state
    await page.click('button[type="submit"]')

    // Verify button shows loading state
    await expect(page.locator('button[type="submit"]').locator('text=Creating account...')).toBeVisible()
    await expect(page.locator('button[type="submit"]').locator('.animate-spin')).toBeVisible()

    // Verify form inputs are disabled during loading
    await expect(page.locator('input[placeholder="Enter your full name"]')).toBeDisabled()
    await expect(page.locator('input[type="email"]')).toBeDisabled()
    await expect(page.locator('input[placeholder="Create a password"]')).toBeDisabled()
    await expect(page.locator('input[placeholder="Confirm your password"]')).toBeDisabled()
    await expect(page.locator('input[type="checkbox"]')).toBeDisabled()
  })

  test('should prevent multiple form submissions during loading', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Fill out the form
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')

    // Click submit
    await page.click('button[type="submit"]')

    // Verify button is disabled
    await expect(page.locator('button[type="submit"]')).toBeDisabled()

    // Try to click again - should not trigger another submission
    await page.click('button[type="submit"]')

    // Button should still be disabled and show loading state
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
    await expect(page.locator('button[type="submit"]').locator('text=Signing in...')).toBeVisible()
  })

  test('should show spinner component correctly', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Fill out the form
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')

    // Click submit to trigger loading state
    await page.click('button[type="submit"]')

    // Verify spinner is visible and has correct classes
    const spinner = page.locator('.animate-spin')
    await expect(spinner).toBeVisible()
    await expect(spinner).toHaveClass(/border-2/)
    await expect(spinner).toHaveClass(/border-t-transparent/)
    await expect(spinner).toHaveClass(/rounded-full/)
  })

  test('should maintain form data during loading state', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Fill out the form
    const testEmail = 'test@example.com'
    const testPassword = 'password123'
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)

    // Click submit to trigger loading state
    await page.click('button[type="submit"]')

    // Verify form data is preserved
    await expect(page.locator('input[type="email"]')).toHaveValue(testEmail)
    await expect(page.locator('input[type="password"]')).toHaveValue(testPassword)
  })

  test('should handle loading state transitions correctly', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Verify initial state
    await expect(page.locator('button[type="submit"]').locator('text=Sign In')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).not.toBeDisabled()

    // Fill out the form
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')

    // Click submit
    await page.click('button[type="submit"]')

    // Verify loading state
    await expect(page.locator('button[type="submit"]').locator('text=Signing in...')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeDisabled()

    // Wait for loading to complete (simulate by waiting for form to be ready again)
    // In a real scenario, this would be handled by the auth action completing
    await page.waitForTimeout(1000)

    // Note: In a real test, we would mock the auth response
    // For now, we verify the loading state was properly triggered
  })
})
