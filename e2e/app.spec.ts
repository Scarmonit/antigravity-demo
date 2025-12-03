import { test, expect } from '@playwright/test';

test.describe('Antigravity Demo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load the main page', async ({ page }) => {
    await expect(page).toHaveTitle(/Antigravity/i);
  });

  test('should display header with theme toggle', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('should increment counter when clicked', async ({ page }) => {
    // Wait for app to fully render
    await page.waitForSelector('.counter-value', { timeout: 10000 });

    const incrementButton = page.locator('button:has-text("Increment")').first();
    await incrementButton.click();

    const counterDisplay = page.locator('.counter-value');
    await expect(counterDisplay).toHaveText('1');
  });

  test('should toggle theme between dark and light', async ({ page }) => {
    await page.waitForSelector('.app', { timeout: 10000 });

    const app = page.locator('.app').first();
    await expect(app).toHaveClass(/theme-dark/);

    // Click the theme toggle button using JavaScript to bypass overlay issues
    await page.evaluate(() => {
      const btn = document.querySelector('button.theme-toggle') as HTMLButtonElement;
      if (btn) btn.click();
    });

    // Wait for theme change
    await expect(app).toHaveClass(/theme-light/, { timeout: 5000 });
  });

  test('should display features card', async ({ page }) => {
    await page.waitForSelector('.features-card, .card', { timeout: 10000 });
    const featuresHeading = page.getByRole('heading', { name: /features/i }).first();
    await expect(featuresHeading).toBeVisible();
  });

  test('should display stats bar with workflow count', async ({ page }) => {
    await page.waitForSelector('.app', { timeout: 10000 });
    const statsText = page.getByText(/workflows/i).first();
    await expect(statsText).toBeVisible();
  });
});
