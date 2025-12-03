import { describe, it, expect } from 'vitest'
import { features } from './features'

describe('features data', () => {
    it('is an array', () => {
        expect(Array.isArray(features)).toBe(true)
    })

    it('contains feature objects', () => {
        features.forEach(feature => {
            expect(typeof feature).toBe('object')
            expect(feature).toHaveProperty('id')
            expect(feature).toHaveProperty('text')
        })
    })

    it('has at least one feature', () => {
        expect(features.length).toBeGreaterThan(0)
    })

    it('features have non-empty text and id', () => {
        features.forEach(feature => {
            expect(feature.text.trim().length).toBeGreaterThan(0)
            expect(feature.id.trim().length).toBeGreaterThan(0)
        })
    })

    it('contains automation feature', () => {
        const hasAutomation = features.some(f => f.text.toLowerCase().includes('automation'))
        expect(hasAutomation).toBe(true)
    })

    it('contains MCP feature', () => {
        const hasMCP = features.some(f => f.text.toLowerCase().includes('mcp'))
        expect(hasMCP).toBe(true)
    })

    it('contains React feature', () => {
        const hasReact = features.some(f => f.text.toLowerCase().includes('react'))
        expect(hasReact).toBe(true)
    })
})
