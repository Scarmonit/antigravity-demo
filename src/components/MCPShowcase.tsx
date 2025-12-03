import React from 'react';

interface MCPServer {
    name: string;
    tools: number;
    status: 'active' | 'inactive';
    icon: string;
}

// Static data moved to module scope - prevents recreation on every render
const mcpServers: MCPServer[] = [
    {
        name: 'Antigravity Tools',
        tools: 6,
        status: 'active',
        icon: '🛠️',
    },
    {
        name: 'GitHub MCP',
        tools: 12,
        status: 'active',
        icon: '🐙',
    },
    {
        name: 'Sequential Thinking',
        tools: 3,
        status: 'active',
        icon: '🧠',
    },
    {
        name: 'Workspace Context',
        tools: 4,
        status: 'active',
        icon: '📁',
    },
    {
        name: 'RAG Server',
        tools: 13,
        status: 'active',
        icon: '🔍',
    },
];

// Pre-calculated since data is static
const activeTools = mcpServers.reduce((sum, server) => sum + server.tools, 0);

const MCPShowcase: React.FC = React.memo(() => {

    return (
        <div className="card mcp-showcase">
            <h2>MCP Integration</h2>
            <p className="mcp-description">
                Model Context Protocol servers powering Antigravity's capabilities
            </p>

            <div className="mcp-stats">
                <div className="mcp-stat">
                    <span className="mcp-stat-number">{mcpServers.length}</span>
                    <span className="mcp-stat-label">Servers</span>
                </div>
                <div className="mcp-stat">
                    <span className="mcp-stat-number">{activeTools}</span>
                    <span className="mcp-stat-label">Tools</span>
                </div>
            </div>

            <div className="mcp-servers">
                {mcpServers.map((server) => (
                    <div key={server.name} className="mcp-server">
                        <div className="mcp-server-header">
                            <span className="mcp-server-icon">{server.icon}</span>
                            <span className="mcp-server-name">{server.name}</span>
                        </div>
                        <div className="mcp-server-info">
                            <span className="mcp-server-tools">{server.tools} tools</span>
                            <span className={`mcp-server-status ${server.status}`}>
                                {server.status === 'active' ? '✓' : '○'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mcp-hint">
                <p>💡 MCP servers provide seamless AI tool integration</p>
            </div>
        </div>
    );
});

MCPShowcase.displayName = 'MCPShowcase';

export default MCPShowcase;
