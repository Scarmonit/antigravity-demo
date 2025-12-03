import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import WorkflowsCard from './WorkflowsCard'

// Mock the workflows data (matching src/data/workflows.ts)
vi.mock('../data/workflows', () => ({
    workflows: [
        { id: 'create-webapp', title: '\uD83D\uDCF1 create-webapp', description: 'Scaffold full-stack applications' },
        { id: 'browser-testing', title: '\uD83C\uDF10 browser-testing', description: 'Automated testing workflows' },
        { id: 'build-mcp-server', title: '\uD83D\uDD0C build-mcp-server', description: 'Custom MCP server development' },
        { id: 'setup-cicd', title: '\uD83D\uDE80 setup-cicd', description: 'GitHub Actions pipelines' },
    ],
}))

describe('WorkflowsCard', () => {
    it('renders the card with title', () => {
        render(<WorkflowsCard />)

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Available Workflows')
    })

    it('renders all workflows from data', () => {
        render(<WorkflowsCard />)

        expect(screen.getByText('\uD83D\uDCF1 create-webapp')).toBeInTheDocument()
        expect(screen.getByText('\uD83C\uDF10 browser-testing')).toBeInTheDocument()
        expect(screen.getByText('\uD83D\uDD0C build-mcp-server')).toBeInTheDocument()
    })

    it('renders workflow descriptions', () => {
        render(<WorkflowsCard />)

        expect(screen.getByText('Scaffold full-stack applications')).toBeInTheDocument()
        expect(screen.getByText('Automated testing workflows')).toBeInTheDocument()
        expect(screen.getByText('Custom MCP server development')).toBeInTheDocument()
    })

    it('has correct CSS class', () => {
        const { container } = render(<WorkflowsCard />)

        expect(container.querySelector('.info-card')).toBeInTheDocument()
    })

    it('renders workflow items with h3 titles', () => {
        render(<WorkflowsCard />)

        const workflowTitles = screen.getAllByRole('heading', { level: 3 })
        expect(workflowTitles).toHaveLength(4)
    })

    it('renders workflow containers', () => {
        const { container } = render(<WorkflowsCard />)

        const workflowElements = container.querySelectorAll('.workflow')
        expect(workflowElements).toHaveLength(4)
    })
})
