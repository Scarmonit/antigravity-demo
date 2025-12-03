import { test, expect } from '@playwright/test';

test.describe('MCP Showcase', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait for lazy-loaded MCP showcase component
    await page.waitForSelector('.mcp-showcase', { timeout: 30000 });
  });

  test('should display the MCP showcase card', async ({ page }) => {
    const mcpShowcase = page.locator('.mcp-showcase');
    await expect(mcpShowcase).toBeVisible();
    await expect(page.getByRole('heading', { name: 'MCP Integration' })).toBeVisible();
  });

  test('should display correct server and tool counts', async ({ page }) => {
    const serverCount = page.locator('.mcp-stat-number').first();
    await expect(serverCount).toHaveText('5');

    const toolCount = page.locator('.mcp-stat-number').nth(1);
    await expect(toolCount).toHaveText('38');
  });

  test('should list all MCP servers with their details', async ({ page }) => {
    const servers = [
      { name: 'Antigravity Tools', tools: 6, icon: '🛠️' },
      { name: 'GitHub MCP', tools: 12, icon: '🐙' },
      { name: 'Sequential Thinking', tools: 3, icon: '🧠' },
      { name: 'Workspace Context', tools: 4, icon: '📁' },
      { name: 'RAG Server', tools: 13, icon: '🔍' },
    ];

    for (const server of servers) {
      const serverLocator = page.locator('.mcp-server', { hasText: server.name });
      await expect(serverLocator).toBeVisible();
      await expect(serverLocator.locator('.mcp-server-icon')).toHaveText(server.icon);
      await expect(serverLocator.locator('.mcp-server-tools')).toHaveText(`${server.tools} tools`);
      await expect(serverLocator.locator('.mcp-server-status')).toHaveClass(/active/);
    }
  });
});