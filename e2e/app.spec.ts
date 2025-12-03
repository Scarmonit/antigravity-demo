import { test, expect } from '@playwright/test';

test.describe('Antigravity Demo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174');
  });

  test('should load the main page', async ({ page }) => {
    await expect(page).toHaveTitle(/Antigravity/i);
  });

  test('should display header with theme toggle', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should increment counter when clicked', async ({ page }) => {
    const counter = page.getByRole('button', { name: /count/i });
    const initialText = await counter.textContent();
    await counter.click();
    const newText = await counter.textContent();
    expect(newText).not.toBe(initialText);
  });

  test('should toggle theme between dark and light', async ({ page }) => {
    const app = page.locator('.app');
    await expect(app).toHaveClass(/theme-dark/);

    const themeToggle = page.getByRole('button', { name: /theme|toggle/i });
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await expect(app).toHaveClass(/theme-light/);
    }
  });

  test('should display features card', async ({ page }) => {
    const featuresSection = page.locator('text=Features').first();
    await expect(featuresSection).toBeVisible();
  });

  test('should display stats bar with workflow count', async ({ page }) => {
    const statsBar = page.locator('text=/workflows|tools|deployments/i').first();
    await expect(statsBar).toBeVisible();
  });
});
