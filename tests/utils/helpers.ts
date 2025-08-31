import type { Page, Locator, expect } from '@playwright/test'
import type { User, Task, Event, Reminder, Nudge, Habit, Progress } from '@/types'

// Base Page Object Model class
export abstract class BasePage {
  protected page: Page
  protected baseUrl: string

  constructor(page: Page, baseUrl: string = 'http://localhost:3000') {
    this.page = page
    this.baseUrl = baseUrl
  }

  async goto(path: string = '/') {
    await this.page.goto(`${this.baseUrl}${path}`)
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle')
  }

  async waitForElement(selector: string, timeout: number = 5000) {
    await this.page.waitForSelector(selector, { timeout })
  }

  async waitForElementToBeVisible(selector: string, timeout: number = 5000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout })
  }

  async waitForElementToBeHidden(selector: string, timeout: number = 5000) {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout })
  }

  async clickElement(selector: string) {
    await this.page.click(selector)
  }

  async fillInput(selector: string, value: string) {
    await this.page.fill(selector, value)
  }

  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || ''
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector)
  }

  async isEnabled(selector: string): Promise<boolean> {
    return await this.page.isEnabled(selector)
  }

  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return await this.page.getAttribute(selector, attribute)
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/${name}.png` })
  }
}

// Authentication helpers
export class AuthHelpers {
  static async login(page: Page, email: string, password: string) {
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', email)
    await page.fill('[data-testid="password-input"]', password)
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard')
  }

  static async logout(page: Page) {
    await page.click('[data-testid="user-menu"]')
    await page.click('[data-testid="logout-button"]')
    await page.waitForURL('/')
  }

  static async signup(page: Page, userData: Partial<User>) {
    await page.goto('/signup')
    await page.fill('[data-testid="email-input"]', userData.email || 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.fill('[data-testid="confirm-password-input"]', 'password123')
    if (userData.fullName) {
      await page.fill('[data-testid="full-name-input"]', userData.fullName)
    }
    await page.click('[data-testid="signup-button"]')
    await page.waitForURL('/dashboard')
  }
}

// Form helpers
export class FormHelpers {
  static async fillForm(page: Page, formData: Record<string, string>) {
    for (const [field, value] of Object.entries(formData)) {
      const selector = `[data-testid="${field}-input"]`
      await page.fill(selector, value)
    }
  }

  static async submitForm(page: Page, submitButtonTestId: string = 'submit-button') {
    await page.click(`[data-testid="${submitButtonTestId}"]`)
  }

  static async clearForm(page: Page, fields: string[]) {
    for (const field of fields) {
      const selector = `[data-testid="${field}-input"]`
      await page.fill(selector, '')
    }
  }

  static async validateFormErrors(page: Page, expectedErrors: Record<string, string>) {
    for (const [field, expectedError] of Object.entries(expectedErrors)) {
      const errorSelector = `[data-testid="${field}-error"]`
      const actualError = await page.textContent(errorSelector)
      if (actualError !== expectedError) {
        throw new Error(`Expected error for ${field}: "${expectedError}", got: "${actualError}"`)
      }
    }
  }
}

// Navigation helpers
export class NavigationHelpers {
  static async navigateTo(page: Page, path: string) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
  }

  static async clickNavLink(page: Page, linkText: string) {
    await page.click(`text=${linkText}`)
    await page.waitForLoadState('networkidle')
  }

  static async clickSidebarLink(page: Page, linkText: string) {
    await page.click(`[data-testid="sidebar"] >> text=${linkText}`)
    await page.waitForLoadState('networkidle')
  }

  static async goBack(page: Page) {
    await page.goBack()
    await page.waitForLoadState('networkidle')
  }

  static async goForward(page: Page) {
    await page.goForward()
    await page.waitForLoadState('networkidle')
  }
}

// Data helpers
export class DataHelpers {
  static generateRandomEmail(): string {
    return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`
  }

  static generateRandomId(): string {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  static generateRandomString(length: number = 10): string {
    return Math.random().toString(36).substr(2, length)
  }

  static generateRandomDate(start: Date = new Date(2020, 0, 1), end: Date = new Date()): string {
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime())
    return new Date(randomTime).toISOString()
  }

  static generateRandomTask(overrides: Partial<Task> = {}): Task {
    return {
      id: this.generateRandomId(),
      userId: 'user-1',
      title: `Task ${this.generateRandomString(5)}`,
      completed: false,
      priority: Math.floor(Math.random() * 4) + 1 as 1 | 2 | 3 | 4,
      tags: ['test'],
      source: 'manual',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides
    }
  }

  static generateRandomEvent(overrides: Partial<Event> = {}): Event {
    const startTime = new Date()
    const endTime = new Date(startTime.getTime() + 3600000) // 1 hour later
    
    return {
      id: this.generateRandomId(),
      userId: 'user-1',
      title: `Event ${this.generateRandomString(5)}`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      allDay: false,
      attendees: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides
    }
  }
}

