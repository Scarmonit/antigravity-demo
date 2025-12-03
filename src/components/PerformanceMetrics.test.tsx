import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PerformanceMetrics from './PerformanceMetrics'

// Mock web-vitals
vi.mock('web-vitals', () => ({
    onCLS: vi.fn(),
    onINP: vi.fn(),
    onLCP: vi.fn(),
    onFCP: vi.fn(),
    onTTFB: vi.fn(),
}))

describe('PerformanceMetrics', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the card with title', () => {
        render(<PerformanceMetrics />)

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Performance Metrics')
    })

    it('displays description text', () => {
        render(<PerformanceMetrics />)

        expect(screen.getByText(/Core Web Vitals monitoring/i)).toBeInTheDocument()
    })

    it('renders core vital cards', () => {
        render(<PerformanceMetrics />)

        expect(screen.getByText('LCP')).toBeInTheDocument()
        expect(screen.getByText('INP')).toBeInTheDocument()
        expect(screen.getByText('CLS')).toBeInTheDocument()
    })

    it('displays vital descriptions', () => {
        render(<PerformanceMetrics />)

        expect(screen.getByText('Largest Contentful Paint')).toBeInTheDocument()
        expect(screen.getByText('Interaction to Next Paint')).toBeInTheDocument()
        expect(screen.getByText('Cumulative Layout Shift')).toBeInTheDocument()
    })

    it('shows pending state initially', () => {
        render(<PerformanceMetrics />)

        // All metrics should show '—' when pending
        const dashValues = screen.getAllByText('\u2014') // em dash
        expect(dashValues.length).toBeGreaterThanOrEqual(3)
    })

    it('hides additional metrics by default', () => {
        render(<PerformanceMetrics />)

        expect(screen.queryByText('First Contentful Paint')).not.toBeInTheDocument()
        expect(screen.queryByText('Time to First Byte')).not.toBeInTheDocument()
    })

    it('shows additional metrics when button is clicked', () => {
        render(<PerformanceMetrics />)

        const toggleButton = screen.getByRole('button', { name: /show additional metrics/i })
        fireEvent.click(toggleButton)

        expect(screen.getByText('First Contentful Paint')).toBeInTheDocument()
        expect(screen.getByText('Time to First Byte')).toBeInTheDocument()
    })

    it('hides additional metrics when button is clicked again', () => {
        render(<PerformanceMetrics />)

        const toggleButton = screen.getByRole('button', { name: /show additional metrics/i })
        fireEvent.click(toggleButton)
        expect(screen.getByText('First Contentful Paint')).toBeInTheDocument()

        const hideButton = screen.getByRole('button', { name: /hide additional metrics/i })
        fireEvent.click(hideButton)
        expect(screen.queryByText('First Contentful Paint')).not.toBeInTheDocument()
    })

    it('has aria-expanded attribute on toggle button', () => {
        render(<PerformanceMetrics />)

        const toggleButton = screen.getByRole('button', { name: /show additional metrics/i })
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

        fireEvent.click(toggleButton)
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('displays hint text', () => {
        render(<PerformanceMetrics />)

        expect(screen.getByText(/Core Web Vitals measure real user experience/i)).toBeInTheDocument()
    })

    it('has correct CSS classes', () => {
        const { container } = render(<PerformanceMetrics />)

        expect(container.querySelector('.performance-metrics')).toBeInTheDocument()
        expect(container.querySelector('.card')).toBeInTheDocument()
    })

    it('renders vitals grid', () => {
        const { container } = render(<PerformanceMetrics />)

        expect(container.querySelector('.vitals-grid')).toBeInTheDocument()
    })
})
