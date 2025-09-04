import { expect, test } from '@playwright/test'

test.describe('Dashboard Layout', () => {
  test('should protect dashboard routes from unauthenticated access', async ({ page }) => {
    // Test that dashboard routes redirect to login
    const protectedRoutes = ['/today', '/calendar', '/tasks', '/settings']

    for (const route of protectedRoutes) {
      await page.goto(route)
      await page.waitForURL(/\/login/)
      expect(page.url()).toContain('/login')
    }
  })

  test('should have consistent layout structure across protected routes', async ({ page }) => {
    // Test that all protected routes redirect consistently
    const protectedRoutes = ['/today', '/calendar', '/tasks', '/habits', '/progress', '/settings']

    for (const route of protectedRoutes) {
      await page.goto(route)
      await page.waitForURL(/\/login/)

      // Verify login page loads properly
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="password"]')).toBeVisible()
      await expect(page.locator('button[type="submit"]')).toBeVisible()
    }
  })

  test('should have proper responsive behavior on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Navigate to protected route
    await page.goto('/today')
    await page.waitForURL(/\/login/)

    // Check that login page is responsive on mobile
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const signInButton = page.locator('button[type="submit"]')

    // Verify elements are visible and properly sized on mobile
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(signInButton).toBeVisible()

    // Check that the form has proper mobile styling
    await expect(signInButton).toHaveClass(/w-full/)
  })

  test('should maintain proper page structure after middleware redirect', async ({ page }) => {
    // Navigate to dashboard route
    await page.goto('/today')

    // Verify redirect to login
    await page.waitForURL(/\/login/)

    // Check that the page has proper structure
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('body')).toBeVisible()

    // Check for main layout elements
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
  })

  test('should have proper form structure', async ({ page }) => {
    await page.goto('/login')

    // Check form accessibility
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')

    await expect(emailInput).toHaveAttribute('id')
    await expect(emailInput).toHaveAttribute('name')

    await expect(passwordInput).toHaveAttribute('id')
    await expect(passwordInput).toHaveAttribute('name')
  })

  test('should have proper button structure', async ({ page }) => {
    await page.goto('/login')

    // Check sign in button
    const signInButton = page.locator('button[type="submit"]')
    await expect(signInButton).toBeVisible()
    await expect(signInButton).toHaveText('Sign In')
  })

  test('should handle redirect with query parameters', async ({ page }) => {
    // Navigate to dashboard route
    await page.goto('/today')

    // Verify redirect includes the original route as redirectTo parameter
    await page.waitForURL(/\/login\?redirectTo=/)
    expect(page.url()).toContain('redirectTo=%2Ftoday')
  })

  test('should protect all dashboard routes consistently', async ({ page }) => {
    // Test multiple routes to ensure consistent protection
    const routes = [
      '/today',
      '/calendar',
      '/tasks',
      '/habits',
      '/progress',
      '/settings'
    ]

    for (const route of routes) {
      await page.goto(route)
      await page.waitForURL(/\/login/)
      expect(page.url()).toContain('/login')
    }
  })
})
