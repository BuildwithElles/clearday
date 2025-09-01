import { test, expect } from '@playwright/test'

test.describe('Form Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-forms')
  })

  test('should display form components correctly', async ({ page }) => {
    // Check if the page loads with form components
    await expect(page.locator('h1')).toHaveText('Form Components Test')
    await expect(page.locator('form')).toBeVisible()
  })

  test('should have all required form fields', async ({ page }) => {
    // Check if all form fields are present using more specific selectors
    await expect(page.locator('label').filter({ hasText: 'Email' })).toBeVisible()
    await expect(page.locator('label').filter({ hasText: 'Password' }).first()).toBeVisible()
    await expect(page.locator('label').filter({ hasText: 'Confirm Password' })).toBeVisible()
    
    // Check if inputs are present
    await expect(page.locator('input[placeholder="Enter your email"]')).toBeVisible()
    await expect(page.locator('input[placeholder="Enter your password"]')).toBeVisible()
    await expect(page.locator('input[placeholder="Confirm your password"]')).toBeVisible()
  })

  test('should have form descriptions', async ({ page }) => {
    // Check if form descriptions are displayed
    await expect(page.locator('p:has-text("We\'ll never share your email with anyone else.")')).toBeVisible()
    await expect(page.locator('p:has-text("Password must be at least 8 characters long.")')).toBeVisible()
  })

  test('should have submit button', async ({ page }) => {
    // Check if submit button is present
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    await expect(page.locator('button:has-text("Submit")')).toBeVisible()
  })

  test('should handle form validation - email format', async ({ page }) => {
    // Test email validation
    const emailInput = page.locator('input[placeholder="Enter your email"]')
    
    // Enter invalid email
    await emailInput.fill('invalid-email')
    await emailInput.blur()
    
    // Wait for validation message
    await expect(page.locator('p:has-text("Invalid email address")')).toBeVisible()
  })

  test('should handle form validation - password length', async ({ page }) => {
    // Test password validation
    const passwordInput = page.locator('input[placeholder="Enter your password"]')
    
    // Enter short password
    await passwordInput.fill('123')
    await passwordInput.blur()
    
    // Wait for validation message - look for the error message specifically
    // Wait for validation message - look for the error message specifically
    await expect(page.locator('p:has-text("Password must be at least 8 characters")').filter({ hasClass: 'text-destructive' })).toBeVisible()
  })

  test('should handle form validation - password match', async ({ page }) => {
    // Test password confirmation validation
    const passwordInput = page.locator('input[placeholder="Enter your password"]')
    const confirmInput = page.locator('input[placeholder="Confirm your password"]')
    
    // Enter different passwords
    await passwordInput.fill('password123')
    await confirmInput.fill('different123')
    await confirmInput.blur()
    
    // Wait for validation message
    await expect(page.locator('p:has-text("Passwords don\'t match")')).toBeVisible()
  })

  test('should accept valid form data', async ({ page }) => {
    // Test valid form submission
    const emailInput = page.locator('input[placeholder="Enter your email"]')
    const passwordInput = page.locator('input[placeholder="Enter your password"]')
    const confirmInput = page.locator('input[placeholder="Confirm your password"]')
    
    // Fill form with valid data
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')
    await confirmInput.fill('password123')
    
    // Check that no validation errors are shown
    await expect(page.locator('p:has-text("Invalid email address")')).not.toBeVisible()
    await expect(page.locator('p:has-text("Password must be at least 8 characters")')).not.toBeVisible()
    await expect(page.locator('p:has-text("Passwords don\'t match")')).not.toBeVisible()
  })

  test('should display form state information', async ({ page }) => {
    // Check if form state section is visible
    await expect(page.locator('h2:has-text("Form State:")')).toBeVisible()
    await expect(page.locator('pre')).toBeVisible()
  })

  test('should have proper form structure', async ({ page }) => {
    // Check form structure - look for form items by their structure
    const formItems = page.locator('form > div') // FormField components
    await expect(formItems).toHaveCount(3) // email, password, confirmPassword
    
    // Check if form has proper spacing
    const form = page.locator('form')
    await expect(form).toHaveClass(/space-y-6/)
  })

  test('should handle input focus states', async ({ page }) => {
    // Test input focus behavior
    const emailInput = page.locator('input[placeholder="Enter your email"]')
    
    // Focus the input
    await emailInput.focus()
    
    // Check if input is focused
    await expect(emailInput).toBeFocused()
  })

  test('should handle form submission', async ({ page }) => {
    // Test form submission (will log to console)
    const emailInput = page.locator('input[placeholder="Enter your email"]')
    const passwordInput = page.locator('input[placeholder="Enter your password"]')
    const confirmInput = page.locator('input[placeholder="Confirm your password"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // Fill form with valid data
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')
    await confirmInput.fill('password123')
    
    // Submit form
    await submitButton.click()
    
    // Form should submit without errors
    await expect(page.locator('form')).toBeVisible()
  })

  test('should have responsive design', async ({ page }) => {
    // Test responsive design
    await page.setViewportSize({ width: 375, height: 667 }) // Mobile size
    
    // Check if form is still usable on mobile
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input[placeholder="Enter your email"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // Reset to desktop size
    await page.setViewportSize({ width: 1280, height: 720 })
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    // Test accessibility
    const emailInput = page.locator('input[placeholder="Enter your email"]')
    const emailLabel = page.locator('label:has-text("Email")')
    
    // Check if label is associated with input
    const labelFor = await emailLabel.getAttribute('for')
    const inputId = await emailInput.getAttribute('id')
    
    expect(labelFor).toBe(inputId)
  })

  test('should handle form reset', async ({ page }) => {
    // Test form reset behavior
    const emailInput = page.locator('input[placeholder="Enter your email"]')
    const passwordInput = page.locator('input[placeholder="Enter your password"]')
    
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
    // Test that FormField components are properly structured
    const formFields = page.locator('form > div') // FormField components
    await expect(formFields).toHaveCount(3)
    
    // Each field should have a label, input, and potentially description/message
    for (let i = 0; i < 3; i++) {
      const field = formFields.nth(i)
      await expect(field.locator('label')).toBeVisible()
      await expect(field.locator('input')).toBeVisible()
    }
  })

  test('should handle form descriptions correctly', async ({ page }) => {
    // Test that form descriptions are properly displayed
    const emailDescription = page.locator('p:has-text("We\'ll never share your email with anyone else.")')
    const passwordDescription = page.locator('p:has-text("Password must be at least 8 characters long.")')
    
    await expect(emailDescription).toBeVisible()
    await expect(passwordDescription).toBeVisible()
    
    // Check that descriptions have proper styling
    await expect(emailDescription).toHaveClass(/text-muted-foreground/)
    await expect(passwordDescription).toHaveClass(/text-muted-foreground/)
  })

  test('should have proper button styling', async ({ page }) => {
    // Test button component styling
    const submitButton = page.locator('button[type="submit"]')
    
    await expect(submitButton).toBeVisible()
    await expect(submitButton).toHaveClass(/w-full/)
    
    // Button should be properly styled
    await expect(submitButton).toHaveClass(/bg-primary/)
  })
})
