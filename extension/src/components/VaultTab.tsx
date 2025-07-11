import React, { useState, useEffect } from 'react';

interface VaultEntry {
  id: string;
  title: string;
  summary: string;
  source?: string;
  date: string;
  type: 'url' | 'text';
  tags?: string[];
}

const VaultTab: React.FC = () => {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecentEntries();
  }, []);

  const loadRecentEntries = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // TODO: Replace with actual API call
      const mockEntries: VaultEntry[] = [
        {
          id: '1',
          title: 'How to Build Chrome Extensions',
          summary: 'A comprehensive guide to building Chrome extensions with modern web technologies...',
          source: 'https://developer.chrome.com/extensions',
          date: '2024-01-20',
          type: 'url',
          tags: ['Development', 'Chrome', 'Extensions', 'Web']
        },
        {
          id: '2',
          title: 'React Best Practices',
          summary: 'Important patterns and practices for writing maintainable React applications...',
          date: '2024-01-19',
          type: 'text',
          tags: ['React', 'Best Practices', 'Development']
        },
        {
          id: '3',
          title: 'AI Ethics Paper',
          summary: 'Research on ethical considerations in AI development and deployment...',
          source: 'https://arxiv.org/example',
          date: '2024-01-18',
          type: 'url',
          tags: ['AI', 'Ethics', 'Research', 'Important']
        }
      ];
      
      setEntries(mockEntries);
      console.log('Loaded recent entries');
    } catch (error) {
      setError('Failed to load recent entries');
      console.error('Load entries error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openSource = (url: string) => {
    chrome.tabs.create({ url });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays < 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          Recent Entries
        </h2>
        <button
          onClick={loadRecentEntries}
          disabled={isLoading}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:bg-gray-400"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
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
            Loading your vault...
          </div>
        </div>
      )}

      {/* Entries */}
      {entries.length > 0 && !isLoading && (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1 text-gray-900">
                    {entry.title}
                  </h4>
                  <p className="text-sm mb-3 text-gray-600">
                    {entry.summary}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      entry.type === 'url' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {entry.type === 'url' ? '🔗 URL' : '📝 Text'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(entry.date)}
                    </span>
                  </div>
                  
                  {entry.tags && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {entry.source && (
                  <button
                    onClick={() => openSource(entry.source!)}
                    className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Open
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {entries.length === 0 && !isLoading && !error && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📚</div>
          <p className="text-sm">Your vault is empty</p>
          <p className="text-xs mt-1">Start saving some content!</p>
        </div>
      )}
    </div>
  );
};

export default VaultTab; 