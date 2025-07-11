import React, { useState } from 'react';

interface SearchResult {
  id: string;
  title: string;
  summary: string;
  source?: string;
  date: string;
  type: 'url' | 'text';
  tags?: string[];
}

const SearchTab: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace with actual API call
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'AI Alignment Research',
          summary: 'Important insights about AI alignment challenges and potential solutions...',
          source: 'https://example.com/ai-alignment',
          date: '2024-01-15',
          type: 'url',
          tags: ['AI', 'Research', 'Alignment']
        },
        {
          id: '2',
          title: 'Machine Learning Notes',
          summary: 'Key concepts about neural networks and deep learning fundamentals...',
          source: 'https://example.com/ml-notes',
          date: '2024-01-10',
          type: 'text',
          tags: ['ML', 'Neural Networks']
        }
      ];
      
      setResults(mockResults);
      console.log('Search query:', query);
    } catch (error) {
      setError('Failed to search. Please try again.');
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const openSource = (url: string) => {
    chrome.tabs.create({ url });
  };

  return (
    <div className="p-4 space-y-3">
      {/* Primary Focus: Search Input */}
      <div className="space-y-2">
        <label className="ds-label">Search your knowledge</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What are you looking for?"
            className="ds-input flex-1"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="ds-button-primary"
            style={{ whiteSpace: 'nowrap' }}
          >
            {isLoading ? '...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="ds-message-error">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="ds-text-sm" style={{ color: 'var(--gray-500)' }}>
            Searching your vault...
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && !isLoading && (
        <div className="space-y-2">
          <h3 className="ds-text-sm ds-font-medium" style={{ color: 'var(--gray-700)' }}>
            Found {results.length} results
          </h3>
          
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {results.map((result) => (
              <div key={result.id} className="ds-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="ds-font-medium ds-text-sm mb-1" style={{ color: 'var(--gray-900)' }}>
                      {result.title}
                    </h4>
                    <p className="ds-text-sm mb-2" style={{ color: 'var(--gray-600)' }}>
                      {result.summary}
                    </p>
                    
                    <div className="flex items-center gap-2 ds-text-xs" style={{ color: 'var(--gray-500)' }}>
                      <span 
                        className="px-2 py-1 rounded-full ds-text-xs"
                        style={{
                          backgroundColor: result.type === 'url' ? 'var(--purple-100)' : 'var(--green-100)',
                          color: result.type === 'url' ? 'var(--purple-700)' : 'var(--green-700)'
                        }}
                      >
                        {result.type === 'url' ? '🔗 URL' : '📝 Text'}
                      </span>
                      <span>{result.date}</span>
                      {result.tags && (
                        <div className="flex gap-1">
                          {result.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 rounded-full ds-text-xs"
                              style={{ 
                                backgroundColor: 'var(--gray-100)', 
                                color: 'var(--gray-600)' 
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {result.source && (
                    <button
                      onClick={() => openSource(result.source!)}
                      className="ds-button-secondary ds-text-sm"
                    >
                      Open
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && !isLoading && query && (
        <div className="text-center py-8" style={{ color: 'var(--gray-500)' }}>
          <div className="text-4xl mb-2">🔍</div>
          <p className="ds-text-sm">No results found for "{query}"</p>
          <p className="ds-text-xs mt-1">Try rephrasing your search</p>
        </div>
      )}
    </div>
  );
};

export default SearchTab; 