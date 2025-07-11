import React from 'react';

interface TabSwitcherProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'save', label: 'Save' },
    { id: 'search', label: 'Search' },
    { id: 'vault', label: 'Vault' }
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher; 