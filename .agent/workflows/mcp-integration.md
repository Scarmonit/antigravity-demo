---
description: MCP Server integration guide for Antigravity
---

# MCP Integration Workflow

Guide to understanding and extending MCP (Model Context Protocol) server integration in Antigravity.

## Current MCP Servers

The Antigravity Demo showcases these active MCP servers:

### 1. Antigravity Tools (6 tools)
Custom development tools for Antigravity IDE:
- Project scaffolding
- Code analysis  
- Documentation generation
- Workflow templates
- Task breakdown
- Complexity estimation

### 2. GitHub MCP (12 tools)
GitHub integration for repository management:
- Repository operations
- Issue tracking
- Pull request management
- Code review
- Branch management
- And more

### 3. Sequential Thinking (3 tools)
AI reasoning and problem-solving:
- Sequential thought processing
- Multi-step analysis
- Iterative refinement

### 4. Workspace Context (4 tools)
Project context management:
- Git status tracking
- File system navigation
- Workspace awareness
- Context gathering

## Viewing MCP Configuration

Check your Antigravity settings for MCP servers:

```powershell
code C:\Users\scarm\AppData\Roaming\Antigravity\User\settings.json
```

Look for the `"mcpServers"` configuration section.

## Adding a New MCP Server

### 1. Create MCP Server Project

```bash
mkdir my-custom-mcp-server
cd my-custom-mcp-server
npm init -y
```

### 2. Install MCP SDK

```bash
npm install @modelcontextprotocol/sdk
```

### 3. Create Server Implementation

Create `src/index.ts`:

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
  name: 'my-custom-server',
  version: '1.0.0',
});

// Register your tools here
server.tool('my-tool', 'Description of what it does', {
  param1: { type: 'string', description: 'Parameter description' }
}, async (params) => {
  // Tool implementation
  return { result: 'Tool output' };
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

### 4. Build the Server

Add to package.json:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

Build:

// turbo
```bash
npm run build
```

### 5. Register with Antigravity

Add to Antigravity settings.json:

```json
{
  "mcpServers": {
    "my-custom-server": {
      "command": "node",
      "args": ["C:\\path\\to\\my-custom-mcp-server\\dist\\index.js"]
    }
  }
}
```

### 6. Restart Antigravity

Reload Antigravity to activate the new server.

## Updating the Demo's MCP Showcase

To add your new server to the demo's MCP showcase:

Edit `src/components/MCPShowcase.tsx`:

```typescript
const [mcpServers] = useState<MCPServer[]>([
  // ... existing servers ...
  {
    name: 'My Custom Server',
    tools: 5, // your tool count
    status: 'active',
    icon: '🔧', // choose an emoji
  },
]);
```

## Testing MCP Integration

1. Verify server appears in Antigravity's MCP server list
2. Test each tool individually
3. Check error handling
4. Verify tool outputs are correct
5. Test with concurrent requests

## MCP Resources

- **Official Docs**: https://modelcontextprotocol.io
- **SDK GitHub**: https://github.com/modelcontextprotocol/typescript-sdk
- **Examples**: Check `c:\Users\scarm\.gemini\antigravity\scratch\custom-mcp-servers`

##Best Practices

1. **Tool Naming**: Use clear, descriptive names
2. **Parameter Validation**: Always validate inputs
3. **Error Handling**: Provide meaningful error messages
4. **Documentation**: Document each tool's purpose and parameters
5. **Testing**: Test tools in isolation and integration
6. **Performance**: Optimize for quick response times
7. **Type Safety**: Use TypeScript for type checking

## Troubleshooting

### Server Not Appearing

1. Check settings.json syntax
2. Verify command path is correct
3. Check server builds without errors
4. Restart Antigravity completely

### Tools Not Working

1. Check server logs for errors
2. Verify parameter schemas match
3. Test tool logic independently
4. Check MCP SDK version compatibility

### Performance Issues

1. Profile tool execution time
2. Add caching where appropriate
3. Optimize heavy operations
4. Consider async/streaming for long operations
