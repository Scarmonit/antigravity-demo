import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import InteractiveCounter from './InteractiveCounter'

describe('InteractiveCounter', () => {
    const defaultProps = {
        count: 0,
        setCount: vi.fn(),
        resetCounter: vi.fn(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the counter with title', () => {
        render(<InteractiveCounter {...defaultProps} />)

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Interactive Counter')
    })

    it('displays the current count value', () => {
        render(<InteractiveCounter {...defaultProps} count={5} />)

        expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('displays zero count initially', () => {
        render(<InteractiveCounter {...defaultProps} />)

        expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('calls setCount with increment function when Increment is clicked', () => {
        const mockSetCount = vi.fn()
        render(<InteractiveCounter {...defaultProps} setCount={mockSetCount} />)

        const incrementButton = screen.getByRole('button', { name: /increment/i })
        fireEvent.click(incrementButton)

        expect(mockSetCount).toHaveBeenCalledTimes(1)
        // Verify it was called with a function
        expect(typeof mockSetCount.mock.calls[0][0]).toBe('function')
    })

    it('calls resetCounter when Reset is clicked', () => {
        const mockResetCounter = vi.fn()
        render(<InteractiveCounter {...defaultProps} resetCounter={mockResetCounter} />)

        const resetButton = screen.getByRole('button', { name: /reset/i })
        fireEvent.click(resetButton)

        expect(mockResetCounter).toHaveBeenCalledTimes(1)
    })

    it('increment function returns count + 1', () => {
        const mockSetCount = vi.fn()
        render(<InteractiveCounter {...defaultProps} count={10} setCount={mockSetCount} />)

        const incrementButton = screen.getByRole('button', { name: /increment/i })
        fireEvent.click(incrementButton)

        // Get the function that was passed to setCount and test it
        const incrementFn = mockSetCount.mock.calls[0][0]
        expect(incrementFn(10)).toBe(11)
        expect(incrementFn(0)).toBe(1)
        expect(incrementFn(-1)).toBe(0)
    })

    it('renders hint text', () => {
        render(<InteractiveCounter {...defaultProps} />)

        expect(screen.getByText(/Click buttons to test browser automation/i)).toBeInTheDocument()
    })

    it('has correct button classes', () => {
        render(<InteractiveCounter {...defaultProps} />)

        const incrementButton = screen.getByRole('button', { name: /increment/i })
        const resetButton = screen.getByRole('button', { name: /reset/i })

        expect(incrementButton).toHaveClass('counter-button', 'primary')
        expect(resetButton).toHaveClass('counter-button', 'secondary')
    })

    it('displays large count values correctly', () => {
        render(<InteractiveCounter {...defaultProps} count={999999} />)

        expect(screen.getByText('999999')).toBeInTheDocument()
    })
})
