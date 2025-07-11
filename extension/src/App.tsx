import { useState } from 'react';
import TabSwitcher from './components/TabSwitcher';
import SaveTab from './components/SaveTab';
import SearchTab from './components/SearchTab';
import VaultTab from './components/VaultTab';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'save' | 'search' | 'vault'>('save');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'save':
        return <SaveTab />;
      case 'search':
        return <SearchTab />;
      case 'vault':
        return <VaultTab />;
      default:
        return <SaveTab />;
    }
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="flex flex-col h-full">
        {/* Minimal Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200">
          <div className="px-4 py-3">
            <h1 className="ds-text-lg ds-font-semibold" style={{ color: 'var(--gray-900)' }}>
              Knowledge Bank
            </h1>
          </div>
          <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
}

export default App;
