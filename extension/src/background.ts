// Background service worker for Knowledge Bank Chrome Extension

console.log('Knowledge Bank background script loaded');

// Context menu setup
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-snippet',
    title: 'Save Snippet to Knowledge Bank',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'save-snippet') {
    // Store the selected text and URL temporarily
    const snippet = info.selectionText;
    const url = tab?.url || '';
    
    // Store in local storage for popup to retrieve
    chrome.storage.local.set({
      pendingSnippet: {
        text: snippet,
        url: url,
        timestamp: Date.now()
      }
    });
    
    console.log('Snippet saved temporarily:', snippet);
  }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log('Background received message:', request);
  
  if (request.action === 'getCurrentTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ 
        url: tabs[0]?.url || '',
        title: tabs[0]?.title || '' 
      });
    });
    return true; // Will respond asynchronously
  }
});

export {}; 