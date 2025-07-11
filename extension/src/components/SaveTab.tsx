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
      {/* Text Snippet Card */}
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Text snippet
          </label>
          <textarea
            value={snippet}
            onChange={(e) => setSnippet(e.target.value)}
            placeholder="Paste or type your snippet here..."
            className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
            rows={3}
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
            placeholder="AI, research, important"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading || !snippet.trim()}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Saving...' : 'Save Snippet'}
        </button>
      </div>

      {/* Save Current Page Card */}
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Current page
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentUrl}
              readOnly
              className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
            <button
              onClick={handleSavePage}
              disabled={isLoading || !currentUrl}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-400"
            >
              {isLoading ? '...' : 'Save Page'}
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div className={`p-3 rounded-md ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default SaveTab; 