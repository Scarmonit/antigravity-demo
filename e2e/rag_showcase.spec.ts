import { test, expect } from '@playwright/test';

test.describe('RAG Showcase Interactivity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait for lazy-loaded RAG showcase component
    await page.waitForSelector('.rag-showcase', { timeout: 30000 });
    // Wait for category buttons to render inside the showcase
    await page.waitForSelector('button.rag-category', { timeout: 10000 });
  });

  test('should default to Search category and show all search tools', async ({ page }) => {
    const searchButton = page.locator('button.rag-category', { hasText: 'Search' });
    await expect(searchButton).toHaveClass(/active/);

    const searchTools = ['search_docs', 'hybrid_search', 'search_with_threshold'];
    for (const tool of searchTools) {
      await expect(page.getByText(tool, { exact: true })).toBeVisible();
    }

    const ingestTool = page.getByText('add_document', { exact: true });
    await expect(ingestTool).toBeHidden();
  });

  test('should switch to Ingest category and show all ingest tools', async ({ page }) => {
    const ingestButton = page.locator('button.rag-category', { hasText: 'Ingest' });
    await ingestButton.click();
    await expect(ingestButton).toHaveClass(/active/);

    // Wait for the first new tool to be visible to avoid race conditions
    await expect(page.getByText('add_document', { exact: true })).toBeVisible();

    const ingestTools = ['add_document', 'add_documents_batch', 'ingest_file', 'ingest_url', 'chunk_document'];
    for (const tool of ingestTools) {
      await expect(page.getByText(tool, { exact: true })).toBeVisible();
    }

    const searchTool = page.getByText('search_docs', { exact: true });
    await expect(searchTool).toBeHidden();
  });

  test('should switch to Manage category and show all manage tools', async ({ page }) => {
    const manageButton = page.locator('button.rag-category', { hasText: 'Manage' });
    await manageButton.click();
    await expect(manageButton).toHaveClass(/active/);

    // Wait for the first new tool to be visible to avoid race conditions
    await expect(page.getByText('list_sources', { exact: true })).toBeVisible();

    const manageTools = ['list_sources', 'delete_source', 'export_documents', 'get_stats', 'health_check'];
    for (const tool of manageTools) {
      await expect(page.getByText(tool, { exact: true })).toBeVisible();
    }
  });
});
