import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FirebaseCard from './FirebaseCard'

describe('FirebaseCard', () => {
    it('renders the card with title', () => {
        render(<FirebaseCard />)

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Firebase Integration')
    })

    it('renders all Firebase features', () => {
        render(<FirebaseCard />)

        expect(screen.getByText('Connected Apps')).toBeInTheDocument()
        expect(screen.getByText('Firestore')).toBeInTheDocument()
        expect(screen.getByText('Authentication')).toBeInTheDocument()
        expect(screen.getByText('Cloud Functions')).toBeInTheDocument()
    })

    it('displays feature descriptions', () => {
        render(<FirebaseCard />)

        expect(screen.getByText('iOS, Android, Web platforms ready')).toBeInTheDocument()
        expect(screen.getByText('Real-time database integration')).toBeInTheDocument()
        expect(screen.getByText('Multiple auth providers supported')).toBeInTheDocument()
        expect(screen.getByText('Serverless backend ready')).toBeInTheDocument()
    })

    it('has correct CSS class', () => {
        const { container } = render(<FirebaseCard />)

        expect(container.querySelector('.info-card')).toBeInTheDocument()
    })

    it('renders feature cards', () => {
        const { container } = render(<FirebaseCard />)

        const featureCards = container.querySelectorAll('.firebase-feature')
        expect(featureCards).toHaveLength(4)
    })

    it('renders h3 headings for features', () => {
        render(<FirebaseCard />)

        const featureHeadings = screen.getAllByRole('heading', { level: 3 })
        expect(featureHeadings).toHaveLength(4)
    })
})
