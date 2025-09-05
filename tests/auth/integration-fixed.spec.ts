import { test, expect } from '@playwright/test'

test.describe('Authentication Integration Tests', () => {
  // Test user data - use a valid email domain that Supabase accepts
  const testUser = {
    fullName: 'Test Integration User',
    email: `test-integration-${Date.now()}@test.com`,
    password: 'TestPassword123!',
  }

  test.beforeEach(async ({ page }) => {
    // Clear any existing session/cookies before each test
    await page.context().clearCookies()
    await page.context().clearPermissions()
    // Set longer timeout for auth operations
    test.setTimeout(60000)
  })

  test('complete user registration and login flow', async ({ page }) => {
    // Step 1: Navigate to signup page
    await page.goto('/signup')
    await expect(page.locator('h1')).toHaveText('Create your account')

    // Step 2: Fill out signup form
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName)
    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[placeholder="Create a password"]', testUser.password)
    await page.fill('input[placeholder="Confirm your password"]', testUser.password)

    // Accept terms - click the label instead of the checkbox input
    await page.click('text=/I agree to the Terms/')

    // Step 3: Submit signup form
    await page.click('button[type="submit"]')

    // Step 4: Should redirect to login page after successful signup
    await page.waitForURL('/login?message=signup-success')
    await expect(page.locator('h2')).toHaveText('Sign in to your account')

    // Step 5: Login with the newly created account
    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[type="password"]', testUser.password)
    await page.click('button[type="submit"]')

    // Step 6: Should redirect to dashboard after successful login
    await page.waitForURL('/today')
    await expect(page.url()).toContain('/today')

    // Step 7: Verify we're on the dashboard and can see user-specific content
    await expect(page.locator('nav')).toBeVisible()
    // Check for any main content - adjust based on actual dashboard content
    await expect(page.locator('main, [role="main"]')).toBeVisible()
  })

  test('login with existing account and access protected routes', async ({ page }) => {
    // First, create a test account by going through signup
    await page.goto('/signup')
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName)
    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[placeholder="Create a password"]', testUser.password)
    await page.fill('input[placeholder="Confirm your password"]', testUser.password)
    await page.click('text=/I agree to the Terms/')
    await page.click('button[type="submit"]')
    await page.waitForURL('/login?message=signup-success')

    // Now login
    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[type="password"]', testUser.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/today')

    // Test accessing different protected routes
    const protectedRoutes = ['/calendar', '/tasks', '/habits', '/progress', '/settings']

    for (const route of protectedRoutes) {
      await page.goto(route)
      // Should stay on the route (not redirected to login)
      await expect(page.url()).toContain(route)
      // Should see navigation
      await expect(page.locator('nav')).toBeVisible()
    }
  })

  test('logout functionality and route protection', async ({ page }) => {
    // First login
    await page.goto('/signup')
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName)
    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[placeholder="Create a password"]', testUser.password)
    await page.fill('input[placeholder="Confirm your password"]', testUser.password)
    await page.click('text=/I agree to the Terms/')
    await page.click('button[type="submit"]')
    await page.waitForURL('/login?message=signup-success')

    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[type="password"]', testUser.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/today')

    // Verify we're logged in and can access protected content
    await expect(page.locator('nav')).toBeVisible()

    // For now, test logout by making a direct request to sign out
    // This simulates what would happen when clicking a logout button
    await page.evaluate(async () => {
      const response = await fetch('/actions/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signOut' })
      })
      return response
    })

    // After logout, accessing protected routes should redirect to login
    await page.goto('/today')
    await page.waitForURL('/login')
    expect(page.url()).toContain('/login')
  })

  test('authentication error handling', async ({ page }) => {
    // Test invalid login credentials
    await page.goto('/login')
    await page.fill('input[type="email"]', 'nonexistent@test.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Should show error message - look for error text in various places
    await expect(page.locator('text=/invalid|wrong|error|credentials/i')).toBeVisible()

    // Should stay on login page
    await expect(page.url()).toContain('/login')
  })

  test('signup validation and error handling', async ({ page }) => {
    await page.goto('/signup')

    // Test password mismatch
    await page.fill('input[placeholder="Enter your full name"]', 'Test User')
    await page.fill('input[type="email"]', 'test@test.com')
    await page.fill('input[placeholder="Create a password"]', 'password123')
    await page.fill('input[placeholder="Confirm your password"]', 'password456')
    await page.click('text=/I agree to the Terms/')
    await page.click('button[type="submit"]')

    // Should show password mismatch error
    await expect(page.locator('text=/passwords.*match|don\'t match/i')).toBeVisible()

    // Test weak password
    await page.fill('input[placeholder="Confirm your password"]', '123')
    await page.click('button[type="submit"]')

    // Should show password strength error
    await expect(page.locator('text=/at least 8 characters|too short/i')).toBeVisible()

    // Test missing terms acceptance
    await page.locator('input[type="checkbox"]').uncheck()
    await page.fill('input[placeholder="Confirm your password"]', 'password123')
    await page.click('button[type="submit"]')

    // Should show terms acceptance error
    await expect(page.locator('text=/terms|conditions|accept/i')).toBeVisible()
  })

  test('route protection for unauthenticated users', async ({ page }) => {
    const protectedRoutes = ['/today', '/calendar', '/tasks', '/habits', '/progress', '/settings']

    for (const route of protectedRoutes) {
      await page.goto(route)
      // Should redirect to login with redirectTo parameter
      await page.waitForURL(/\/login\?redirectTo=/)
      expect(page.url()).toContain('/login')
    }

    // Public routes should be accessible
    const publicRoutes = ['/', '/login', '/signup']
    for (const route of publicRoutes) {
      await page.goto(route)
      // Should stay on the route
      await expect(page.url()).toContain(route)
    }
  })

  test('session persistence across page reloads', async ({ page }) => {
    // Login first
    await page.goto('/signup')
    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName)
    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[placeholder="Create a password"]', testUser.password)
    await page.fill('input[placeholder="Confirm your password"]', testUser.password)
    await page.click('text=/I agree to the Terms/')
    await page.click('button[type="submit"]')
    await page.waitForURL('/login?message=signup-success')

    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[type="password"]', testUser.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/today')

    // Reload the page
    await page.reload()

    // Should still be logged in and on the dashboard
    await expect(page.url()).toContain('/today')
    await expect(page.locator('nav')).toBeVisible()
  })

  test('form validation and error clearing', async ({ page }) => {
    await page.goto('/login')

    // Submit empty form
    await page.click('button[type="submit"]')

    // Should show validation errors - be more specific to avoid multiple matches
    await expect(page.locator('text="Email is required"')).toBeVisible()
    await expect(page.locator('text="Password is required"')).toBeVisible()

    // Fill in the fields
    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[type="password"]', testUser.password)

    // Errors should be cleared
    await expect(page.locator('text="Email is required"')).not.toBeVisible()
    await expect(page.locator('text="Password is required"')).not.toBeVisible()
  })

  test('navigation between auth pages', async ({ page }) => {
    // Start on login page
    await page.goto('/login')
    await expect(page.locator('h2')).toHaveText('Sign in to your account')

    // Click signup link - use more specific selector
    await page.click('a[href="/signup"]')
    await expect(page.url()).toContain('/signup')
    await expect(page.locator('h1')).toHaveText('Create your account')

    // Click login link - use more specific selector
    await page.click('a[href="/login"]')
    await expect(page.url()).toContain('/login')
    await expect(page.locator('h2')).toHaveText('Sign in to your account')
  })

  test('loading states during authentication', async ({ page }) => {
    await page.goto('/login')

    // Fill form and submit
    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[type="password"]', testUser.password)
    await page.click('button[type="submit"]')

    // Should show loading state - look for spinner or loading text
    await expect(page.locator('text=/signing|loading|creating/i').or(page.locator('.animate-spin'))).toBeVisible()

    // Button should be disabled during loading
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
  })

  test('email confirmation flow (if implemented)', async ({ page }) => {
    // This test assumes email confirmation is implemented
    // If not, it will be skipped
    await page.goto('/signup')

    await page.fill('input[placeholder="Enter your full name"]', testUser.fullName)
    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[placeholder="Create a password"]', testUser.password)
    await page.fill('input[placeholder="Confirm your password"]', testUser.password)
    await page.click('text=/I agree to the Terms/')
    await page.click('button[type="submit"]')

    // If email confirmation is required, should show confirmation message
    // Otherwise, should redirect to login
    try {
      await expect(page.locator('text=/check.*email|confirmation|verify/i')).toBeVisible()
    } catch {
      // Email confirmation not implemented, should redirect to login
      await page.waitForURL('/login?message=signup-success')
    }
  })
})
