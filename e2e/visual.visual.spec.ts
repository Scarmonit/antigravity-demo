import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.describe('Dark Theme', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // Ensure dark theme is active
      const app = page.locator('.app');
      await expect(app).toHaveClass(/theme-dark/);
    });

    test('full page screenshot - dark theme', async ({ page }) => {
      await page.waitForTimeout(500); // Wait for animations
      await expect(page).toHaveScreenshot('full-page-dark.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('header component - dark theme', async ({ page }) => {
      const header = page.locator('header').first();
      await expect(header).toHaveScreenshot('header-dark.png', {
        animations: 'disabled',
      });
    });

    test('MCP showcase - dark theme', async ({ page }) => {
      const mcpShowcase = page.locator('.mcp-showcase');
      await expect(mcpShowcase).toHaveScreenshot('mcp-showcase-dark.png', {
        animations: 'disabled',
      });
    });

    test('RAG showcase - dark theme', async ({ page }) => {
      const ragShowcase = page.locator('.rag-showcase');
      await expect(ragShowcase).toHaveScreenshot('rag-showcase-dark.png', {
        animations: 'disabled',
      });
    });

    test('features card - dark theme', async ({ page }) => {
      const featuresCard = page.locator('.features-card, .card').filter({ hasText: 'Features' }).first();
      await expect(featuresCard).toHaveScreenshot('features-card-dark.png', {
        animations: 'disabled',
      });
    });

    test('counter component - dark theme', async ({ page }) => {
      const counter = page.locator('.interactive-counter');
      await expect(counter).toHaveScreenshot('counter-dark.png', {
        animations: 'disabled',
      });
    });
  });

  test.describe('Light Theme', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // Switch to light theme
      await page.evaluate(() => {
        const btn = document.querySelector('button.theme-toggle') as HTMLButtonElement;
        if (btn) btn.click();
      });
      await page.waitForTimeout(300); // Wait for theme transition
      const app = page.locator('.app');
      await expect(app).toHaveClass(/theme-light/);
    });

    test('full page screenshot - light theme', async ({ page }) => {
      await page.waitForTimeout(500); // Wait for animations
      await expect(page).toHaveScreenshot('full-page-light.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('header component - light theme', async ({ page }) => {
      const header = page.locator('header').first();
      await expect(header).toHaveScreenshot('header-light.png', {
        animations: 'disabled',
      });
    });

    test('MCP showcase - light theme', async ({ page }) => {
      const mcpShowcase = page.locator('.mcp-showcase');
      await expect(mcpShowcase).toHaveScreenshot('mcp-showcase-light.png', {
        animations: 'disabled',
      });
    });

    test('RAG showcase - light theme', async ({ page }) => {
      const ragShowcase = page.locator('.rag-showcase');
      await expect(ragShowcase).toHaveScreenshot('rag-showcase-light.png', {
        animations: 'disabled',
      });
    });

    test('features card - light theme', async ({ page }) => {
      const featuresCard = page.locator('.features-card, .card').filter({ hasText: 'Features' }).first();
      await expect(featuresCard).toHaveScreenshot('features-card-light.png', {
        animations: 'disabled',
      });
    });

    test('counter component - light theme', async ({ page }) => {
      const counter = page.locator('.interactive-counter');
      await expect(counter).toHaveScreenshot('counter-light.png', {
        animations: 'disabled',
      });
    });
  });

  test.describe('Interactive States', () => {
    test('counter after increment - state change', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const incrementButton = page.locator('button:has-text("Increment")').first();
      await incrementButton.click();
      await incrementButton.click();

      const counter = page.locator('.interactive-counter');
      await expect(counter).toHaveScreenshot('counter-incremented.png', {
        animations: 'disabled',
      });
    });

    test('RAG category switched - state change', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('button.rag-category', { timeout: 5000 });

      // Click Ingest category
      const ingestButton = page.locator('button.rag-category', { hasText: 'Ingest' });
      await ingestButton.click();

      const ragShowcase = page.locator('.rag-showcase');
      await expect(ragShowcase).toHaveScreenshot('rag-showcase-ingest.png', {
        animations: 'disabled',
      });
    });
  });
});
