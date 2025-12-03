import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatsBar from './StatsBar'

describe('StatsBar', () => {
    const defaultProps = {
        stats: {
            workflows: 5,
            tools: 25,
            deployments: '\u221E',
        },
        count: 0,
    }

    it('renders all stat items', () => {
        render(<StatsBar {...defaultProps} />)

        expect(screen.getByText('Workflows')).toBeInTheDocument()
        expect(screen.getByText('MCP Tools')).toBeInTheDocument()
        expect(screen.getByText('Deployments')).toBeInTheDocument()
        expect(screen.getByText('Button Clicks')).toBeInTheDocument()
    })

    it('displays correct workflow count', () => {
        render(<StatsBar {...defaultProps} />)

        expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('displays correct tools count', () => {
        render(<StatsBar {...defaultProps} />)

        expect(screen.getByText('25')).toBeInTheDocument()
    })

    it('displays infinity symbol for deployments', () => {
        render(<StatsBar {...defaultProps} />)

        expect(screen.getByText('\u221E')).toBeInTheDocument()
    })

    it('displays button click count', () => {
        render(<StatsBar {...defaultProps} count={42} />)

        expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('updates when count changes', () => {
        const { rerender } = render(<StatsBar {...defaultProps} count={0} />)
        expect(screen.getByText('0')).toBeInTheDocument()

        rerender(<StatsBar {...defaultProps} count={100} />)
        expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('has correct CSS class', () => {
        const { container } = render(<StatsBar {...defaultProps} />)

        expect(container.querySelector('.stats-bar')).toBeInTheDocument()
    })

    it('renders stat items with correct classes', () => {
        const { container } = render(<StatsBar {...defaultProps} />)

        const statItems = container.querySelectorAll('.stat-item')
        expect(statItems).toHaveLength(4)
    })

    it('handles different stats values', () => {
        const customStats = {
            stats: {
                workflows: 100,
                tools: 500,
                deployments: '999+',
            },
            count: 9999,
        }
        render(<StatsBar {...customStats} />)

        expect(screen.getByText('100')).toBeInTheDocument()
        expect(screen.getByText('500')).toBeInTheDocument()
        expect(screen.getByText('999+')).toBeInTheDocument()
        expect(screen.getByText('9999')).toBeInTheDocument()
    })
})
