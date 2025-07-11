import React from 'react';

interface TabSwitcherProps {
  activeTab: 'save' | 'search' | 'vault';
  onTabChange: (tab: 'save' | 'search' | 'vault') => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'save', label: 'Save', icon: '💾' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'vault', label: 'Vault', icon: '🗂️' }
  ];

  return (
    <div className="flex border-b border-gray-200 bg-white">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as 'save' | 'search' | 'vault')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="text-base">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher; 