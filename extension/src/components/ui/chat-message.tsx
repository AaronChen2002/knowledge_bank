import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Bot, 
  Clock, 
  ExternalLink, 
  Copy, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { ChatMessage } from '@/api/chatService';

interface ChatMessageProps {
  message: ChatMessage;
  onCopy?: (content: string) => void;
  onSourceClick?: (source: any) => void;
}

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({
  message,
  onCopy,
  onSourceClick,
}) => {
  const isUser = message.type === 'user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleCopy = () => {
    if (onCopy) {
      onCopy(message.content);
    } else {
      navigator.clipboard.writeText(message.content);
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <Card className={`shadow-sm ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
          <CardContent className="p-3">
            {/* Message Header */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {isUser ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4 text-primary" />
                )}
                <span className="text-sm font-medium">
                  {isUser ? 'You' : 'Assistant'}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-xs opacity-70">
                <Clock className="w-3 h-3" />
                <span>{timestamp}</span>
              </div>

              {!isUser && message.metadata?.confidence && (
                <Badge variant="secondary" className="text-xs">
                  {Math.round(message.metadata.confidence * 100)}% confident
                </Badge>
              )}
            </div>

            {/* Message Content */}
            <div className="space-y-2">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>

              {/* Sources (for assistant messages) */}
              {!isUser && message.metadata?.sources && message.metadata.sources.length > 0 && (
                <div className="space-y-2">
                  <Separator />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs font-medium">
                      <Sparkles className="w-3 h-3" />
                      Sources
                    </div>
                    {message.metadata.sources.map((source, index) => (
                      <div 
                        key={index}
                        className="p-2 bg-background rounded text-xs cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => onSourceClick?.(source)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{source}</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Message Actions */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/20">
              <div className="flex items-center gap-1">
                {!isUser && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopy}
                    className="h-6 px-2 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
              
              {!isUser && message.metadata?.query && (
                <div className="text-xs opacity-70">
                  Query: "{message.metadata.query}"
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface ChatSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

export const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          size="sm"
          variant="outline"
          onClick={() => onSuggestionClick(suggestion)}
          className="text-xs h-7"
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          {suggestion}
        </Button>
      ))}
    </div>
  );
}; 