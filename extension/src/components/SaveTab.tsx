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
    <div className="p-4 space-y-3">
      {/* Primary Focus: Text Snippet */}
      <div className="space-y-2">
        <label className="ds-label">Text snippet</label>
        <textarea
          value={snippet}
          onChange={(e) => setSnippet(e.target.value)}
          placeholder="Paste or type your snippet here..."
          className="ds-textarea h-24"
          rows={3}
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="ds-label">Tags (optional)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="AI, research, important"
          className="ds-input"
        />
      </div>

      {/* Primary Action - Most Prominent */}
      <button
        onClick={handleSave}
        disabled={isLoading || !snippet.trim()}
        className="ds-button-primary w-full"
      >
        {isLoading ? 'Saving...' : 'Save Snippet'}
      </button>

      {/* Divider */}
      <div className="flex items-center my-3">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-3 ds-text-xs" style={{ color: 'var(--gray-500)' }}>or</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      {/* Secondary Action - Save Current Page */}
      <div className="space-y-2">
        <label className="ds-label">Current page</label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={currentUrl}
            readOnly
            className="ds-input ds-input-readonly flex-1"
          />
          <button
            onClick={handleSavePage}
            disabled={isLoading || !currentUrl}
            className="ds-button-secondary"
            style={{ whiteSpace: 'nowrap' }}
          >
            {isLoading ? '...' : 'Save Page'}
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div className={message.includes('✅') ? 'ds-message-success' : 'ds-message-error'}>
          {message}
        </div>
      )}
    </div>
  );
};

export default SaveTab; 