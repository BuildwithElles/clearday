import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login page title and branding', async ({ page }) => {
    // Check ClearDay logo/brand in the main content area
    await expect(page.locator('main a[href="/"]:has-text("ClearDay")')).toBeVisible()
    
    // Check main heading
    await expect(page.locator('h2')).toHaveText('Sign in to your account')
    
    // Check subtitle with signup link
    await expect(page.locator('p:has-text("Or create a new account")')).toBeVisible()
  })

  test('should have email input field', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    
    await expect(emailInput).toBeVisible()
    await expect(emailInput).toHaveAttribute('name', 'email')
    await expect(emailInput).toHaveAttribute('id', 'email')
    await expect(emailInput).toHaveAttribute('required')
    await expect(emailInput).toHaveAttribute('autocomplete', 'email')
    await expect(emailInput).toHaveAttribute('placeholder', 'Enter your email')
    
    // Check label
    await expect(page.locator('label[for="email"]')).toHaveText('Email address')
  })

  test('should have password input field', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]')
    
    await expect(passwordInput).toBeVisible()
    await expect(passwordInput).toHaveAttribute('name', 'password')
    await expect(passwordInput).toHaveAttribute('id', 'password')
    await expect(passwordInput).toHaveAttribute('required')
    await expect(passwordInput).toHaveAttribute('autocomplete', 'current-password')
    await expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password')
    
    // Check label
    await expect(page.locator('label[for="password"]')).toHaveText('Password')
  })

  test('should have remember me checkbox', async ({ page }) => {
    const rememberCheckbox = page.locator('input[type="checkbox"]')
    
    await expect(rememberCheckbox).toBeVisible()
    await expect(rememberCheckbox).toHaveAttribute('name', 'remember-me')
    await expect(rememberCheckbox).toHaveAttribute('id', 'remember-me')
    
    // Check label
    await expect(page.locator('label[for="remember-me"]')).toHaveText('Remember me')
  })

  test('should have forgot password link', async ({ page }) => {
    const forgotPasswordLink = page.locator('a[href="/forgot-password"]')
    
    await expect(forgotPasswordLink).toBeVisible()
    await expect(forgotPasswordLink).toHaveText('Forgot your password?')
  })

  test('should have sign in button', async ({ page }) => {
    const signInButton = page.locator('button[type="submit"]')
    
    await expect(signInButton).toBeVisible()
    await expect(signInButton).toHaveText('Sign in')
    await expect(signInButton).toHaveClass(/w-full/)
  })

  test('should have social login options', async ({ page }) => {
    // Check "Or continue with" divider
    await expect(page.locator('span:has-text("Or continue with")')).toBeVisible()
    
    // Check Google button
    const googleButton = page.locator('button:has-text("Google")')
    await expect(googleButton).toBeVisible()
    await expect(googleButton).toHaveClass(/outline/)
    
    // Check Twitter button
    const twitterButton = page.locator('button:has-text("Twitter")')
    await expect(twitterButton).toBeVisible()
    await expect(twitterButton).toHaveClass(/outline/)
  })

  test('should have working signup link', async ({ page }) => {
    const signupLink = page.locator('a[href="/signup"]')
    
    await expect(signupLink).toBeVisible()
    await expect(signupLink).toHaveText('create a new account')
    
    // Test navigation
    await signupLink.click()
    await expect(page).toHaveURL('/signup')
  })

  test('should have working home link', async ({ page }) => {
    const homeLink = page.locator('main a[href="/"]:has-text("ClearDay")')
    
    await expect(homeLink).toBeVisible()
    await expect(homeLink).toHaveText('ClearDay')
    
    // Test navigation
    await homeLink.click()
    await expect(page).toHaveURL('/')
  })

  test('should have proper form structure', async ({ page }) => {
    const form = page.locator('form')
    
    await expect(form).toBeVisible()
    await expect(form).toHaveAttribute('method', 'POST')
    await expect(form).toHaveAttribute('action', '#')
    
    // Check form has proper spacing
    await expect(form).toHaveClass(/space-y-6/)
  })

  test('should have responsive design elements', async ({ page }) => {
    // Check responsive classes on the main content container
    await expect(page.locator('main .sm\\:mx-auto').first()).toBeVisible()
    await expect(page.locator('main .sm\\:w-full').first()).toBeVisible()
    await expect(page.locator('main .sm\\:max-w-md').first()).toBeVisible()
    await expect(page.locator('main .lg\\:px-8')).toBeVisible()
  })

  test('should have proper card styling', async ({ page }) => {
    const card = page.locator('main .bg-card:has(.px-4)')
    
    await expect(card).toBeVisible()
    await expect(card).toHaveClass(/shadow/)
    await expect(card).toHaveClass(/rounded-lg/)
  })

  test('should have proper input styling', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    
    // Check both inputs have consistent styling
    await expect(emailInput).toHaveClass(/w-full/)
    await expect(passwordInput).toHaveClass(/w-full/)
  })

  test('should have proper button styling', async ({ page }) => {
    const signInButton = page.locator('button[type="submit"]')
    
    await expect(signInButton).toHaveClass(/w-full/)
    // Check for h-11 which is equivalent to size-lg
    await expect(signInButton).toHaveClass(/h-11/)
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check form inputs have proper labels
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const rememberCheckbox = page.locator('input[type="checkbox"]')
    
    await expect(emailInput).toHaveAttribute('id')
    await expect(passwordInput).toHaveAttribute('id')
    await expect(rememberCheckbox).toHaveAttribute('id')
    
    // Check labels are properly associated
    const emailLabel = page.locator('label[for="email"]')
    const passwordLabel = page.locator('label[for="password"]')
    const rememberLabel = page.locator('label[for="remember-me"]')
    
    await expect(emailLabel).toBeVisible()
    await expect(passwordLabel).toBeVisible()
    await expect(rememberLabel).toBeVisible()
  })
})
