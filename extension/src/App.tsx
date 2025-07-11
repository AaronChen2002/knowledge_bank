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
    <div className="h-full bg-white">
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0">
          <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h1 className="text-lg font-semibold">Knowledge Bank</h1>
            <p className="text-sm opacity-90">Save and search your knowledge</p>
          </div>
          <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
}

export default App;
