import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Sparkles } from 'lucide-react';
import { TagSuggestion } from '@/api/smartTagService';
import { getTagColor } from '@/api/smartTagService';

interface TagSuggestionProps {
  suggestion: TagSuggestion;
  onAccept: (tag: string) => void;
  onReject: (tag: string) => void;
  isAccepted?: boolean;
  isRejected?: boolean;
  disabled?: boolean;
}

export const TagSuggestionChip: React.FC<TagSuggestionProps> = ({
  suggestion,
  onAccept,
  onReject,
  isAccepted = false,
  isRejected = false,
  disabled = false,
}) => {
  const confidenceColor = suggestion.confidence > 0.8 ? 'text-green-600' : 
                         suggestion.confidence > 0.6 ? 'text-yellow-600' : 'text-red-600';
  
  const tagColor = getTagColor(suggestion.category);
  
  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border">
      <div className="flex-1 flex items-center gap-2">
        <Sparkles className="w-3 h-3 text-primary" />
        <Badge 
          variant="secondary" 
          className="text-xs font-medium"
          style={{ backgroundColor: tagColor + '20', color: tagColor, borderColor: tagColor + '40' }}
        >
          {suggestion.tag}
        </Badge>
        <span className={`text-xs ${confidenceColor}`}>
          {Math.round(suggestion.confidence * 100)}%
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAccept(suggestion.tag)}
          disabled={disabled || isAccepted || isRejected}
          className={`h-6 w-6 p-0 ${isAccepted ? 'bg-green-100 text-green-600' : 'hover:bg-green-50'}`}
        >
          <Check className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onReject(suggestion.tag)}
          disabled={disabled || isAccepted || isRejected}
          className={`h-6 w-6 p-0 ${isRejected ? 'bg-red-100 text-red-600' : 'hover:bg-red-50'}`}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

interface TagSuggestionsProps {
  suggestions: TagSuggestion[];
  onAccept: (tag: string) => void;
  onReject: (tag: string) => void;
  acceptedTags: Set<string>;
  rejectedTags: Set<string>;
  disabled?: boolean;
}

export const TagSuggestions: React.FC<TagSuggestionsProps> = ({
  suggestions,
  onAccept,
  onReject,
  acceptedTags,
  rejectedTags,
  disabled = false,
}) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-medium">AI Tag Suggestions</h4>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          <TagSuggestionChip
            key={suggestion.tag}
            suggestion={suggestion}
            onAccept={onAccept}
            onReject={onReject}
            isAccepted={acceptedTags.has(suggestion.tag)}
            isRejected={rejectedTags.has(suggestion.tag)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}; 