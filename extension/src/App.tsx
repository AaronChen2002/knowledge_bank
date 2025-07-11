import { useState } from 'react'
import TabSwitcher from './components/TabSwitcher'
import SaveTab from './components/SaveTab'
import SearchTab from './components/SearchTab'
import VaultTab from './components/VaultTab'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState<'save' | 'search' | 'vault'>('save')

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'save':
        return <SaveTab />
      case 'search':
        return <SearchTab />
      case 'vault':
        return <VaultTab />
      default:
        return <SaveTab />
    }
  }

  return (
    <div className="w-full h-full bg-gray-50">
      <TabSwitcher 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab as 'save' | 'search' | 'vault')}
      />
      <div className="flex-1 overflow-y-auto">
        {renderActiveTab()}
      </div>
    </div>
  )
}

export default App
