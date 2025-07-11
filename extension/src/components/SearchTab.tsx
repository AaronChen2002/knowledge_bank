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
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Search your knowledge
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What are you looking for?"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? '🔍' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Searching your vault...</div>
        </div>
      )}

      {results.length > 0 && !isLoading && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">
            Found {results.length} results
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.map((result) => (
              <div
                key={result.id}
                className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {result.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {result.summary}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded-full ${
                        result.type === 'url' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {result.type === 'url' ? '🔗 URL' : '📝 Text'}
                      </span>
                      <span>{result.date}</span>
                      {result.tags && (
                        <div className="flex gap-1">
                          {result.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
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
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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

      {results.length === 0 && !isLoading && query && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🔍</div>
          <p>No results found for "{query}"</p>
          <p className="text-sm mt-1">Try rephrasing your search</p>
        </div>
      )}
    </div>
  );
};

export default SearchTab; 