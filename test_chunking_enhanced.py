"""Test enhanced chunking functions."""

import pytest
from rag_server.chunking import chunk_semantic, chunk_code, chunk_recursive


def test_chunk_semantic_basic():
    """Test semantic chunking with basic text."""
    text = "Python is a great language. " * 50
    chunks = chunk_semantic(text, chunk_size=200)
    
    assert len(chunks) > 0
    assert all(chunk.content for chunk in chunks)
    assert all(chunk.chunk_id >= 0 for chunk in chunks)


def test_chunk_code_python():
    """Test code chunking with Python code."""
    code = """
import os
import sys

def function_one():
    '''First function'''
    return "one"

def function_two():
    '''Second function'''
    return "two"

class MyClass:
    def method(self):
        return "method"
"""
    
    chunks = chunk_code(code, language='python', chunk_size=100)
    
    assert len(chunks) > 0
    # Should preserve imports in chunks
    assert any('import' in chunk.content for chunk in chunks)
    # Should respect function boundaries
    assert any('def function_one' in chunk.content for chunk in chunks)


def test_chunk_code_javascript():
    """Test code chunking with JavaScript code."""
    code = """
import React from 'react';

function Component() {
    return <div>Hello</div>;
}

const handler = () => {
    console.log('test');
};

export default Component;
"""
    
    chunks = chunk_code(code, language='javascript', chunk_size=100)
    
    assert len(chunks) > 0
    assert any('import' in chunk.content for chunk in chunks)


def test_chunk_recursive_single_level():
    """Test recursive chunking with single level."""
    text = "Short text"
    chunks = chunk_recursive(text, chunk_size=100, max_depth=1)
    
    assert len(chunks) == 1
    assert chunks[0].content == text


def test_chunk_recursive_multiple_levels():
    """Test recursive chunking with multiple levels."""
    text = "This is a test sentence. " * 100  # ~2500 chars
    chunks = chunk_recursive(text, chunk_size=200, overlap=20, max_depth=3)
    
    assert len(chunks) > 1
    # Verify chunks have reasonable sizes
    assert all(len(chunk.content) <= 500 for chunk in chunks)  # Within 2x chunk_size
    # Verify chunk IDs are sequential
    assert [c.chunk_id for c in chunks] == list(range(len(chunks)))


def test_chunk_code_empty():
    """Test code chunking with empty input."""
    chunks = chunk_code("")
    assert len(chunks) == 0
    
    chunks = chunk_code("   ")
    assert len(chunks) == 0


def test_chunk_code_no_structure():
    """Test code chunking with unstructured code."""
    code = "x = 1\ny = 2\nz = 3"
    chunks = chunk_code(code, chunk_size=100)
    
    assert len(chunks) >= 1  # Should fall back to text chunking


def test_chunk_recursive_depth_limit():
    """Test that recursive chunking respects depth limit."""
    text = "Word " * 1000  # Very long text
    
    # Should stop at max_depth
    chunks_shallow = chunk_recursive(text, chunk_size=50, max_depth=1)
    chunks_deep = chunk_recursive(text, chunk_size=50, max_depth=3)
    
    # Deeper recursion should create more chunks
    assert len(chunks_deep) >= len(chunks_shallow)
