import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Bot, 
  Loader2, 
  Plus, 
  History, 
  Download,
  Trash2,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { 
  ChatMessage, 
  Conversation, 
  sendMessage, 
  getConversationTemplates,
  getRecentConversations,
  saveConversation,
  deleteConversation,
  exportConversation
} from '@/api/chatService';
import { ChatMessageComponent, ChatSuggestions } from './chat-message';

interface ChatInterfaceProps {
  onSourceClick?: (source: any) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSourceClick,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showConversations, setShowConversations] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadTemplates();
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadTemplates = async () => {
    const templateList = await getConversationTemplates();
    setTemplates(templateList);
  };

  const loadConversations = async () => {
    const recentConversations = await getRecentConversations();
    setConversations(recentConversations);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendMessage({
        message: userMessage.content,
        conversationId: conversationId || undefined,
      });

      setMessages(prev => [...prev, response.message]);
      setConversationId(response.conversationId);
      setSuggestions(response.suggestions || []);

      // Save conversation
      const conversation: Conversation = {
        id: response.conversationId,
        title: userMessage.content.slice(0, 50) + (userMessage.content.length > 50 ? '...' : ''),
        messages: [...messages, userMessage, response.message],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveConversation(conversation);
      await loadConversations();

    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const handleTemplateClick = (template: any) => {
    setInputValue(template.message);
    setShowTemplates(false);
    inputRef.current?.focus();
  };

  const handleConversationClick = (conversation: Conversation) => {
    setMessages(conversation.messages);
    setConversationId(conversation.id);
    setShowConversations(false);
  };

  const handleNewConversation = () => {
    setMessages([]);
    setConversationId('');
    setSuggestions([]);
    setShowConversations(false);
    setShowTemplates(false);
  };

  const handleExportConversation = () => {
    if (messages.length === 0) return;
    
    const conversation: Conversation = {
      id: conversationId || 'temp',
      title: 'Chat Export',
      messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const markdown = exportConversation(conversation);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteConversation = async () => {
    if (!conversationId) return;
    
    await deleteConversation(conversationId);
    setMessages([]);
    setConversationId('');
    setSuggestions([]);
    await loadConversations();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            <span>Knowledge Assistant</span>
            {conversationId && (
              <Badge variant="secondary" className="text-xs">
                {messages.length} messages
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowTemplates(!showTemplates)}
              className="h-7 px-2"
            >
              <Plus className="w-3 h-3 mr-1" />
              Templates
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowConversations(!showConversations)}
              className="h-7 px-2"
            >
              <History className="w-3 h-3 mr-1" />
              History
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-3">
        {/* Templates */}
        {showTemplates && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Quick Start Templates</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {templates.map((template, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  onClick={() => handleTemplateClick(template)}
                  className="text-xs h-7"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {template.title}
                </Button>
              ))}
            </div>
            <Separator />
          </div>
        )}

        {/* Recent Conversations */}
        {showConversations && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Recent Conversations</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleNewConversation}
                className="h-6 px-2 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                New Chat
              </Button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="p-2 bg-muted rounded text-xs cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div className="font-medium truncate">{conversation.title}</div>
                  <div className="text-muted-foreground">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            <Separator />
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {messages.length === 0 && !showTemplates && !showConversations && (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                Ask me anything about your knowledge vault
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                I can help you find, summarize, and explore your saved content
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <ChatMessageComponent
              key={message.id}
              message={message}
              onSourceClick={onSourceClick}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="max-w-[80%]">
                <Card className="shadow-sm bg-muted">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm">Assistant is thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <ChatSuggestions
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
        />

        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Textarea
              ref={inputRef}
              placeholder="Ask me about your knowledge vault..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-3"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Conversation Actions */}
          {conversationId && messages.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportConversation}
                className="h-6 px-2 text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDeleteConversation}
                className="h-6 px-2 text-xs text-destructive"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 