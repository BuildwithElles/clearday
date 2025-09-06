import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('PWA Manifest', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('manifest.json file exists and is valid JSON', async () => {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    expect(() => JSON.parse(manifestContent)).not.toThrow();
  });

  test('manifest link is present in HTML head', async ({ page }) => {
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.json');
  });

  test('manifest is accessible via HTTP', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('manifest contains required PWA properties', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    const manifest = await response.json();

    // Required properties
    expect(manifest.name).toBe('ClearDay - Your day, already sorted');
    expect(manifest.short_name).toBe('ClearDay');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(manifest.background_color).toBe('#ffffff');
    expect(manifest.theme_color).toBe('#667eea');
  });

  test('manifest contains proper icons array', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    const manifest = await response.json();

    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);

    // Check first icon has required properties
    const firstIcon = manifest.icons[0];
    expect(firstIcon.src).toBeDefined();
    expect(firstIcon.sizes).toBeDefined();
    expect(firstIcon.type).toBeDefined();
  });

  test('manifest icons are accessible', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    const manifest = await response.json();

    // Test a few key icons
    for (const icon of manifest.icons.slice(0, 3)) {
      const iconResponse = await page.request.get(icon.src);
      expect(iconResponse.status()).toBe(200);
    }
  });

  test('PWA meta tags are present in HTML', async ({ page }) => {
    // Theme color meta tag
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute('content', '#667eea');

    // Apple mobile web app meta tags
    const appleCapable = page.locator('meta[name="apple-mobile-web-app-capable"]');
    await expect(appleCapable).toHaveAttribute('content', 'yes');

    const appleStatusBar = page.locator('meta[name="apple-mobile-web-app-status-bar-style"]');
    await expect(appleStatusBar).toHaveAttribute('content', 'default');

    const appleTitle = page.locator('meta[name="apple-mobile-web-app-title"]');
    await expect(appleTitle).toHaveAttribute('content', 'ClearDay');
  });

  test('apple touch icon is present', async ({ page }) => {
    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleTouchIcon).toHaveAttribute('href', '/icons/icon-192x192.svg');

    // Verify the icon is accessible
    const iconResponse = await page.request.get('/icons/icon-192x192.svg');
    expect(iconResponse.status()).toBe(200);
  });

  test('Microsoft tile meta tags are present', async ({ page }) => {
    const msTileColor = page.locator('meta[name="msapplication-TileColor"]');
    await expect(msTileColor).toHaveAttribute('content', '#667eea');
  });

  test('manifest has proper shortcuts configuration', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    const manifest = await response.json();

    expect(Array.isArray(manifest.shortcuts)).toBe(true);
    expect(manifest.shortcuts.length).toBeGreaterThan(0);

    // Check shortcut structure
    const firstShortcut = manifest.shortcuts[0];
    expect(firstShortcut.name).toBeDefined();
    expect(firstShortcut.url).toBeDefined();
    expect(Array.isArray(firstShortcut.icons)).toBe(true);
  });

  test('manifest has proper categories', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    const manifest = await response.json();

    expect(Array.isArray(manifest.categories)).toBe(true);
    expect(manifest.categories.length).toBeGreaterThan(0);
    expect(manifest.categories).toContain('productivity');
  });

  test('manifest has proper screenshots', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    const manifest = await response.json();

    expect(Array.isArray(manifest.screenshots)).toBe(true);
    expect(manifest.screenshots.length).toBeGreaterThan(0);

    const firstScreenshot = manifest.screenshots[0];
    expect(firstScreenshot.src).toBeDefined();
    expect(firstScreenshot.sizes).toBeDefined();
  });

  test('manifest screenshot is accessible', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    const manifest = await response.json();

    const screenshotSrc = manifest.screenshots[0].src;
    const screenshotResponse = await page.request.get(screenshotSrc);
    expect(screenshotResponse.status()).toBe(200);
  });

  test('manifest has proper orientation and scope', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    const manifest = await response.json();

    expect(manifest.orientation).toBe('portrait-primary');
    expect(manifest.scope).toBe('/');
  });

  test('manifest has proper language and direction settings', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    const manifest = await response.json();

    expect(manifest.lang).toBe('en-US');
    expect(manifest.dir).toBe('ltr');
  });

  test('web app can be installed (PWA criteria)', async ({ page }) => {
    // Check if the page meets PWA installation criteria
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toBeAttached();

    // Check for service worker (would be implemented in future tasks)
    // For now, just verify the manifest is properly linked
    const manifestHref = await manifestLink.getAttribute('href');
    expect(manifestHref).toBe('/manifest.json');
  });

  test('manifest validates against PWA criteria', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    const manifest = await response.json();

    // Check for required PWA manifest properties
    const requiredProperties = ['name', 'icons', 'start_url', 'display'];
    requiredProperties.forEach(prop => {
      expect(manifest).toHaveProperty(prop);
    });

    // Check that at least one icon is 192x192 or larger (PWA requirement)
    const hasLargeIcon = manifest.icons.some((icon: any) =>
      parseInt(icon.sizes.split('x')[0]) >= 192
    );
    expect(hasLargeIcon).toBe(true);
  });
});
