import { test, expect } from '@playwright/test'

test.describe('Auth Layout', () => {
  test('should render auth layout with centered content', async ({ page }) => {
    // Navigate to a route that uses the auth layout
    await page.goto('/login')
    
    // Check that the layout structure is present
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
    
    // Verify the main content is centered
    const mainElement = page.locator('main')
    await expect(mainElement).toHaveClass(/flex items-center justify-center/)
  })

  test('should display ClearDay logo and branding', async ({ page }) => {
    await page.goto('/login')
    
    // Check logo is present and centered
    const logo = page.locator('header a[href="/"]')
    await expect(logo).toBeVisible()
    
    // Check logo icon (CD)
    const logoIcon = page.locator('header .w-10.h-10')
    await expect(logoIcon).toBeVisible()
    await expect(logoIcon).toHaveClass(/bg-gradient-to-br from-blue-500 to-purple-600/)
    
    // Check ClearDay text
    const logoText = page.locator('header span:has-text("ClearDay")')
    await expect(logoText).toBeVisible()
    await expect(logoText).toHaveText('ClearDay')
  })

  test('should have responsive design', async ({ page }) => {
    await page.goto('/login')
    
    // Test desktop layout
    await page.setViewportSize({ width: 1200, height: 800 })
    const authCard = page.locator('main .bg-white.rounded-xl')
    await expect(authCard).toBeVisible()
    
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(authCard).toBeVisible()
    
    // Verify content is still centered on mobile
    const mainElement = page.locator('main')
    await expect(mainElement).toHaveClass(/flex items-center justify-center/)
  })

  test('should have proper background and styling', async ({ page }) => {
    await page.goto('/login')
    
    // Check background gradient (the gradient is applied to the main container, not body)
    const mainContainer = page.locator('main').locator('xpath=..')
    await expect(mainContainer).toHaveClass(/bg-gradient-to-br from-slate-50 to-blue-50/)
    
    // Check auth card styling
    const authCard = page.locator('main .bg-white.rounded-xl')
    await expect(authCard).toHaveClass(/shadow-lg/)
    await expect(authCard).toHaveClass(/border border-slate-200/)
    await expect(authCard).toHaveClass(/p-8/)
  })

  test('should have back to home link', async ({ page }) => {
    await page.goto('/login')
    
    const backLink = page.locator('a:has-text("Back to home")')
    await expect(backLink).toBeVisible()
    await expect(backLink).toHaveAttribute('href', '/')
    await expect(backLink).toHaveClass(/text-slate-600/)
  })

  test('should have footer with copyright', async ({ page }) => {
    await page.goto('/login')
    
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    
    const copyright = page.locator('footer p')
    await expect(copyright).toBeVisible()
    await expect(copyright).toContainText('© 2024 ClearDay')
    await expect(copyright).toContainText('Your day, already sorted')
  })

  test('should work with signup page', async ({ page }) => {
    await page.goto('/signup')
    
    // Verify same layout elements are present
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
    
    // Check logo is present
    const logo = page.locator('header a[href="/"]')
    await expect(logo).toBeVisible()
    
    // Check auth card is present
    const authCard = page.locator('main .bg-white.rounded-xl')
    await expect(authCard).toBeVisible()
  })

  test('should have proper header styling', async ({ page }) => {
    await page.goto('/login')
    
    const header = page.locator('header')
    await expect(header).toHaveClass(/border-b/)
    await expect(header).toHaveClass(/bg-white\/80/)
    await expect(header).toHaveClass(/backdrop-blur-sm/)
  })

  test('should have proper footer styling', async ({ page }) => {
    await page.goto('/login')
    
    const footer = page.locator('footer')
    await expect(footer).toHaveClass(/border-t/)
    await expect(footer).toHaveClass(/bg-white\/80/)
    await expect(footer).toHaveClass(/backdrop-blur-sm/)
  })

  test('should maintain layout structure on different screen sizes', async ({ page }) => {
    await page.goto('/login')
    
    // Test various screen sizes
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 1024, height: 768 },  // Tablet
      { width: 768, height: 1024 },  // Tablet Portrait
      { width: 375, height: 667 },   // Mobile
      { width: 320, height: 568 }    // Small Mobile
    ]
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      
      // Verify essential elements are always visible
      await expect(page.locator('header')).toBeVisible()
      await expect(page.locator('main')).toBeVisible()
      await expect(page.locator('footer')).toBeVisible()
      await expect(page.locator('main .bg-white.rounded-xl')).toBeVisible()
    }
  })
})
