import { test, expect } from '@playwright/test'

test.describe('Signup Form Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup')
  })

  test('should render signup form with all required fields', async ({ page }) => {
    // Check if the page loads with signup form
    await expect(page.locator('h2')).toHaveText('Create your account')
    await expect(page.locator('form')).toBeVisible()
    
    // Check if all form fields are present
    await expect(page.locator('label').filter({ hasText: 'Full Name' })).toBeVisible()
    await expect(page.locator('label').filter({ hasText: 'Email' })).toBeVisible()
    await expect(page.locator('label').filter({ hasText: 'Password' })).toBeVisible()
    await expect(page.locator('label').filter({ hasText: 'Confirm Password' })).toBeVisible()
    
    // Check if inputs are present
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toHaveCount(2)
    
    // Check if checkbox is present
    await expect(page.locator('input[type="checkbox"]')).toBeVisible()
    
    // Check if submit button is present
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    await expect(page.locator('button:has-text("Create Account")')).toBeVisible()
  })

  test('should validate full name requirement correctly', async ({ page }) => {
    const fullNameInput = page.locator('input[type="text"]')
    
    // Try to submit with empty full name
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    
    // Wait for validation message
    await expect(page.locator('p:has-text("Full name is required")')).toBeVisible()
    
    // Enter full name
    await fullNameInput.fill('John Doe')
    await fullNameInput.blur()
    
    // Check that validation error is gone
    await expect(page.locator('p:has-text("Full name is required")')).not.toBeVisible()
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

  test('should validate password length requirement correctly', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first()
    
    // Enter short password
    await passwordInput.fill('123')
    await passwordInput.blur()
    
    // Wait for validation message
    await expect(page.locator('p:has-text("Password must be at least 8 characters")')).toBeVisible()
    
    // Enter valid password
    await passwordInput.fill('password123')
    await passwordInput.blur()
    
    // Check that validation error is gone
    await expect(page.locator('p:has-text("Password must be at least 8 characters")')).not.toBeVisible()
  })

  test('should validate password match correctly', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first()
    const confirmPasswordInput = page.locator('input[type="password"]').nth(1)
    
    // Fill password fields with different values
    await passwordInput.fill('password123')
    await confirmPasswordInput.fill('different123')
    await confirmPasswordInput.blur()
    
    // Wait for validation message
    await expect(page.locator('p:has-text("Passwords don\'t match")')).toBeVisible()
    
    // Make passwords match
    await confirmPasswordInput.fill('password123')
    await confirmPasswordInput.blur()
    
    // Check that validation error is gone
    await expect(page.locator('p:has-text("Passwords don\'t match")')).not.toBeVisible()
  })

  test('should validate terms acceptance correctly', async ({ page }) => {
    const termsCheckbox = page.locator('input[type="checkbox"]')
    
    // Try to submit without accepting terms
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    
    // Wait for validation message
    await expect(page.locator('p:has-text("You must accept the terms and conditions")')).toBeVisible()
    
    // Accept terms
    await termsCheckbox.check()
    
    // Check that validation error is gone
    await expect(page.locator('p:has-text("You must accept the terms and conditions")')).not.toBeVisible()
  })

  test('should handle form submission correctly', async ({ page }) => {
    const fullNameInput = page.locator('input[type="text"]')
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]').first()
    const confirmPasswordInput = page.locator('input[type="password"]').nth(1)
    const termsCheckbox = page.locator('input[type="checkbox"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // Fill form with valid data
    await fullNameInput.fill('John Doe')
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')
    await confirmPasswordInput.fill('password123')
    await termsCheckbox.check()
    
    // Submit form
    await submitButton.click()
    
    // Check that button shows loading state
    await expect(page.locator('button:has-text("Creating account...")')).toBeVisible()
    
    // Wait for submission to complete
    await expect(page.locator('button:has-text("Create Account")')).toBeVisible({ timeout: 5000 })
  })

  test('should show loading state during submission', async ({ page }) => {
    const fullNameInput = page.locator('input[type="text"]')
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]').first()
    const confirmPasswordInput = page.locator('input[type="password"]').nth(1)
    const termsCheckbox = page.locator('input[type="checkbox"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // Fill form with valid data
    await fullNameInput.fill('John Doe')
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')
    await confirmPasswordInput.fill('password123')
    await termsCheckbox.check()
    
    // Submit form
    await submitButton.click()
    
    // Check loading state
    await expect(page.locator('button:has-text("Creating account...")')).toBeVisible()
    await expect(page.locator('div.w-4.h-4.border-2.border-white.border-t-transparent.rounded-full.animate-spin')).toBeVisible()
    
    // Wait for loading to complete
    await expect(page.locator('button:has-text("Create Account")')).toBeVisible({ timeout: 5000 })
  })

  test('should handle form errors correctly', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]')
    
    // Submit without filling any fields to trigger all validations
    await submitButton.click()
    
    // Check that all validation errors are displayed
    await expect(page.locator('p:has-text("Full name is required")')).toBeVisible()
    await expect(page.locator('p:has-text("Please enter a valid email address")')).toBeVisible()
    await expect(page.locator('p:has-text("Password must be at least 8 characters")')).toBeVisible()
    await expect(page.locator('p:has-text("Please confirm your password")')).toBeVisible()
    await expect(page.locator('p:has-text("You must accept the terms and conditions")')).toBeVisible()
  })

  test('should have proper form accessibility', async ({ page }) => {
    const fullNameInput = page.locator('input[type="text"]')
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]').first()
    const confirmPasswordInput = page.locator('input[type="password"]').nth(1)
    const termsCheckbox = page.locator('input[type="checkbox"]')
    
    // Check input types
    await expect(fullNameInput).toHaveAttribute('type', 'text')
    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(passwordInput).toHaveAttribute('type', 'password')
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password')
    await expect(termsCheckbox).toHaveAttribute('type', 'checkbox')
    
    // Check if password description is visible
    await expect(page.locator('p:has-text("Password must be at least 8 characters long")')).toBeVisible()
  })

  test('should handle disabled state correctly', async ({ page }) => {
    const fullNameInput = page.locator('input[type="text"]')
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]').first()
    const confirmPasswordInput = page.locator('input[type="password"]').nth(1)
    const termsCheckbox = page.locator('input[type="checkbox"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // Fill form and submit to trigger loading state
    await fullNameInput.fill('John Doe')
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')
    await confirmPasswordInput.fill('password123')
    await termsCheckbox.check()
    await submitButton.click()
    
    // Check that inputs are disabled during submission
    await expect(fullNameInput).toBeDisabled()
    await expect(emailInput).toBeDisabled()
    await expect(passwordInput).toBeDisabled()
    await expect(confirmPasswordInput).toBeDisabled()
    await expect(termsCheckbox).toBeDisabled()
    await expect(submitButton).toBeDisabled()
    
    // Wait for submission to complete
    await expect(page.locator('button:has-text("Create Account")')).toBeVisible({ timeout: 5000 })
    
    // Check that inputs are enabled again
    await expect(fullNameInput).toBeEnabled()
    await expect(emailInput).toBeEnabled()
    await expect(passwordInput).toBeEnabled()
    await expect(confirmPasswordInput).toBeEnabled()
    await expect(termsCheckbox).toBeEnabled()
    await expect(submitButton).toBeEnabled()
  })

  test('should validate form state correctly', async ({ page }) => {
    const fullNameInput = page.locator('input[type="text"]')
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]').first()
    const confirmPasswordInput = page.locator('input[type="password"]').nth(1)
    const termsCheckbox = page.locator('input[type="checkbox"]')
    
    // Initially form should be invalid (empty fields)
    await expect(page.locator('p:has-text("Full name is required")')).not.toBeVisible()
    await expect(page.locator('p:has-text("Please enter a valid email address")')).not.toBeVisible()
    await expect(page.locator('p:has-text("Password must be at least 8 characters")')).not.toBeVisible()
    await expect(page.locator('p:has-text("Please confirm your password")')).not.toBeVisible()
    await expect(page.locator('p:has-text("You must accept the terms and conditions")')).not.toBeVisible()
    
    // Fill form partially to test validation
    await fullNameInput.fill('John Doe')
    await fullNameInput.blur()
    await expect(page.locator('p:has-text("Full name is required")')).not.toBeVisible()
    
    await emailInput.fill('invalid-email')
    await emailInput.blur()
    await expect(page.locator('p:has-text("Please enter a valid email address")')).toBeVisible()
    
    // Fix email and test password validation
    await emailInput.fill('test@example.com')
    await emailInput.blur()
    await expect(page.locator('p:has-text("Please enter a valid email address")')).not.toBeVisible()
    
    await passwordInput.fill('123')
    await passwordInput.blur()
    await expect(page.locator('p:has-text("Password must be at least 8 characters")')).toBeVisible()
    
    // Fix password and test confirm password
    await passwordInput.fill('password123')
    await passwordInput.blur()
    await expect(page.locator('p:has-text("Password must be at least 8 characters")')).not.toBeVisible()
    
    await confirmPasswordInput.fill('different123')
    await confirmPasswordInput.blur()
    await expect(page.locator('p:has-text("Passwords don\'t match")')).toBeVisible()
    
    // Fix confirm password and test terms
    await confirmPasswordInput.fill('password123')
    await confirmPasswordInput.blur()
    await expect(page.locator('p:has-text("Passwords don\'t match")')).not.toBeVisible()
    
    // Submit to trigger terms validation
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    
    await expect(page.locator('p:has-text("You must accept the terms and conditions")')).toBeVisible()
  })

  test('should handle form reset correctly', async ({ page }) => {
    const fullNameInput = page.locator('input[type="text"]')
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]').first()
    const confirmPasswordInput = page.locator('input[type="password"]').nth(1)
    const termsCheckbox = page.locator('input[type="checkbox"]')
    
    // Fill some data
    await fullNameInput.fill('John Doe')
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')
    await confirmPasswordInput.fill('password123')
    await termsCheckbox.check()
    
    // Check if data is filled
    await expect(fullNameInput).toHaveValue('John Doe')
    await expect(emailInput).toHaveValue('test@example.com')
    await expect(passwordInput).toHaveValue('password123')
    await expect(confirmPasswordInput).toHaveValue('password123')
    await expect(termsCheckbox).toBeChecked()
    
    // Reload page to reset form
    await page.reload()
    
    // Check if form is reset
    await expect(fullNameInput).toHaveValue('')
    await expect(emailInput).toHaveValue('')
    await expect(passwordInput).toHaveValue('')
    await expect(confirmPasswordInput).toHaveValue('')
    await expect(termsCheckbox).not.toBeChecked()
  })

  test('should have proper form field structure', async ({ page }) => {
    // Check form structure - look for form items by their structure
    const formFields = page.locator('form > div') // FormField components
    await expect(formFields).toHaveCount(6) // fullName, email, password, confirmPassword, terms, submit button
    
    // Each field should have a label, input, and potentially message
    // Check the first four fields (fullName, email, password, confirmPassword)
    for (let i = 0; i < 4; i++) {
      const field = formFields.nth(i)
      await expect(field.locator('label')).toBeVisible()
      await expect(field.locator('input')).toBeVisible()
    }
    
    // Check terms field structure
    const termsField = formFields.nth(4)
    await expect(termsField.locator('input[type="checkbox"]')).toBeVisible()
    await expect(termsField.locator('label')).toBeVisible()
  })

  test('should have proper button styling', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]')
    
    await expect(submitButton).toBeVisible()
    await expect(submitButton).toHaveClass(/w-full/)
    
    // Button should be properly styled
    await expect(submitButton).toHaveClass(/bg-primary/)
  })

  test('should handle input focus states', async ({ page }) => {
    const fullNameInput = page.locator('input[type="text"]')
    
    // Focus the input
    await fullNameInput.focus()
    
    // Check if input is focused
    await expect(fullNameInput).toBeFocused()
  })

  test('should have responsive design', async ({ page }) => {
    // Test responsive design
    await page.setViewportSize({ width: 375, height: 667 }) // Mobile size
    
    // Check if form is still usable on mobile
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // Reset to desktop size
    await page.setViewportSize({ width: 1280, height: 720 })
  })

  test('should display terms and privacy links correctly', async ({ page }) => {
    // Check if terms and privacy links are visible
    await expect(page.locator('a[href="/terms"]')).toBeVisible()
    await expect(page.locator('a[href="/privacy"]')).toBeVisible()
    
    // Check link text
    await expect(page.locator('a[href="/terms"]')).toHaveText('Terms and Conditions')
    await expect(page.locator('a[href="/privacy"]')).toHaveText('Privacy Policy')
    
    // Check if links open in new tab
    await expect(page.locator('a[href="/terms"]')).toHaveAttribute('target', '_blank')
    await expect(page.locator('a[href="/privacy"]')).toHaveAttribute('target', '_blank')
  })

  test('should handle password description correctly', async ({ page }) => {
    // Check if password description is visible
    const passwordDescription = page.locator('p:has-text("Password must be at least 8 characters long")')
    await expect(passwordDescription).toBeVisible()
    
    // Check that description has proper styling
    await expect(passwordDescription).toHaveClass(/text-muted-foreground/)
  })

  test('should validate all fields together', async ({ page }) => {
    const fullNameInput = page.locator('input[type="text"]')
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]').first()
    const confirmPasswordInput = page.locator('input[type="password"]').nth(1)
    const termsCheckbox = page.locator('input[type="checkbox"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // Fill form with valid data
    await fullNameInput.fill('John Doe')
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')
    await confirmPasswordInput.fill('password123')
    await termsCheckbox.check()
    
    // Submit form
    await submitButton.click()
    
    // Check that no validation errors are shown
    await expect(page.locator('p:has-text("Full name is required")')).not.toBeVisible()
    await expect(page.locator('p:has-text("Please enter a valid email address")')).not.toBeVisible()
    await expect(page.locator('p:has-text("Password must be at least 8 characters")')).not.toBeVisible()
    await expect(page.locator('p:has-text("Please confirm your password")')).not.toBeVisible()
    await expect(page.locator('p:has-text("You must accept the terms and conditions")')).not.toBeVisible()
    await expect(page.locator('p:has-text("Passwords don\'t match")')).not.toBeVisible()
    
    // Check loading state
    await expect(page.locator('button:has-text("Creating account...")')).toBeVisible()
  })
})
