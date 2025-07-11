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
          tags: ['AI', 'Research', 'Alignment', 'Important']
        },
        {
          id: '2',
          title: 'Machine Learning Notes',
          summary: 'Key concepts about neural networks and deep learning fundamentals...',
          source: 'https://example.com/ml-notes',
          date: '2024-01-10',
          type: 'text',
          tags: ['ML', 'Neural Networks', 'Development']
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
    <div className="p-4 space-y-4">
      {/* Search Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Search your knowledge
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What are you looking for?"
            className="flex-1 p-3 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-gray-500">
            Searching your vault...
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && !isLoading && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">
            Found {results.length} results
          </h3>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {results.map((result) => (
              <div key={result.id} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1 text-gray-900">
                      {result.title}
                    </h4>
                    <p className="text-sm mb-3 text-gray-600">
                      {result.summary}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        result.type === 'url' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {result.type === 'url' ? '🔗 URL' : '📝 Text'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {result.date}
                      </span>
                    </div>
                    
                    {result.tags && (
                      <div className="flex flex-wrap gap-1">
                        {result.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {result.source && (
                    <button
                      onClick={() => openSource(result.source!)}
                      className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
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
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-sm">No results found for "{query}"</p>
          <p className="text-xs mt-1">Try rephrasing your search</p>
        </div>
      )}
    </div>
  );
};

export default SearchTab; 