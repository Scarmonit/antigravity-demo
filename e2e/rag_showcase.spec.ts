import { test, expect } from '@playwright/test';

test.describe('RAG Showcase Interactivity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('.rag-showcase', { timeout: 10000 });
  });

  test('should default to Search category', async ({ page }) => {
    await page.waitForSelector('button.rag-category', { timeout: 5000 });

    const searchButton = page.locator('button.rag-category', { hasText: 'Search' });
    await expect(searchButton).toHaveClass(/active/);

    const searchTool = page.getByText('search_docs', { exact: true });
    await expect(searchTool).toBeVisible();

    const ingestTool = page.getByText('add_document', { exact: true });
    await expect(ingestTool).toBeHidden();
  });

  test('should switch to Ingest category', async ({ page }) => {
    await page.waitForSelector('button.rag-category', { timeout: 5000 });

    const ingestButton = page.locator('button.rag-category', { hasText: 'Ingest' });
    await ingestButton.click();
    await expect(ingestButton).toHaveClass(/active/);

    // Use exact match to avoid matching add_documents_batch
    const ingestTool = page.getByText('add_document', { exact: true });
    await expect(ingestTool).toBeVisible();

    const searchTool = page.getByText('search_docs', { exact: true });
    await expect(searchTool).toBeHidden();
  });

  test('should switch to Manage category', async ({ page }) => {
    await page.waitForSelector('button.rag-category', { timeout: 5000 });

    const manageButton = page.locator('button.rag-category', { hasText: 'Manage' });
    await manageButton.click();
    await expect(manageButton).toHaveClass(/active/);

    const manageTool = page.getByText('list_sources', { exact: true });
    await expect(manageTool).toBeVisible();
  });
});
