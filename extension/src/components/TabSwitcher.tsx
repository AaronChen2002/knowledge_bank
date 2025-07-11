import React from 'react';

interface TabSwitcherProps {
  activeTab: 'save' | 'search' | 'vault';
  onTabChange: (tab: 'save' | 'search' | 'vault') => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'save', label: 'Save' },
    { id: 'search', label: 'Search' },
    { id: 'vault', label: 'Vault' }
  ];

  return (
    <div className="flex bg-white">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as 'save' | 'search' | 'vault')}
          className={`
            flex-1 px-4 py-3 ds-text-sm ds-font-medium text-center transition-all duration-150
            ${activeTab === tab.id
              ? 'border-b-2 text-purple-600'
              : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-200'
            }
            ${index !== tabs.length - 1 ? 'border-r border-gray-100' : ''}
          `}
          style={{
            borderBottomColor: activeTab === tab.id ? 'var(--purple-600)' : undefined,
            color: activeTab === tab.id ? 'var(--purple-600)' : 'var(--gray-500)'
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher; 