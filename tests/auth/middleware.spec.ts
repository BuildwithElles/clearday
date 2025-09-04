import { test, expect } from '@playwright/test'

test.describe('Middleware - Route Protection', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session before each test
    await page.context().clearCookies()
  })

  test('should allow access to public routes without authentication', async ({ page }) => {
    // Test landing page
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()

    // Test login page
    await page.goto('/login')
    await expect(page.locator('h1')).toContainText(/login/i)

    // Test signup page
    await page.goto('/signup')
    await expect(page.locator('h1')).toContainText(/sign/i)
  })

  test('should redirect unauthenticated users from protected routes to login', async ({ page }) => {
    // Test /today route
    await page.goto('/today')
    await page.waitForURL('**/login')
    expect(page.url()).toContain('/login')

    // Test /settings route
    await page.goto('/settings')
    await page.waitForURL('**/login')
    expect(page.url()).toContain('/login')

    // Test /calendar route
    await page.goto('/calendar')
    await page.waitForURL('**/login')
    expect(page.url()).toContain('/login')

    // Test /tasks route
    await page.goto('/tasks')
    await page.waitForURL('**/login')
    expect(page.url()).toContain('/tasks') // This should still redirect to login
    await page.waitForURL('**/login')
    expect(page.url()).toContain('/login')
  })

  test('should preserve redirect URL in query parameter', async ({ page }) => {
    // Try to access /today without authentication
    await page.goto('/today')

    // Should redirect to login with redirectTo parameter
    await page.waitForURL('**/login?redirectTo=%2Ftoday')
    expect(page.url()).toContain('/login?redirectTo=%2Ftoday')
  })

  test('should redirect authenticated users away from auth routes', async ({ page }) => {
    // First, simulate authentication by setting up a mock session
    await page.addScriptTag({
      content: `
        // Mock authenticated session in localStorage
        window.localStorage.setItem('supabase.auth.token', JSON.stringify({
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          expires_at: Date.now() / 1000 + 3600,
          user: {
            id: 'test-user-id',
            email: 'test@example.com'
          }
        }))
      `
    })

    // Try to access login page
    await page.goto('/login')
    await page.waitForURL('**/today')
    expect(page.url()).toContain('/today')

    // Try to access signup page
    await page.goto('/signup')
    await page.waitForURL('**/today')
    expect(page.url()).toContain('/today')
  })

  test('should allow authenticated users to access protected routes', async ({ page }) => {
    // Simulate authentication
    await page.addScriptTag({
      content: `
        window.localStorage.setItem('supabase.auth.token', JSON.stringify({
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          expires_at: Date.now() / 1000 + 3600,
          user: {
            id: 'test-user-id',
            email: 'test@example.com'
          }
        }))
      `
    })

    // Try to access protected routes
    await page.goto('/today')
    // Should not redirect to login
    expect(page.url()).not.toContain('/login')

    await page.goto('/settings')
    expect(page.url()).not.toContain('/login')

    await page.goto('/calendar')
    expect(page.url()).not.toContain('/login')
  })

  test('should handle expired sessions correctly', async ({ page }) => {
    // Set up an expired session
    await page.addScriptTag({
      content: `
        window.localStorage.setItem('supabase.auth.token', JSON.stringify({
          access_token: 'expired-token',
          refresh_token: 'expired-refresh',
          expires_at: Date.now() / 1000 - 3600, // Expired 1 hour ago
          user: {
            id: 'test-user-id',
            email: 'test@example.com'
          }
        }))
      `
    })

    // Try to access protected route
    await page.goto('/today')

    // Should redirect to login due to expired session
    await page.waitForURL('**/login')
    expect(page.url()).toContain('/login')
  })

  test('should handle API routes correctly', async ({ page }) => {
    // API routes should not be affected by middleware
    const response = await page.request.get('/api/test-db')
    expect([200, 404, 500]).toContain(response.status())
  })

  test('should handle static assets correctly', async ({ page }) => {
    // Static assets should not be affected by middleware
    const response = await page.request.get('/favicon.ico')
    expect([200, 404]).toContain(response.status())
  })

  test('should handle Next.js internal routes correctly', async ({ page }) => {
    // Next.js internal routes should not be affected
    const response = await page.request.get('/_next/static/chunks/webpack.js')
    expect(response.status()).toBe(200)
  })

  test('should handle complex protected routes with sub-paths', async ({ page }) => {
    // Test settings sub-routes
    await page.goto('/settings/privacy')
    await page.waitForURL('**/login')
    expect(page.url()).toContain('/login')

    // Test with query parameters
    await page.goto('/today?date=2024-01-01')
    await page.waitForURL('**/login?redirectTo=%2Ftoday%3Fdate%3D2024-01-01')
    expect(page.url()).toContain('/login?redirectTo=%2Ftoday%3Fdate%3D2024-01-01')
  })

  test('should handle edge cases gracefully', async ({ page }) => {
    // Test root path variations
    await page.goto('/')
    expect(page.url()).toBe('http://localhost:3000/')

    // Test case sensitivity
    await page.goto('/TODAY')
    await page.waitForURL('**/login')
    expect(page.url()).toContain('/login')

    // Test with trailing slashes
    await page.goto('/today/')
    await page.waitForURL('**/login')
    expect(page.url()).toContain('/login')
  })
})
