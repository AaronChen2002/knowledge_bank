import React, { useState, useEffect } from 'react';

const SaveTab: React.FC = () => {
  const [snippet, setSnippet] = useState('');
  const [tags, setTags] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get current tab URL
    chrome.runtime.sendMessage({ action: 'getCurrentTab' }, (response) => {
      if (response?.url) {
        setCurrentUrl(response.url);
      }
    });

    // Check for pending snippet from context menu
    chrome.storage.local.get(['pendingSnippet'], (result) => {
      if (result.pendingSnippet) {
        setSnippet(result.pendingSnippet.text);
        setCurrentUrl(result.pendingSnippet.url);
        // Clear the pending snippet
        chrome.storage.local.remove(['pendingSnippet']);
      }
    });
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace with actual API call
      console.log('Saving:', { snippet, tags, url: currentUrl });
      
      setMessage('✅ Saved successfully!');
      setSnippet('');
      setTags('');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to save');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePage = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace with actual API call
      console.log('Saving page:', { url: currentUrl });
      
      setMessage('✅ Page saved successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to save page');
      console.error('Save page error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Text Snippet
        </label>
        <textarea
          value={snippet}
          onChange={(e) => setSnippet(e.target.value)}
          placeholder="Paste your snippet here..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Current Page
        </label>
        <input
          type="text"
          value={currentUrl}
          readOnly
          className="w-full p-2 text-sm bg-gray-50 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Tags (optional)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., AI, research, important"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        <button
          onClick={handleSave}
          disabled={isLoading || !snippet.trim()}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Saving...' : 'Save Snippet'}
        </button>
        
        <button
          onClick={handleSavePage}
          disabled={isLoading || !currentUrl}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Saving...' : 'Save This Page'}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default SaveTab; 