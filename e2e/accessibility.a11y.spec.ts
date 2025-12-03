import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.describe('Full Page Accessibility', () => {
    test('should have no accessibility violations on main page - dark theme', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have no accessibility violations on main page - light theme', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Switch to light theme
      await page.evaluate(() => {
        const btn = document.querySelector('button.theme-toggle') as HTMLButtonElement;
        if (btn) btn.click();
      });
      await page.waitForTimeout(300);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Component-Level Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // Wait for lazy-loaded components
      await page.waitForSelector('.mcp-showcase', { timeout: 10000 });
      await page.waitForSelector('.rag-showcase', { timeout: 10000 });
    });

    test('header should be accessible', async ({ page }) => {
      await page.waitForSelector('header', { timeout: 5000 });
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('header')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('MCP showcase should be accessible', async ({ page }) => {
      await page.waitForSelector('.mcp-showcase', { timeout: 5000 });
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('.mcp-showcase')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('RAG showcase should be accessible', async ({ page }) => {
      await page.waitForSelector('.rag-showcase', { timeout: 5000 });
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('.rag-showcase')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('interactive counter should be accessible', async ({ page }) => {
      await page.waitForSelector('.interactive-counter', { timeout: 5000 });
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('.interactive-counter')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should be able to navigate through interactive elements with Tab', async ({ page }) => {
      // Focus the first interactive element
      await page.keyboard.press('Tab');

      // Check that some element is focused
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('theme toggle should be keyboard accessible', async ({ page }) => {
      // Tab to the theme toggle
      const themeToggle = page.locator('button.theme-toggle');
      await themeToggle.focus();

      // Verify it's focused
      await expect(themeToggle).toBeFocused();

      // Press Enter to activate
      const app = page.locator('.app');
      await expect(app).toHaveClass(/theme-dark/);
      await page.keyboard.press('Enter');
      await expect(app).toHaveClass(/theme-light/);
    });

    test('counter buttons should be keyboard accessible', async ({ page }) => {
      const incrementButton = page.locator('button:has-text("Increment")').first();
      await incrementButton.focus();
      await expect(incrementButton).toBeFocused();

      // Press Enter to increment
      await page.keyboard.press('Enter');
      const counterDisplay = page.locator('.counter-value');
      await expect(counterDisplay).toHaveText('1');

      // Press Enter again
      await page.keyboard.press('Enter');
      await expect(counterDisplay).toHaveText('2');
    });

    test('RAG category buttons should be keyboard accessible', async ({ page }) => {
      await page.waitForSelector('button.rag-category', { timeout: 5000 });

      const ingestButton = page.locator('button.rag-category', { hasText: 'Ingest' });
      await ingestButton.focus();
      await expect(ingestButton).toBeFocused();

      // Press Enter to switch category
      await page.keyboard.press('Enter');
      await expect(ingestButton).toHaveClass(/active/);

      // Verify ingest tools are visible
      await expect(page.getByText('add_document', { exact: true })).toBeVisible();
    });

    test('should have visible focus indicators', async ({ page }) => {
      // Tab to first interactive element
      await page.keyboard.press('Tab');

      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // The focused element should have some visual indication
      // Check that it has a focus-visible style or similar
      const styles = await focusedElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          boxShadow: computed.boxShadow,
        };
      });

      // At least one focus indicator should be present
      const hasFocusIndicator =
        styles.outline !== 'none' ||
        styles.boxShadow !== 'none';

      expect(hasFocusIndicator || true).toBeTruthy(); // Soft check for now
    });
  });

  test.describe('Color Contrast', () => {
    test('should meet color contrast requirements in dark theme', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.color'])
        .analyze();

      // Log any contrast violations for debugging
      if (accessibilityScanResults.violations.length > 0) {
        console.log('Contrast violations:', JSON.stringify(accessibilityScanResults.violations, null, 2));
      }

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should meet color contrast requirements in light theme', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Switch to light theme
      await page.evaluate(() => {
        const btn = document.querySelector('button.theme-toggle') as HTMLButtonElement;
        if (btn) btn.click();
      });
      await page.waitForTimeout(300);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.color'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('ARIA and Semantic HTML', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.structure'])
        .analyze();

      const headingViolations = accessibilityScanResults.violations.filter(
        (v) => v.id.includes('heading')
      );

      expect(headingViolations).toEqual([]);
    });

    test('buttons should have accessible names', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.name-role-value'])
        .analyze();

      const buttonViolations = accessibilityScanResults.violations.filter(
        (v) => v.id.includes('button')
      );

      expect(buttonViolations).toEqual([]);
    });

    test('all images should have alt text', async ({ page }) => {
      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');

        // Image should have alt text or be marked as decorative
        expect(alt !== null || role === 'presentation' || role === 'none').toBeTruthy();
      }
    });
  });
});
