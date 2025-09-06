import { test, expect } from '@playwright/test';

test.describe('SEO Meta Tags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has proper title meta tag', async ({ page }) => {
    const title = await page.title();
    expect(title).toBe('ClearDay - Your day, already sorted');

    // Check meta title tag
    const titleMeta = page.locator('meta[name="title"]');
    if (await titleMeta.count() > 0) {
      const titleContent = await titleMeta.getAttribute('content');
      expect(titleContent).toBe('ClearDay - Your day, already sorted');
    }
  });

  test('has proper description meta tag', async ({ page }) => {
    const descriptionMeta = page.locator('meta[name="description"]');
    await expect(descriptionMeta).toHaveAttribute('content',
      'Privacy-first, AI-powered life organizer that helps you manage your calendar, tasks, and habits with complete data ownership and intelligent automation.'
    );
  });

  test('has proper keywords meta tag', async ({ page }) => {
    const keywordsMeta = page.locator('meta[name="keywords"]');
    await expect(keywordsMeta).toHaveAttribute('content',
      'productivity,calendar,tasks,habits,AI,privacy,life organizer,task management,habit tracker'
    );
  });

  test('has proper author meta tag', async ({ page }) => {
    const authorMeta = page.locator('meta[name="author"]');
    await expect(authorMeta).toHaveAttribute('content', 'ClearDay Team');
  });

  test('has proper Open Graph tags', async ({ page }) => {
    // Open Graph title
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', 'ClearDay - Your day, already sorted');

    // Open Graph description
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content',
      'Privacy-first, AI-powered life organizer that helps you manage your calendar, tasks, and habits with complete data ownership and intelligent automation.'
    );

    // Open Graph URL
    const ogUrl = page.locator('meta[property="og:url"]');
    await expect(ogUrl).toHaveAttribute('content', 'https://clearday.app');

    // Open Graph site name
    const ogSiteName = page.locator('meta[property="og:site_name"]');
    await expect(ogSiteName).toHaveAttribute('content', 'ClearDay');

    // Open Graph type
    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute('content', 'website');

    // Open Graph locale
    const ogLocale = page.locator('meta[property="og:locale"]');
    await expect(ogLocale).toHaveAttribute('content', 'en_US');

    // Open Graph image
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute('content', 'https://clearday.app/og-image.png');

    // Open Graph image width
    const ogImageWidth = page.locator('meta[property="og:image:width"]');
    await expect(ogImageWidth).toHaveAttribute('content', '1200');

    // Open Graph image height
    const ogImageHeight = page.locator('meta[property="og:image:height"]');
    await expect(ogImageHeight).toHaveAttribute('content', '630');

    // Open Graph image alt
    const ogImageAlt = page.locator('meta[property="og:image:alt"]');
    await expect(ogImageAlt).toHaveAttribute('content', 'ClearDay - Privacy-first AI life organizer');
  });

  test('has proper Twitter Card tags', async ({ page }) => {
    // Twitter card type
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');

    // Twitter title
    const twitterTitle = page.locator('meta[name="twitter:title"]');
    await expect(twitterTitle).toHaveAttribute('content', 'ClearDay - Your day, already sorted');

    // Twitter description
    const twitterDescription = page.locator('meta[name="twitter:description"]');
    await expect(twitterDescription).toHaveAttribute('content',
      'Privacy-first, AI-powered life organizer that helps you manage your calendar, tasks, and habits with complete data ownership and intelligent automation.'
    );

    // Twitter image
    const twitterImage = page.locator('meta[name="twitter:image"]');
    await expect(twitterImage).toHaveAttribute('content', 'https://clearday.app/og-image.png');

    // Twitter creator
    const twitterCreator = page.locator('meta[name="twitter:creator"]');
    await expect(twitterCreator).toHaveAttribute('content', '@clearday');

    // Twitter site
    const twitterSite = page.locator('meta[name="twitter:site"]');
    await expect(twitterSite).toHaveAttribute('content', '@clearday');
  });

  test('has proper robots meta tag', async ({ page }) => {
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'index,follow');
  });

  test('has proper canonical URL', async ({ page }) => {
    const canonicalLink = page.locator('link[rel="canonical"]');
    await expect(canonicalLink).toHaveAttribute('href', 'https://clearday.app/');
  });

  test('has proper viewport meta tag', async ({ page }) => {
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute('content', 'width=device-width, initial-scale=1');
  });

  test('has proper charset', async ({ page }) => {
    const charsetMeta = page.locator('meta[charset]');
    await expect(charsetMeta).toHaveAttribute('charset', 'utf-8');
  });

  test('has proper language attribute on html element', async ({ page }) => {
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveAttribute('lang', 'en');
  });

  test('has proper format detection meta tags', async ({ page }) => {
    // These should prevent automatic detection of phone numbers, emails, etc.
    const formatDetection = page.locator('meta[name="format-detection"]');
    if (await formatDetection.count() > 0) {
      const content = await formatDetection.getAttribute('content');
      expect(content).toContain('telephone=no');
      expect(content).toContain('email=no');
      expect(content).toContain('address=no');
    }
  });

  test('has proper favicon and icon links', async ({ page }) => {
    // Check for favicon
    const favicon = page.locator('link[rel="icon"]');
    if (await favicon.count() > 0) {
      await expect(favicon).toHaveAttribute('href');
    }

    // Check for apple-touch-icon (optional but good for mobile)
    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    if (await appleTouchIcon.count() > 0) {
      await expect(appleTouchIcon).toHaveAttribute('href');
    }
  });

  test('has proper theme color meta tag', async ({ page }) => {
    const themeColor = page.locator('meta[name="theme-color"]');
    if (await themeColor.count() > 0) {
      await expect(themeColor).toHaveAttribute('content');
    }
  });

  test('meta tags are properly structured for SEO', async ({ page }) => {
    // Get all meta tags
    const metaTags = await page.locator('meta').all();

    // Should have a good number of meta tags for proper SEO
    expect(metaTags.length).toBeGreaterThan(10);

    // Check for essential SEO meta tags
    const metaNames = await page.locator('meta[name]').evaluateAll(
      elements => elements.map(el => el.getAttribute('name'))
    );

    const metaProperties = await page.locator('meta[property]').evaluateAll(
      elements => elements.map(el => el.getAttribute('property'))
    );

    // Essential meta tags should be present
    expect(metaNames).toContain('description');
    expect(metaNames).toContain('keywords');
    expect(metaProperties).toContain('og:title');
    expect(metaProperties).toContain('og:description');
    expect(metaNames).toContain('twitter:card');
  });

  test('page loads without SEO-related errors', async ({ page }) => {
    // Check that no 404s or errors occur for meta resources
    const responses = [];

    page.on('response', response => {
      if (response.url().includes('og-image') ||
          response.url().includes('favicon') ||
          response.url().includes('apple-touch-icon')) {
        responses.push({
          url: response.url(),
          status: response.status()
        });
      }
    });

    await page.reload();

    // Give time for resources to load
    await page.waitForTimeout(1000);

    // Check that no critical SEO resources return 404
    for (const response of responses) {
      expect(response.status).not.toBe(404);
    }
  });
});
