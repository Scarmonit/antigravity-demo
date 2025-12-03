import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FeaturesCard from './FeaturesCard'
import { Feature } from '../data/features'

describe('FeaturesCard', () => {
    it('renders the card with title', () => {
        render(<FeaturesCard features={[]} />)

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Antigravity Features')
    })

    it('renders an empty list when no features provided', () => {
        render(<FeaturesCard features={[]} />)

        const list = screen.getByRole('list')
        expect(list).toBeInTheDocument()
        expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    })

    it('renders all provided features', () => {
        const features: Feature[] = [
            { id: 'feature-1', text: 'Feature 1' },
            { id: 'feature-2', text: 'Feature 2' },
            { id: 'feature-3', text: 'Feature 3' },
        ]
        render(<FeaturesCard features={features} />)

        const listItems = screen.getAllByRole('listitem')
        expect(listItems).toHaveLength(3)
    })

    it('displays feature text correctly', () => {
        const features: Feature[] = [
            { id: 'test-feature', text: 'Test feature with special chars: @#$%' }
        ]
        render(<FeaturesCard features={features} />)

        expect(screen.getByText('Test feature with special chars: @#$%')).toBeInTheDocument()
    })

    it('renders features with emojis', () => {
        const features: Feature[] = [
            { id: 'automation', text: '\u2705 Full automation with turbo-mode workflows' },
            { id: 'firebase', text: '\uD83D\uDD25 Firebase MCP integration ready' },
        ]
        render(<FeaturesCard features={features} />)

        expect(screen.getByText(/Full automation/i)).toBeInTheDocument()
        expect(screen.getByText(/Firebase MCP/i)).toBeInTheDocument()
    })

    it('has correct CSS classes', () => {
        render(<FeaturesCard features={[{ id: 'test', text: 'Test' }]} />)

        const card = screen.getByRole('heading', { level: 2 }).parentElement
        expect(card).toHaveClass('features-card')

        const list = screen.getByRole('list')
        expect(list).toHaveClass('features-list')
    })

    it('renders list items with feature-item class', () => {
        const features: Feature[] = [
            { id: 'feature-1', text: 'Feature 1' },
            { id: 'feature-2', text: 'Feature 2' }
        ]
        render(<FeaturesCard features={features} />)

        const listItems = screen.getAllByRole('listitem')
        listItems.forEach(item => {
            expect(item).toHaveClass('feature-item')
        })
    })

    it('handles many features', () => {
        const features: Feature[] = Array.from({ length: 50 }, (_, i) => ({
            id: `feature-${i + 1}`,
            text: `Feature ${i + 1}`
        }))
        render(<FeaturesCard features={features} />)

        const listItems = screen.getAllByRole('listitem')
        expect(listItems).toHaveLength(50)
    })
})
