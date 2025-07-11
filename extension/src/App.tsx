import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { SaveTab } from './components/SaveTab';
import { SearchTab } from './components/SearchTab';
import { VaultTab } from './components/VaultTab';
import './App.css'


function App() {
  const [activeTab, setActiveTab] = useState('save');

  return (
    <div className="w-[400px] h-[600px] bg-background flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="border-b border-border px-1 py-1">
          <TabsList className="grid w-full grid-cols-3 h-9">
            <TabsTrigger value="save" className="text-sm font-medium">
              Save
            </TabsTrigger>
            <TabsTrigger value="search" className="text-sm font-medium">
              Search
            </TabsTrigger>
            <TabsTrigger value="vault" className="text-sm font-medium">
              Vault
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="save" className="h-full m-0 p-4 overflow-y-auto">
            <SaveTab />
          </TabsContent>
          <TabsContent value="search" className="h-full m-0 p-4 overflow-y-auto">
            <SearchTab />
          </TabsContent>
          <TabsContent value="vault" className="h-full m-0 p-4 overflow-y-auto">
            <VaultTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
export default App
