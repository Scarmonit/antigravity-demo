import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
    it('renders the footer element', () => {
        render(<Footer />)

        expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('displays build information', () => {
        render(<Footer />)

        expect(screen.getByText(/Built with Antigravity/i)).toBeInTheDocument()
        expect(screen.getByText(/Node\.js/i)).toBeInTheDocument()
        expect(screen.getByText(/npm/i)).toBeInTheDocument()
    })

    it('renders documentation link', () => {
        render(<Footer />)

        const docLink = screen.getByRole('link', { name: /documentation/i })
        expect(docLink).toBeInTheDocument()
        expect(docLink).toHaveAttribute('href', 'https://antigravity.google')
        expect(docLink).toHaveAttribute('target', '_blank')
        expect(docLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('renders Firebase link', () => {
        render(<Footer />)

        const firebaseLink = screen.getByRole('link', { name: /firebase/i })
        expect(firebaseLink).toBeInTheDocument()
        expect(firebaseLink).toHaveAttribute('href', 'https://firebase.google.com')
        expect(firebaseLink).toHaveAttribute('target', '_blank')
        expect(firebaseLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('has correct CSS class', () => {
        render(<Footer />)

        expect(screen.getByRole('contentinfo')).toHaveClass('app-footer')
    })

    it('opens links in new tab securely', () => {
        render(<Footer />)

        const links = screen.getAllByRole('link')
        links.forEach(link => {
            expect(link).toHaveAttribute('target', '_blank')
            expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        })
    })
})
