import { test, expect } from '@playwright/test';

test.describe('RAG Showcase Interactivity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should default to Search category', async ({ page }) => {
    const searchButton = page.locator('.rag-category', { hasText: 'Search' });
    await expect(searchButton).toHaveClass(/active/);

    const searchTool = page.locator('.rag-tool-name', { hasText: 'search_docs' });
    await expect(searchTool).toBeVisible();
    
    const ingestTool = page.locator('.rag-tool-name', { hasText: 'add_document' });
    await expect(ingestTool).not.toBeVisible();
  });

  test('should switch to Ingest category', async ({ page }) => {
    await page.click('.rag-category:has-text("Ingest")');

    const ingestButton = page.locator('.rag-category', { hasText: 'Ingest' });
    await expect(ingestButton).toHaveClass(/active/);

    const ingestTool = page.locator('.rag-tool-name', { hasText: 'add_document' });
    await expect(ingestTool).toBeVisible();
    
    const searchTool = page.locator('.rag-tool-name', { hasText: 'search_docs' });
    await expect(searchTool).not.toBeVisible();
  });

  test('should switch to Manage category', async ({ page }) => {
    await page.click('.rag-category:has-text("Manage")');

    const manageButton = page.locator('.rag-category', { hasText: 'Manage' });
    await expect(manageButton).toHaveClass(/active/);

    const manageTool = page.locator('.rag-tool-name', { hasText: 'list_sources' });
    await expect(manageTool).toBeVisible();
  });
});
