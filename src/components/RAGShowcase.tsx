import React, { useState } from 'react';

interface RAGTool {
    name: string;
    description: string;
    category: 'search' | 'ingest' | 'manage';
}

const RAGShowcase: React.FC = React.memo(() => {
    const [activeCategory, setActiveCategory] = useState<'search' | 'ingest' | 'manage'>('search');

    const tools: RAGTool[] = [
        { name: 'search_docs', description: 'Semantic search with filtering', category: 'search' },
        { name: 'hybrid_search', description: 'Semantic + keyword search', category: 'search' },
        { name: 'search_with_threshold', description: 'Similarity threshold filtering', category: 'search' },
        { name: 'add_document', description: 'Add single document', category: 'ingest' },
        { name: 'add_documents_batch', description: 'Bulk add up to 100 docs', category: 'ingest' },
        { name: 'ingest_file', description: 'Ingest local files', category: 'ingest' },
        { name: 'ingest_url', description: 'Fetch and ingest from URL', category: 'ingest' },
        { name: 'chunk_document', description: 'Preview chunking', category: 'ingest' },
        { name: 'list_sources', description: 'View all sources', category: 'manage' },
        { name: 'delete_source', description: 'Remove source documents', category: 'manage' },
        { name: 'export_documents', description: 'Export to JSON', category: 'manage' },
        { name: 'get_stats', description: 'Collection statistics', category: 'manage' },
        { name: 'health_check', description: 'Server health status', category: 'manage' },
    ];

    const categories = [
        { id: 'search' as const, label: 'Search', icon: '🔍' },
        { id: 'ingest' as const, label: 'Ingest', icon: '📥' },
        { id: 'manage' as const, label: 'Manage', icon: '⚙️' },
    ];

    const filteredTools = tools.filter(t => t.category === activeCategory);

    return (
        <div className="card rag-showcase">
            <h2>🧠 RAG MCP Server</h2>
            <p className="rag-description">
                Semantic document search powered by ChromaDB and ONNX embeddings
            </p>

            <div className="rag-features">
                <div className="rag-feature">
                    <span className="rag-feature-value">384</span>
                    <span className="rag-feature-label">Dimensions</span>
                </div>
                <div className="rag-feature">
                    <span className="rag-feature-value">13</span>
                    <span className="rag-feature-label">Tools</span>
                </div>
                <div className="rag-feature">
                    <span className="rag-feature-value">HNSW</span>
                    <span className="rag-feature-label">Index</span>
                </div>
            </div>

            <div className="rag-categories">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`rag-category ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        {cat.icon} {cat.label}
                    </button>
                ))}
            </div>

            <div className="rag-tools">
                {filteredTools.map((tool, index) => (
                    <div key={index} className="rag-tool">
                        <code className="rag-tool-name">{tool.name}</code>
                        <span className="rag-tool-desc">{tool.description}</span>
                    </div>
                ))}
            </div>

            <div className="rag-tech">
                <span className="rag-tech-badge">ChromaDB</span>
                <span className="rag-tech-badge">MiniLM-L6-v2</span>
                <span className="rag-tech-badge">FastMCP</span>
            </div>
        </div>
    );
});

export default RAGShowcase;
