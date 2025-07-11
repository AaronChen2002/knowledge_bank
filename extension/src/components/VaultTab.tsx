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
          tags: ['Development', 'Chrome', 'Extensions']
        },
        {
          id: '2',
          title: 'React Best Practices',
          summary: 'Important patterns and practices for writing maintainable React applications...',
          date: '2024-01-19',
          type: 'text',
          tags: ['React', 'Best Practices']
        },
        {
          id: '3',
          title: 'AI Ethics Paper',
          summary: 'Research on ethical considerations in AI development and deployment...',
          source: 'https://arxiv.org/example',
          date: '2024-01-18',
          type: 'url',
          tags: ['AI', 'Ethics', 'Research']
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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Recent Entries</h2>
        <button
          onClick={loadRecentEntries}
          disabled={isLoading}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading your vault...</div>
        </div>
      )}

      {entries.length > 0 && !isLoading && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {entry.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {entry.summary}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded-full ${
                      entry.type === 'url' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {entry.type === 'url' ? '🔗 URL' : '📝 Text'}
                    </span>
                    <span>{formatDate(entry.date)}</span>
                    {entry.tags && (
                      <div className="flex gap-1">
                        {entry.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {entry.source && (
                  <button
                    onClick={() => openSource(entry.source!)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Open
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {entries.length === 0 && !isLoading && !error && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📚</div>
          <p>Your vault is empty</p>
          <p className="text-sm mt-1">Start saving some content!</p>
        </div>
      )}
    </div>
  );
};

export default VaultTab; 