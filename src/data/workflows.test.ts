import { describe, it, expect } from 'vitest'
import { workflows } from './workflows'

describe('workflows data', () => {
    it('is an array', () => {
        expect(Array.isArray(workflows)).toBe(true)
    })

    it('has at least one workflow', () => {
        expect(workflows.length).toBeGreaterThan(0)
    })

    it('each workflow has title and description', () => {
        workflows.forEach(workflow => {
            expect(workflow).toHaveProperty('title')
            expect(workflow).toHaveProperty('description')
        })
    })

    it('workflow titles are non-empty strings', () => {
        workflows.forEach(workflow => {
            expect(typeof workflow.title).toBe('string')
            expect(workflow.title.trim().length).toBeGreaterThan(0)
        })
    })

    it('workflow descriptions are non-empty strings', () => {
        workflows.forEach(workflow => {
            expect(typeof workflow.description).toBe('string')
            expect(workflow.description.trim().length).toBeGreaterThan(0)
        })
    })

    it('contains create-webapp workflow', () => {
        const hasCreateWebapp = workflows.some(w =>
            w.title.toLowerCase().includes('create-webapp') ||
            w.title.toLowerCase().includes('webapp')
        )
        expect(hasCreateWebapp).toBe(true)
    })

    it('contains browser-testing workflow', () => {
        const hasBrowserTesting = workflows.some(w =>
            w.title.toLowerCase().includes('browser') ||
            w.description.toLowerCase().includes('testing')
        )
        expect(hasBrowserTesting).toBe(true)
    })

    it('contains mcp-server workflow', () => {
        const hasMCPServer = workflows.some(w =>
            w.title.toLowerCase().includes('mcp') ||
            w.description.toLowerCase().includes('mcp')
        )
        expect(hasMCPServer).toBe(true)
    })

    it('contains cicd workflow', () => {
        const hasCICD = workflows.some(w =>
            w.title.toLowerCase().includes('cicd') ||
            w.description.toLowerCase().includes('github actions') ||
            w.description.toLowerCase().includes('pipeline')
        )
        expect(hasCICD).toBe(true)
    })
})
