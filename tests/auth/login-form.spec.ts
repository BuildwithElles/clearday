import { test, expect } from '@playwright/test'

test.describe('Login Form Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-login')
  })

  test('should render login form with all required fields', async ({ page }) => {
    // Check if the page loads with login form
    await expect(page.locator('h1')).toHaveText('Login Form Test')
    await expect(page.locator('form')).toBeVisible()
    
    // Check if all form fields are present
    await expect(page.locator('label').filter({ hasText: 'Email' })).toBeVisible()
    await expect(page.locator('label').filter({ hasText: 'Password' })).toBeVisible()
    
    // Check if inputs are present
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    
    // Check if submit button is present
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible()
  })

  test('should validate email format correctly', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    
    // Enter invalid email
    await emailInput.fill('invalid-email')
    await emailInput.blur()
    
    // Wait for validation message
    await expect(page.locator('p:has-text("Please enter a valid email address")')).toBeVisible()
    
    // Enter valid email
    await emailInput.fill('test@example.com')
    await emailInput.blur()
    
    // Check that validation error is gone
    await expect(page.locator('p:has-text("Please enter a valid email address")')).not.toBeVisible()
  })

  test('should validate password requirement correctly', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]')
    
    // Try to submit with empty password
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    
    // Wait for validation message
    await expect(page.locator('p:has-text("Password is required")')).toBeVisible()
    
    // Enter password
    await passwordInput.fill('password123')
    await passwordInput.blur()
    
    // Check that validation error is gone
    await expect(page.locator('p:has-text("Password is required")')).not.toBeVisible()
  })

  test('should handle form submission correctly', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // Fill form with valid data
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')
    
    // Submit form
    await submitButton.click()
    
    // Check that button shows loading state
    await expect(page.locator('button:has-text("Signing in...")')).toBeVisible()
    
    // Wait for submission to complete
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible({ timeout: 5000 })
  })

  test('should show loading state during submission', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // Fill form with valid data
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')
    
    // Submit form
    await submitButton.click()
    
    // Check loading state
    await expect(page.locator('button:has-text("Signing in...")')).toBeVisible()
    await expect(page.locator('div.w-4.h-4.border-2.border-white.border-t-transparent.rounded-full.animate-spin')).toBeVisible()
    
    // Wait for loading to complete
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible({ timeout: 5000 })
  })

  test('should handle form errors correctly', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    
    // Trigger validation errors
    await emailInput.fill('invalid-email')
    await emailInput.blur()
    await passwordInput.fill('')
    await passwordInput.blur()
    
    // Check that error messages are displayed
    await expect(page.locator('p:has-text("Please enter a valid email address")')).toBeVisible()
    
    // Submit to trigger password validation
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    
    await expect(page.locator('p:has-text("Password is required")')).toBeVisible()
  })

  test('should have proper form accessibility', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const emailLabel = page.locator('label').filter({ hasText: 'Email' })
    const passwordLabel = page.locator('label').filter({ hasText: 'Password' })
    
    // Check if labels are associated with inputs
    const emailLabelFor = await emailLabel.getAttribute('for')
    const emailInputId = await emailInput.getAttribute('id')
    const passwordLabelFor = await passwordLabel.getAttribute('for')
    const passwordInputId = await passwordInput.getAttribute('id')
    
    expect(emailLabelFor).toBe(emailInputId)
    expect(passwordLabelFor).toBe(passwordInputId)
    
    // Check input types
    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('should handle disabled state correctly', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // Fill form and submit to trigger loading state
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')
    await submitButton.click()
    
    // Check that inputs are disabled during submission
    await expect(emailInput).toBeDisabled()
    await expect(passwordInput).toBeDisabled()
    await expect(submitButton).toBeDisabled()
    
    // Wait for submission to complete
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible({ timeout: 5000 })
    
    // Check that inputs are enabled again
    await expect(emailInput).toBeEnabled()
    await expect(passwordInput).toBeEnabled()
    await expect(submitButton).toBeEnabled()
  })

  test('should validate form state correctly', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    
    // Initially form should be valid (empty but no validation triggered)
    await expect(page.locator('p:has-text("Please enter a valid email address")')).not.toBeVisible()
    await expect(page.locator('p:has-text("Password is required")')).not.toBeVisible()
    
    // Trigger validation by filling invalid data
    await emailInput.fill('invalid-email')
    await emailInput.blur()
    
    // Check that email error is shown
    await expect(page.locator('p:has-text("Please enter a valid email address")')).toBeVisible()
    
    // Fix email and trigger password validation
    await emailInput.fill('test@example.com')
    await emailInput.blur()
    await expect(page.locator('p:has-text("Please enter a valid email address")')).not.toBeVisible()
    
    // Submit to trigger password validation
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    
    await expect(page.locator('p:has-text("Password is required")')).toBeVisible()
  })

  test('should handle form reset correctly', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    
    // Fill some data
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')
    
    // Check if data is filled
    await expect(emailInput).toHaveValue('test@example.com')
    await expect(passwordInput).toHaveValue('password123')
    
    // Reload page to reset form
    await page.reload()
    
    // Check if form is reset
    await expect(emailInput).toHaveValue('')
    await expect(passwordInput).toHaveValue('')
  })

  test('should have proper form field structure', async ({ page }) => {
    // Check form structure - look for form items by their structure
    const formFields = page.locator('form > div') // FormField components
    await expect(formFields).toHaveCount(3) // email, password, and potentially a wrapper
    
    // Each field should have a label, input, and potentially message
    // Check the first two fields (email and password)
    for (let i = 0; i < 2; i++) {
      const field = formFields.nth(i)
      await expect(field.locator('label')).toBeVisible()
      await expect(field.locator('input')).toBeVisible()
    }
  })

  test('should have proper button styling', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]')
    
    await expect(submitButton).toBeVisible()
    await expect(submitButton).toHaveClass(/w-full/)
    
    // Button should be properly styled
    await expect(submitButton).toHaveClass(/bg-primary/)
  })

  test('should handle input focus states', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    
    // Focus the input
    await emailInput.focus()
    
    // Check if input is focused
    await expect(emailInput).toBeFocused()
  })

  test('should have responsive design', async ({ page }) => {
    // Test responsive design
    await page.setViewportSize({ width: 375, height: 667 }) // Mobile size
    
    // Check if form is still usable on mobile
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // Reset to desktop size
    await page.setViewportSize({ width: 1280, height: 720 })
  })

  test('should display test instructions', async ({ page }) => {
    // Check if test instructions are visible
    await expect(page.locator('h2:has-text("Test Instructions:")')).toBeVisible()
    await expect(page.locator('ul')).toBeVisible()
    
    // Check if instructions list items are present
    const instructions = page.locator('ul li')
    await expect(instructions).toHaveCount(5)
    
    // Check specific instruction content
    await expect(page.locator('li:has-text("Try submitting with empty fields")')).toBeVisible()
    await expect(page.locator('li:has-text("Enter invalid email format")')).toBeVisible()
    await expect(page.locator('li:has-text("Enter valid data and submit")')).toBeVisible()
    await expect(page.locator('li:has-text("Check validation messages")')).toBeVisible()
    await expect(page.locator('li:has-text("Verify loading states")')).toBeVisible()
  })
})
