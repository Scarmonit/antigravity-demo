import { describe, it, expect } from 'vitest'
import { features } from './features'

describe('features data', () => {
    it('is an array', () => {
        expect(Array.isArray(features)).toBe(true)
    })

    it('contains feature strings', () => {
        features.forEach(feature => {
            expect(typeof feature).toBe('string')
        })
    })

    it('has at least one feature', () => {
        expect(features.length).toBeGreaterThan(0)
    })

    it('features are non-empty strings', () => {
        features.forEach(feature => {
            expect(feature.trim().length).toBeGreaterThan(0)
        })
    })

    it('contains automation feature', () => {
        const hasAutomation = features.some(f => f.toLowerCase().includes('automation'))
        expect(hasAutomation).toBe(true)
    })

    it('contains MCP feature', () => {
        const hasMCP = features.some(f => f.toLowerCase().includes('mcp'))
        expect(hasMCP).toBe(true)
    })

    it('contains React feature', () => {
        const hasReact = features.some(f => f.toLowerCase().includes('react'))
        expect(hasReact).toBe(true)
    })
})
