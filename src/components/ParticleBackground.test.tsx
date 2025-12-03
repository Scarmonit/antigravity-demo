import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import ParticleBackground from './ParticleBackground'

describe('ParticleBackground', () => {
    let mockContext: {
        clearRect: ReturnType<typeof vi.fn>
        beginPath: ReturnType<typeof vi.fn>
        arc: ReturnType<typeof vi.fn>
        fill: ReturnType<typeof vi.fn>
        moveTo: ReturnType<typeof vi.fn>
        lineTo: ReturnType<typeof vi.fn>
        stroke: ReturnType<typeof vi.fn>
        fillStyle: string
        strokeStyle: string
        lineWidth: number
    }

    beforeEach(() => {
        mockContext = {
            clearRect: vi.fn(),
            beginPath: vi.fn(),
            arc: vi.fn(),
            fill: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            stroke: vi.fn(),
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 0,
        }

        HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockContext)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('renders a canvas element', () => {
        const { container } = render(<ParticleBackground theme="dark" />)

        const canvas = container.querySelector('canvas')
        expect(canvas).toBeInTheDocument()
    })

    it('has fixed positioning style', () => {
        const { container } = render(<ParticleBackground theme="dark" />)

        const canvas = container.querySelector('canvas')
        expect(canvas).toHaveStyle({ position: 'fixed' })
    })

    it('has pointer-events none', () => {
        const { container } = render(<ParticleBackground theme="dark" />)

        const canvas = container.querySelector('canvas')
        expect(canvas).toHaveStyle({ pointerEvents: 'none' })
    })

    it('has correct z-index', () => {
        const { container } = render(<ParticleBackground theme="dark" />)

        const canvas = container.querySelector('canvas')
        expect(canvas).toHaveStyle({ zIndex: '0' })
    })

    it('has opacity set', () => {
        const { container } = render(<ParticleBackground theme="dark" />)

        const canvas = container.querySelector('canvas')
        expect(canvas).toHaveStyle({ opacity: '0.4' })
    })

    it('gets 2d context from canvas', () => {
        render(<ParticleBackground theme="dark" />)

        expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d')
    })

    it('accepts theme prop', () => {
        const { rerender } = render(<ParticleBackground theme="dark" />)

        // Should not throw
        rerender(<ParticleBackground theme="light" />)
    })

    it('has full width and height', () => {
        const { container } = render(<ParticleBackground theme="dark" />)

        const canvas = container.querySelector('canvas')
        expect(canvas).toHaveStyle({ width: '100%' })
        expect(canvas).toHaveStyle({ height: '100%' })
    })

    it('positions at top left', () => {
        const { container } = render(<ParticleBackground theme="dark" />)

        const canvas = container.querySelector('canvas')
        expect(canvas).toHaveStyle({ top: '0' })
        expect(canvas).toHaveStyle({ left: '0' })
    })
})
