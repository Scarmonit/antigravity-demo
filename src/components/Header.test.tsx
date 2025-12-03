import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
    it('renders the header with title and subtitle', () => {
        const mockToggleTheme = vi.fn()
        render(<Header theme="dark" toggleTheme={mockToggleTheme} />)

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Antigravity Demo')
        expect(screen.getByText(/Production-ready web application/i)).toBeInTheDocument()
    })

    it('displays sun emoji when theme is dark', () => {
        const mockToggleTheme = vi.fn()
        render(<Header theme="dark" toggleTheme={mockToggleTheme} />)

        const button = screen.getByRole('button', { name: /toggle theme/i })
        expect(button).toHaveTextContent('\u2600\uFE0F') // Sun emoji
    })

    it('displays moon emoji when theme is light', () => {
        const mockToggleTheme = vi.fn()
        render(<Header theme="light" toggleTheme={mockToggleTheme} />)

        const button = screen.getByRole('button', { name: /toggle theme/i })
        expect(button).toHaveTextContent('\uD83C\uDF19') // Moon emoji
    })

    it('calls toggleTheme when button is clicked', () => {
        const mockToggleTheme = vi.fn()
        render(<Header theme="dark" toggleTheme={mockToggleTheme} />)

        const button = screen.getByRole('button', { name: /toggle theme/i })
        fireEvent.click(button)

        expect(mockToggleTheme).toHaveBeenCalledTimes(1)
    })

    it('has correct CSS classes', () => {
        const mockToggleTheme = vi.fn()
        render(<Header theme="dark" toggleTheme={mockToggleTheme} />)

        expect(screen.getByRole('banner')).toHaveClass('app-header')
    })
})
