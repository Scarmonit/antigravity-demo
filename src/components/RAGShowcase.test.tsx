import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RAGShowcase from './RAGShowcase'

describe('RAGShowcase', () => {
    it('renders the card with title', () => {
        render(<RAGShowcase />)

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('RAG MCP Server')
    })

    it('displays description text', () => {
        render(<RAGShowcase />)

        expect(screen.getByText(/Semantic document search/i)).toBeInTheDocument()
        expect(screen.getByText(/ChromaDB/i)).toBeInTheDocument()
    })

    it('displays feature stats', () => {
        render(<RAGShowcase />)

        expect(screen.getByText('384')).toBeInTheDocument()
        expect(screen.getByText('Dimensions')).toBeInTheDocument()
        expect(screen.getByText('13')).toBeInTheDocument()
        expect(screen.getByText('Tools')).toBeInTheDocument()
        expect(screen.getByText('HNSW')).toBeInTheDocument()
        expect(screen.getByText('Index')).toBeInTheDocument()
    })

    it('renders category buttons', () => {
        render(<RAGShowcase />)

        expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /ingest/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /manage/i })).toBeInTheDocument()
    })

    it('shows search tools by default', () => {
        render(<RAGShowcase />)

        expect(screen.getByText('search_docs')).toBeInTheDocument()
        expect(screen.getByText('hybrid_search')).toBeInTheDocument()
        expect(screen.getByText('search_with_threshold')).toBeInTheDocument()
    })

    it('switches to ingest tools on category click', () => {
        render(<RAGShowcase />)

        const ingestButton = screen.getByRole('button', { name: /ingest/i })
        fireEvent.click(ingestButton)

        expect(screen.getByText('add_document')).toBeInTheDocument()
        expect(screen.getByText('add_documents_batch')).toBeInTheDocument()
        expect(screen.getByText('ingest_file')).toBeInTheDocument()
        expect(screen.getByText('ingest_url')).toBeInTheDocument()
    })

    it('switches to manage tools on category click', () => {
        render(<RAGShowcase />)

        const manageButton = screen.getByRole('button', { name: /manage/i })
        fireEvent.click(manageButton)

        expect(screen.getByText('list_sources')).toBeInTheDocument()
        expect(screen.getByText('delete_source')).toBeInTheDocument()
        expect(screen.getByText('export_documents')).toBeInTheDocument()
        expect(screen.getByText('get_stats')).toBeInTheDocument()
        expect(screen.getByText('health_check')).toBeInTheDocument()
    })

    it('applies active class to selected category', () => {
        render(<RAGShowcase />)

        const searchButton = screen.getByRole('button', { name: /search/i })
        expect(searchButton).toHaveClass('active')

        const ingestButton = screen.getByRole('button', { name: /ingest/i })
        fireEvent.click(ingestButton)
        expect(ingestButton).toHaveClass('active')
        expect(searchButton).not.toHaveClass('active')
    })

    it('displays tool descriptions', () => {
        render(<RAGShowcase />)

        expect(screen.getByText('Semantic search with filtering')).toBeInTheDocument()
        expect(screen.getByText('Semantic + keyword search')).toBeInTheDocument()
    })

    it('renders tech badges', () => {
        render(<RAGShowcase />)

        expect(screen.getByText('ChromaDB')).toBeInTheDocument()
        expect(screen.getByText('MiniLM-L6-v2')).toBeInTheDocument()
        expect(screen.getByText('FastMCP')).toBeInTheDocument()
    })

    it('has correct CSS classes', () => {
        const { container } = render(<RAGShowcase />)

        expect(container.querySelector('.rag-showcase')).toBeInTheDocument()
        expect(container.querySelector('.card')).toBeInTheDocument()
    })
})
