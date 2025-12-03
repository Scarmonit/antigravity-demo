import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

// Mock lazy-loaded components
vi.mock('./components/FirebaseCard', () => ({
    default: () => <div data-testid="firebase-card">Firebase Card</div>,
}))

vi.mock('./components/WorkflowsCard', () => ({
    default: () => <div data-testid="workflows-card">Workflows Card</div>,
}))

vi.mock('./components/ParticleBackground', () => ({
    default: () => <div data-testid="particle-background">Particle Background</div>,
}))

vi.mock('./components/MCPShowcase', () => ({
    default: () => <div data-testid="mcp-showcase">MCP Showcase</div>,
}))

vi.mock('./components/RAGShowcase', () => ({
    default: () => <div data-testid="rag-showcase">RAG Showcase</div>,
}))

vi.mock('./components/PerformanceMetrics', () => ({
    default: () => <div data-testid="performance-metrics">Performance Metrics</div>,
}))

describe('App', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        document.body.className = ''
    })

    it('renders the app', () => {
        render(<App />)

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Antigravity Demo')
    })

    it('renders the header component', () => {
        render(<App />)

        expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('renders the footer component', () => {
        render(<App />)

        expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('renders the counter component', () => {
        render(<App />)

        expect(screen.getByText('Interactive Counter')).toBeInTheDocument()
        // Check for counter value in counter-value span
        const counterValue = document.querySelector('.counter-value')
        expect(counterValue).toHaveTextContent('0')
    })

    it('increments counter on button click', async () => {
        render(<App />)

        const incrementButton = screen.getByRole('button', { name: /increment/i })
        fireEvent.click(incrementButton)

        await waitFor(() => {
            const counterValue = document.querySelector('.counter-value')
            expect(counterValue).toHaveTextContent('1')
        })
    })

    it('resets counter on reset button click', async () => {
        render(<App />)

        const incrementButton = screen.getByRole('button', { name: /increment/i })
        fireEvent.click(incrementButton)
        fireEvent.click(incrementButton)

        const resetButton = screen.getByRole('button', { name: /reset/i })
        fireEvent.click(resetButton)

        await waitFor(() => {
            const counterValue = document.querySelector('.counter-value')
            expect(counterValue).toHaveTextContent('0')
        })
    })

    it('toggles theme on button click', () => {
        render(<App />)

        const themeButton = screen.getByTitle('Toggle Theme')

        // Initially dark theme (shows sun)
        expect(themeButton.textContent).toContain('\u2600')

        fireEvent.click(themeButton)

        // After toggle, light theme (shows moon)
        expect(themeButton.textContent).toContain('\uD83C\uDF19')
    })

    it('updates body class on theme change', () => {
        render(<App />)

        expect(document.body.className).toBe('dark')

        const themeButton = screen.getByTitle('Toggle Theme')
        fireEvent.click(themeButton)

        expect(document.body.className).toBe('light')
    })

    it('renders features card with features', async () => {
        render(<App />)

        await waitFor(() => {
            expect(screen.getByText('Antigravity Features')).toBeInTheDocument()
        })
    })

    it('renders stats bar', () => {
        render(<App />)

        expect(screen.getByText('Workflows')).toBeInTheDocument()
        expect(screen.getByText('MCP Tools')).toBeInTheDocument()
        expect(screen.getByText('Deployments')).toBeInTheDocument()
    })

    it('applies correct theme class to app container', () => {
        const { container } = render(<App />)

        const app = container.querySelector('.app')
        expect(app).toHaveClass('theme-dark')

        const themeButton = screen.getByTitle('Toggle Theme')
        fireEvent.click(themeButton)

        expect(app).toHaveClass('theme-light')
    })

    it('renders lazy-loaded components', async () => {
        render(<App />)

        await waitFor(() => {
            expect(screen.getByTestId('particle-background')).toBeInTheDocument()
            expect(screen.getByTestId('mcp-showcase')).toBeInTheDocument()
            expect(screen.getByTestId('rag-showcase')).toBeInTheDocument()
            expect(screen.getByTestId('firebase-card')).toBeInTheDocument()
            expect(screen.getByTestId('workflows-card')).toBeInTheDocument()
            expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
        })
    })

    it('has main content area', () => {
        render(<App />)

        expect(screen.getByRole('main')).toBeInTheDocument()
    })
})
