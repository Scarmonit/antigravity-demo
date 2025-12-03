# Antigravity Demo

Production-ready React + TypeScript application built with Antigravity IDE workflows.

## Features

- ✅ React 18 + TypeScript
- ✅ Vite for fast development
- ✅ Modern glassmorphism UI design
- ✅ Fully responsive
- ✅ Interactive components
- ✅ Showcases Antigravity capabilities
- ✅ **Particle background** with mouse interaction
- ✅ **MCP server integration showcase**
- ✅ **Advanced animations** (glow, pulse effects)
- ✅ **Theme toggle** (dark/light modes)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Antigravity Workflows

This project includes automated workflow documentation:

- **[quickstart.md](.agent/workflows/quickstart.md)** - Getting started guide
- **[test-app.md](.agent/workflows/test-app.md)** - Testing procedures
- **[deploy.md](.agent/workflows/deploy.md)** - Deployment guide
- **[mcp-integration.md](.agent/workflows/mcp-integration.md)** - MCP server setup

Use Antigravity slash commands:
- `/quickstart` - Run quickstart workflow
- `/test-app` - Run testing workflow
- `/deploy` - Run deployment workflow
- `/mcp-integration` - View MCP integration guide

## MCP Server Integration

This demo showcases integration with 5 MCP servers providing 38 tools:

| Server | Tools | Purpose |
|--------|-------|---------|
| **Antigravity Tools** | 6 | Project scaffolding, code analysis, documentation |
| **GitHub MCP** | 12 | Repository management, PR/issue tracking |
| **Sequential Thinking** | 3 | AI reasoning and problem-solving |
| **Workspace Context** | 4 | Git status, file system, workspace awareness |
| **RAG Server** | 13 | Semantic search, document ingestion, vector store |

The `MCPShowcase` component displays real-time MCP server status. The dedicated `RAGShowcase` component provides an interactive view of the RAG server's 13 tools for semantic document search.

## Project Structure

```
antigravity-demo/
├── .agent/
│   └── workflows/           # Antigravity workflow automation
│       ├── quickstart.md
│       ├── test-app.md
│       ├── deploy.md
│       └── mcp-integration.md
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── StatsBar.tsx
│   │   ├── InteractiveCounter.tsx
│   │   ├── FeaturesCard.tsx
│   │   ├── MCPShowcase.tsx      # ⭐ NEW
│   │   ├── ParticleBackground.tsx # ⭐ NEW
│   │   ├── FirebaseCard.tsx
│   │   ├── WorkflowsCard.tsx
│   │   └── Footer.tsx
│   ├── App.tsx              # Main application
│   ├── App.css             # Styles with animations
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles
├── index.html               # HTML entry point
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── vite.config.ts           # Vite config
```

## Component Highlights

### ParticleBackground
- Canvas-based animation with 50 interactive particles
- Mouse interaction - particles react to cursor movement
- Theme-aware colors (adapts to dark/light mode)
- Smooth 60fps animations

### MCPShowcase
- Real-time display of active MCP servers
- Tool count and status indicators
- Interactive hover effects
- Extensible for adding new integrations

### RAGShowcase
- Interactive category tabs (Search, Ingest, Manage)
- Displays all 13 RAG server tools
- Tech stack badges (ChromaDB, MiniLM-L6-v2, FastMCP)
- Semantic search capability highlights

## Built With

- **Antigravity IDE** - AI-powered development
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Modern CSS** - Glassmorphism design with advanced animations

## Development

This project demonstrates:
- Full automation with turbo-mode workflows
- MCP server integration (5 servers, 38 tools)
- Browser subagent capabilities
- Modern web development best practices
- Particle effects and advanced CSS animations
- Theme switching and responsive design

---

**Created with Antigravity** • Node.js v22.21.0 • npm 11.6.4
