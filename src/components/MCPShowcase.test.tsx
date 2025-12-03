import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MCPShowcase from './MCPShowcase'

describe('MCPShowcase', () => {
    it('renders the card with title', () => {
        render(<MCPShowcase />)

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('MCP Integration')
    })

    it('displays description text', () => {
        render(<MCPShowcase />)

        expect(screen.getByText(/Model Context Protocol servers/i)).toBeInTheDocument()
    })

    it('displays server count stat', () => {
        render(<MCPShowcase />)

        expect(screen.getByText('5')).toBeInTheDocument()
        expect(screen.getByText('Servers')).toBeInTheDocument()
    })

    it('displays total tools count', () => {
        render(<MCPShowcase />)

        // 6 + 12 + 3 + 4 + 13 = 38 tools
        expect(screen.getByText('38')).toBeInTheDocument()
        expect(screen.getByText('Tools')).toBeInTheDocument()
    })

    it('renders all MCP servers', () => {
        render(<MCPShowcase />)

        expect(screen.getByText('Antigravity Tools')).toBeInTheDocument()
        expect(screen.getByText('GitHub MCP')).toBeInTheDocument()
        expect(screen.getByText('Sequential Thinking')).toBeInTheDocument()
        expect(screen.getByText('Workspace Context')).toBeInTheDocument()
        expect(screen.getByText('RAG Server')).toBeInTheDocument()
    })

    it('displays tools count for each server', () => {
        render(<MCPShowcase />)

        expect(screen.getByText('6 tools')).toBeInTheDocument()
        expect(screen.getByText('12 tools')).toBeInTheDocument()
        expect(screen.getByText('3 tools')).toBeInTheDocument()
        expect(screen.getByText('4 tools')).toBeInTheDocument()
        expect(screen.getByText('13 tools')).toBeInTheDocument()
    })

    it('displays server icons', () => {
        render(<MCPShowcase />)

        // Check for emoji icons
        expect(screen.getByText('\uD83D\uDEE0\uFE0F')).toBeInTheDocument() // Tools
        expect(screen.getByText('\uD83D\uDC19')).toBeInTheDocument() // GitHub
        expect(screen.getByText('\uD83E\uDDE0')).toBeInTheDocument() // Brain
        expect(screen.getByText('\uD83D\uDCC1')).toBeInTheDocument() // Folder
        expect(screen.getByText('\uD83D\uDD0D')).toBeInTheDocument() // Search
    })

    it('displays hint text', () => {
        render(<MCPShowcase />)

        expect(screen.getByText(/MCP servers provide seamless AI tool integration/i)).toBeInTheDocument()
    })

    it('has correct CSS classes', () => {
        const { container } = render(<MCPShowcase />)

        expect(container.querySelector('.mcp-showcase')).toBeInTheDocument()
        expect(container.querySelector('.card')).toBeInTheDocument()
    })

    it('renders server items with correct structure', () => {
        const { container } = render(<MCPShowcase />)

        const serverItems = container.querySelectorAll('.mcp-server')
        expect(serverItems).toHaveLength(5)
    })

    it('shows active status for all servers', () => {
        const { container } = render(<MCPShowcase />)

        const activeStatuses = container.querySelectorAll('.mcp-server-status.active')
        expect(activeStatuses).toHaveLength(5)
    })
})
