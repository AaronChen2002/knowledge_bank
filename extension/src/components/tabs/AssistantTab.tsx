import React from 'react';
import { ChatInterface } from '@/components/ui/chat-interface';

export const AssistantTab: React.FC = () => {
  const handleSourceClick = (source: any) => {
    // TODO: Navigate to the source entry in the vault
    console.log('Source clicked:', source);
  };

  return (
    <div className="h-full">
      <ChatInterface onSourceClick={handleSourceClick} />
    </div>
  );
}; 