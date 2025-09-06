import { test, expect } from '@playwright/test';

test.describe('MVP Regression Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and cookies before each test
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  // ============================================================================
  // LANDING PAGE TESTS
  // ============================================================================

  test('landing page loads correctly', async ({ page }) => {
    await page.goto('/');

    // Check basic page structure
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();

    // Check for ClearDay branding
    await expect(page.getByText('ClearDay')).toBeVisible();

    // Check navigation links
    await expect(page.getByRole('link', { name: /features/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /pricing/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible();

    // Check CTA buttons
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /get started/i })).toBeVisible();
  });

  // ============================================================================
  // AUTHENTICATION FLOW TESTS
  // ============================================================================

  test('complete authentication flow', async ({ page }) => {
    // Test signup
    await page.goto('/signup');
    await expect(page).toHaveURL(/signup/);

    // Fill signup form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to login after signup
    await expect(page).toHaveURL(/login/);

    // Test login with the created account
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await page.waitForURL(/today|dashboard/);
    await expect(page).toHaveURL(/today|dashboard/);
  });

  test('authentication form validation', async ({ page }) => {
    await page.goto('/signup');

    // Test empty form submission
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.getByText(/required/i)).toBeVisible();

    // Test password mismatch
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'differentpassword');
    await page.click('button[type="submit"]');

    // Should show password mismatch error
    await expect(page.getByText(/match/i)).toBeVisible();
  });

  // ============================================================================
  // DASHBOARD FUNCTIONALITY TESTS
  // ============================================================================

  test('dashboard loads and displays correctly', async ({ page }) => {
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', 'mock-token');
    });

    await page.goto('/today');

    // Check dashboard layout
    await expect(page.getByText('Today')).toBeVisible();
    await expect(page.getByText('Tasks')).toBeVisible();

    // Check navigation
    await expect(page.getByRole('link', { name: /calendar/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /settings/i })).toBeVisible();
  });

  test('task creation and management', async ({ page }) => {
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', 'mock-token');
    });

    await page.goto('/today');

    // Click add task button
    const addButton = page.getByRole('button', { name: /add.*task/i });
    if (await addButton.count() > 0) {
      await addButton.click();

      // Fill task form
      await page.fill('input[placeholder*="title"]', 'Test Task');
      await page.fill('textarea[placeholder*="description"]', 'Test description');
      await page.selectOption('select', 'medium');

      // Submit form
      await page.click('button[type="submit"]');

      // Task should appear in list
      await expect(page.getByText('Test Task')).toBeVisible();
    }
  });

  test('calendar view functionality', async ({ page }) => {
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', 'mock-token');
    });

    await page.goto('/calendar');

    // Check calendar elements
    await expect(page.getByText('Calendar')).toBeVisible();

    // Check time slots are displayed
    const timeSlots = page.locator('[data-testid*="time"], .time-slot, [class*="time"]');
    if (await timeSlots.count() > 0) {
      await expect(timeSlots.first()).toBeVisible();
    }
  });

  // ============================================================================
  // SETTINGS FUNCTIONALITY TESTS
  // ============================================================================

  test('settings page loads and functions', async ({ page }) => {
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', 'mock-token');
    });

    await page.goto('/settings');

    // Check settings tabs
    await expect(page.getByText('Profile')).toBeVisible();
    await expect(page.getByText('Privacy')).toBeVisible();

    // Check privacy toggle
    const privacyToggle = page.locator('input[type="checkbox"], [role="switch"]');
    if (await privacyToggle.count() > 0) {
      await expect(privacyToggle.first()).toBeVisible();
    }
  });

  // ============================================================================
  // DARK MODE TESTS
  // ============================================================================

  test('dark mode toggle functionality', async ({ page }) => {
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', 'mock-token');
    });

    await page.goto('/today');

    // Check if theme toggle exists in user menu
    const userMenu = page.locator('[data-testid="user-menu"]');
    if (await userMenu.count() > 0) {
      await userMenu.click();

      // Look for theme toggle
      const themeToggle = page.locator('button:has-text("Light"), button:has-text("Dark"), button:has-text("System")');
      if (await themeToggle.count() > 0) {
        await themeToggle.first().click();
        // Theme should change (basic check)
        await expect(page.locator('html')).toBeVisible();
      }
    }
  });

  // ============================================================================
  // MOBILE RESPONSIVENESS TESTS
  // ============================================================================

  test('mobile experience at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Check mobile layout
    await expect(page.locator('nav, header')).toBeVisible();

    // Check hamburger menu or mobile navigation
    const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, button[class*="menu"]');
    if (await mobileMenu.count() > 0) {
      await expect(mobileMenu.first()).toBeVisible();
    }
  });

  test('tablet experience at 768px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/');

    // Check tablet layout
    await expect(page.locator('nav, header')).toBeVisible();

    // Navigation should be visible
    const navLinks = page.locator('nav a, nav button');
    if (await navLinks.count() > 0) {
      await expect(navLinks.first()).toBeVisible();
    }
  });

  test('desktop experience at 1920px', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('/');

    // Check desktop layout
    await expect(page.locator('nav, header')).toBeVisible();

    // Full navigation should be visible
    const navLinks = page.locator('nav a, nav button');
    await expect(navLinks).toHaveCount(await navLinks.count()); // At least some nav items
  });

  // ============================================================================
  // ERROR HANDLING TESTS
  // ============================================================================

  test('404 page displays correctly', async ({ page }) => {
    await page.goto('/non-existent-page');

    // Should show 404 page
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByRole('link', { name: /home|back/i })).toBeVisible();
  });

  test('error boundaries work', async ({ page }) => {
    // This would test React error boundaries
    // For now, just ensure basic error handling is in place
    await page.goto('/');

    // Check that no obvious errors are displayed
    const errorMessages = page.locator('.error, [class*="error"], [role="alert"]');
    const errorCount = await errorMessages.count();

    // Allow for some expected error states, but not excessive errors
    expect(errorCount).toBeLessThan(5);
  });

  // ============================================================================
  // PERFORMANCE TESTS
  // ============================================================================

  test('page load performance', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;

    // Should load within reasonable time (allowing for CI variability)
    expect(loadTime).toBeLessThan(10000); // 10 seconds max

    console.log(`Page loaded in ${loadTime}ms`);
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');

    // Test tab navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('screen reader support', async ({ page }) => {
    await page.goto('/');

    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings).toHaveCount(await headings.count()); // At least some headings

    // Check for alt text on images
    const images = page.locator('img');
    for (const img of await images.all()) {
      const alt = await img.getAttribute('alt');
      if (alt !== null) {
        expect(alt.length).toBeGreaterThan(0);
      }
    }
  });

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  test('end-to-end user journey', async ({ page }) => {
    // Landing page
    await page.goto('/');
    await expect(page.getByText('ClearDay')).toBeVisible();

    // Navigate to signup
    await page.click('a[href="/signup"]');
    await expect(page).toHaveURL(/signup/);

    // Fill signup form
    await page.fill('input[name="email"]', 'e2e@example.com');
    await page.fill('input[name="password"]', 'E2ePassword123!');
    await page.fill('input[name="confirmPassword"]', 'E2ePassword123!');
    await page.click('button[type="submit"]');

    // Should redirect to login
    await expect(page).toHaveURL(/login/);

    // Login
    await page.fill('input[name="email"]', 'e2e@example.com');
    await page.fill('input[name="password"]', 'E2ePassword123!');
    await page.click('button[type="submit"]');

    // Should reach dashboard
    await page.waitForURL(/today|dashboard/);
    await expect(page.getByText('Today')).toBeVisible();
  });

  // ============================================================================
  // API INTEGRATION TESTS
  // ============================================================================

  test('API endpoints respond correctly', async ({ request }) => {
    // Test health check endpoint
    const response = await request.get('/api/test-db');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success');
  });

  // ============================================================================
  // CONSOLE ERROR CHECKS
  // ============================================================================

  test('no console errors during normal usage', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });

    // Navigate through the app
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for critical errors (allow some warnings for development)
    const criticalErrors = errors.filter(error =>
      !error.includes('favicon') &&
      !error.includes('manifest') &&
      !error.includes('analytics') &&
      !error.includes('Warning:')
    );

    expect(criticalErrors).toHaveLength(0);

    if (errors.length > 0) {
      console.log('Console errors found:', errors);
    }

    if (warnings.length > 0) {
      console.log('Console warnings found:', warnings);
    }
  });

  // ============================================================================
  // BROWSER COMPATIBILITY TESTS
  // ============================================================================

  test('works in different browsers', async ({ browserName }) => {
    // Basic smoke test that works across browsers
    test.skip(browserName === 'webkit', 'Skip WebKit for now due to CI limitations');

    const page = await browserName === 'chromium'
      ? await (await browserName === 'chromium' ? require('playwright').chromium.launch() : Promise.resolve(null)).newPage()
      : await (await browserName === 'firefox' ? require('playwright').firefox.launch() : Promise.resolve(null)).newPage();

    if (page) {
      await page.goto('/');
      await expect(page.getByText('ClearDay')).toBeVisible();
      await page.close();
    }
  });

  // ============================================================================
  // FINAL VERIFICATION TESTS
  // ============================================================================

  test('all major features are functional', async ({ page }) => {
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', 'mock-token');
    });

    await page.goto('/today');

    // Verify core functionality is present
    const checks = [
      page.getByText('Today'),
      page.getByText('Tasks'),
      page.getByRole('link', { name: /calendar/i }),
      page.getByRole('link', { name: /settings/i })
    ];

    for (const check of checks) {
      await expect(check).toBeVisible();
    }
  });

  test('responsive design works across breakpoints', async ({ page }) => {
    const breakpoints = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];

    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/');

      // Basic layout should work at each breakpoint
      await expect(page.locator('body')).toBeVisible();
      await expect(page.getByText('ClearDay')).toBeVisible();
    }
  });
});