// Assertion helpers
export class AssertionHelpers {
  static async assertElementVisible(page: Page, selector: string, message?: string) {
    const isVisible = await page.isVisible(selector)
    if (!isVisible) {
      throw new Error(message || `Element ${selector} should be visible`)
    }
  }

  static async assertElementHidden(page: Page, selector: string, message?: string) {
    const isVisible = await page.isVisible(selector)
    if (isVisible) {
      throw new Error(message || `Element ${selector} should be hidden`)
    }
  }

  static async assertElementEnabled(page: Page, selector: string, message?: string) {
    const isEnabled = await page.isEnabled(selector)
    if (!isEnabled) {
      throw new Error(message || `Element ${selector} should be enabled`)
    }
  }

  static async assertElementDisabled(page: Page, selector: string, message?: string) {
    const isEnabled = await page.isEnabled(selector)
    if (isEnabled) {
      throw new Error(message || `Element ${selector} should be disabled`)
    }
  }

  static async assertTextContent(page: Page, selector: string, expectedText: string, message?: string) {
    const actualText = await page.textContent(selector)
    if (actualText !== expectedText) {
      throw new Error(message || `Expected text "${expectedText}" in ${selector}, got "${actualText}"`)
    }
  }

  static async assertTextContains(page: Page, selector: string, expectedText: string, message?: string) {
    const actualText = await page.textContent(selector)
    if (!actualText?.includes(expectedText)) {
      throw new Error(message || `Expected text "${expectedText}" to be contained in ${selector}, got "${actualText}"`)
    }
  }

  static async assertUrl(page: Page, expectedUrl: string, message?: string) {
    const actualUrl = page.url()
    if (!actualUrl.includes(expectedUrl)) {
      throw new Error(message || `Expected URL to contain "${expectedUrl}", got "${actualUrl}"`)
    }
  }

  static async assertElementCount(page: Page, selector: string, expectedCount: number, message?: string) {
    const elements = await page.$$(selector)
    if (elements.length !== expectedCount) {
      throw new Error(message || `Expected ${expectedCount} elements for ${selector}, got ${elements.length}`)
    }
  }
}

// Performance helpers
export class PerformanceHelpers {
  static async measurePageLoadTime(page: Page): Promise<number> {
    const startTime = Date.now()
    await page.waitForLoadState('networkidle')
    return Date.now() - startTime
  }

  static async measureElementLoadTime(page: Page, selector: string): Promise<number> {
    const startTime = Date.now()
    await page.waitForSelector(selector)
    return Date.now() - startTime
  }

  static async assertPageLoadTime(page: Page, maxTime: number = 3000) {
    const loadTime = await this.measurePageLoadTime(page)
    if (loadTime > maxTime) {
      throw new Error(`Page load time ${loadTime}ms exceeded maximum ${maxTime}ms`)
    }
  }
}

// Accessibility helpers
export class AccessibilityHelpers {
  static async assertAriaLabel(page: Page, selector: string, expectedLabel: string) {
    const ariaLabel = await page.getAttribute(selector, 'aria-label')
    if (ariaLabel !== expectedLabel) {
      throw new Error(`Expected aria-label "${expectedLabel}" for ${selector}, got "${ariaLabel}"`)
    }
  }

  static async assertAriaDescribedBy(page: Page, selector: string, expectedDescription: string) {
    const ariaDescribedBy = await page.getAttribute(selector, 'aria-describedby')
    if (ariaDescribedBy !== expectedDescription) {
      throw new Error(`Expected aria-describedby "${expectedDescription}" for ${selector}, got "${ariaDescribedBy}"`)
    }
  }

  static async assertRole(page: Page, selector: string, expectedRole: string) {
    const role = await page.getAttribute(selector, 'role')
    if (role !== expectedRole) {
      throw new Error(`Expected role "${expectedRole}" for ${selector}, got "${role}"`)
    }
  }
}

// Utility functions
export const waitForTimeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (attempt === maxAttempts) {
        throw lastError
      }
      await waitForTimeout(delay)
    }
  }
  
  throw lastError!
}

export const createTestId = (name: string) => `[data-testid="${name}"]`

export const createAriaLabel = (name: string) => `[aria-label="${name}"]`

export const createTextSelector = (text: string) => `text=${text}`

export const createPartialTextSelector = (text: string) => `text=${text}`

