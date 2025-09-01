import { test, expect } from '@playwright/test'

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup')
  })

  test('should display signup page title and branding', async ({ page }) => {
    // Check ClearDay logo/brand in the main content area
    await expect(page.locator('main a[href="/"]:has-text("ClearDay")')).toBeVisible()
    
    // Check main heading
    await expect(page.locator('h2')).toHaveText('Create your account')
    
    // Check subtitle with login link
    await expect(page.locator('p:has-text("Or sign in to your existing account")')).toBeVisible()
  })

  test('should have full name input field', async ({ page }) => {
    const fullNameInput = page.locator('input[name="fullName"]')
    
    await expect(fullNameInput).toBeVisible()
    await expect(fullNameInput).toHaveAttribute('type', 'text')
    await expect(fullNameInput).toHaveAttribute('id', 'fullName')
    await expect(fullNameInput).toHaveAttribute('required')
    await expect(fullNameInput).toHaveAttribute('autocomplete', 'name')
    await expect(fullNameInput).toHaveAttribute('placeholder', 'Enter your full name')
    
    // Check label
    await expect(page.locator('label[for="fullName"]')).toHaveText('Full Name')
  })

  test('should have email input field', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]')
    
    await expect(emailInput).toBeVisible()
    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(emailInput).toHaveAttribute('id', 'email')
    await expect(emailInput).toHaveAttribute('required')
    await expect(emailInput).toHaveAttribute('autocomplete', 'email')
    await expect(emailInput).toHaveAttribute('placeholder', 'Enter your email')
    
    // Check label
    await expect(page.locator('label[for="email"]')).toHaveText('Email address')
  })

  test('should have password input field', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]')
    
    await expect(passwordInput).toBeVisible()
    await expect(passwordInput).toHaveAttribute('type', 'password')
    await expect(passwordInput).toHaveAttribute('id', 'password')
    await expect(passwordInput).toHaveAttribute('required')
    await expect(passwordInput).toHaveAttribute('autocomplete', 'new-password')
    await expect(passwordInput).toHaveAttribute('placeholder', 'Create a password')
    
    // Check label
    await expect(page.locator('label[for="password"]')).toHaveText('Password')
    
    // Check password requirements text
    await expect(page.locator('p:has-text("Must be at least 8 characters long")')).toBeVisible()
  })

  test('should have confirm password input field', async ({ page }) => {
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]')
    
    await expect(confirmPasswordInput).toBeVisible()
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password')
    await expect(confirmPasswordInput).toHaveAttribute('id', 'confirmPassword')
    await expect(confirmPasswordInput).toHaveAttribute('required')
    await expect(confirmPasswordInput).toHaveAttribute('autocomplete', 'new-password')
    await expect(confirmPasswordInput).toHaveAttribute('placeholder', 'Confirm your password')
    
    // Check label
    await expect(page.locator('label[for="confirmPassword"]')).toHaveText('Confirm Password')
  })

  test('should have terms and conditions checkbox', async ({ page }) => {
    const termsCheckbox = page.locator('input[name="terms"]')
    
    await expect(termsCheckbox).toBeVisible()
    await expect(termsCheckbox).toHaveAttribute('type', 'checkbox')
    await expect(termsCheckbox).toHaveAttribute('id', 'terms')
    await expect(termsCheckbox).toHaveAttribute('required')
    
    // Check label
    await expect(page.locator('label[for="terms"]')).toContainText('I agree to the')
    await expect(page.locator('label[for="terms"]')).toContainText('Terms of Service')
    await expect(page.locator('label[for="terms"]')).toContainText('Privacy Policy')
  })

  test('should have working terms of service link', async ({ page }) => {
    const termsLink = page.locator('a[href="/terms"]')
    
    await expect(termsLink).toBeVisible()
    await expect(termsLink).toHaveText('Terms of Service')
    
    // Test navigation
    await termsLink.click()
    await expect(page).toHaveURL('/terms')
  })

  test('should have working privacy policy link', async ({ page }) => {
    const privacyLink = page.locator('a[href="/privacy"]')
    
    await expect(privacyLink).toBeVisible()
    await expect(privacyLink).toHaveText('Privacy Policy')
    
    // Test navigation
    await privacyLink.click()
    await expect(page).toHaveURL('/privacy')
  })

  test('should have create account button', async ({ page }) => {
    const createAccountButton = page.locator('button[type="submit"]')
    
    await expect(createAccountButton).toBeVisible()
    await expect(createAccountButton).toHaveText('Create Account')
    await expect(createAccountButton).toHaveClass(/w-full/)
  })

  test('should have social signup options', async ({ page }) => {
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

  test('should have working login link', async ({ page }) => {
    const loginLink = page.locator('a[href="/login"]')
    
    await expect(loginLink).toBeVisible()
    await expect(loginLink).toHaveText('sign in to your existing account')
    
    // Test navigation
    await loginLink.click()
    await expect(page).toHaveURL('/login')
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
    const fullNameInput = page.locator('input[name="fullName"]')
    const emailInput = page.locator('input[name="email"]')
    const passwordInput = page.locator('input[name="password"]')
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]')
    
    // Check all inputs have consistent styling
    await expect(fullNameInput).toHaveClass(/w-full/)
    await expect(emailInput).toHaveClass(/w-full/)
    await expect(passwordInput).toHaveClass(/w-full/)
    await expect(confirmPasswordInput).toHaveClass(/w-full/)
  })

  test('should have proper button styling', async ({ page }) => {
    const createAccountButton = page.locator('button[type="submit"]')
    
    await expect(createAccountButton).toHaveClass(/w-full/)
    // Check for h-11 which is equivalent to size-lg
    await expect(createAccountButton).toHaveClass(/h-11/)
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check form inputs have proper labels
    const fullNameInput = page.locator('input[name="fullName"]')
    const emailInput = page.locator('input[name="email"]')
    const passwordInput = page.locator('input[name="password"]')
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]')
    const termsCheckbox = page.locator('input[name="terms"]')
    
    await expect(fullNameInput).toHaveAttribute('id')
    await expect(emailInput).toHaveAttribute('id')
    await expect(passwordInput).toHaveAttribute('id')
    await expect(confirmPasswordInput).toHaveAttribute('id')
    await expect(termsCheckbox).toHaveAttribute('id')
    
    // Check labels are properly associated
    const fullNameLabel = page.locator('label[for="fullName"]')
    const emailLabel = page.locator('label[for="email"]')
    const passwordLabel = page.locator('label[for="password"]')
    const confirmPasswordLabel = page.locator('label[for="confirmPassword"]')
    const termsLabel = page.locator('label[for="terms"]')
    
    await expect(fullNameLabel).toBeVisible()
    await expect(emailLabel).toBeVisible()
    await expect(passwordLabel).toBeVisible()
    await expect(confirmPasswordLabel).toBeVisible()
    await expect(termsLabel).toBeVisible()
  })

  test('should have form validation attributes', async ({ page }) => {
    // Check required attributes
    const fullNameInput = page.locator('input[name="fullName"]')
    const emailInput = page.locator('input[name="email"]')
    const passwordInput = page.locator('input[name="password"]')
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]')
    const termsCheckbox = page.locator('input[name="terms"]')
    
    await expect(fullNameInput).toHaveAttribute('required')
    await expect(emailInput).toHaveAttribute('required')
    await expect(passwordInput).toHaveAttribute('required')
    await expect(confirmPasswordInput).toHaveAttribute('required')
    await expect(termsCheckbox).toHaveAttribute('required')
  })

  test('should have proper autocomplete attributes', async ({ page }) => {
    const fullNameInput = page.locator('input[name="fullName"]')
    const emailInput = page.locator('input[name="email"]')
    const passwordInput = page.locator('input[name="password"]')
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]')
    
    await expect(fullNameInput).toHaveAttribute('autocomplete', 'name')
    await expect(emailInput).toHaveAttribute('autocomplete', 'email')
    await expect(passwordInput).toHaveAttribute('autocomplete', 'new-password')
    await expect(confirmPasswordInput).toHaveAttribute('autocomplete', 'new-password')
  })
})
