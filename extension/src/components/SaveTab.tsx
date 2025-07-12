import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FileText, Link2, Check, Loader2, Sparkles } from 'lucide-react';
import * as mockService from '@/api/mockService';
import { generateSmartTags, saveTagPreference, TagSuggestion } from '@/api/smartTagService';
import { TagSuggestions } from '@/components/ui/tag-suggestion';

export const SaveTab = () => {
  const [textSnippet, setTextSnippet] = useState('');
  const [tags, setTags] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  
  // Smart tagging state
  const [tagSuggestions, setTagSuggestions] = useState<TagSuggestion[]>([]);
  const [acceptedTags, setAcceptedTags] = useState<Set<string>>(new Set());
  const [rejectedTags, setRejectedTags] = useState<Set<string>>(new Set());
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  
  const [isSavingSnippet, setIsSavingSnippet] = useState(false);
  const [isSnippetSaved, setIsSnippetSaved] = useState(false);

  const [isSavingPage, setIsSavingPage] = useState(false);
  const [isPageSaved, setIsPageSaved] = useState(false);

  useEffect(() => {
    // Check for pending snippet from context menu first
    chrome.storage.local.get(['pendingSnippet'], (result) => {
      if (result.pendingSnippet) {
        setTextSnippet(result.pendingSnippet.text);
        setCurrentUrl(result.pendingSnippet.url);
        // Important: Clear the pending snippet so it's not used again
        chrome.storage.local.remove(['pendingSnippet']);
      } else {
        // If no pending snippet, get the current tab URL
        chrome.runtime.sendMessage({ action: 'getCurrentTab' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            setCurrentUrl('Error: Could not get current tab');
          } else if (response?.url) {
            setCurrentUrl(response.url);
          }
        });
      }
    });
  }, []);

  // Generate smart tags when content changes
  useEffect(() => {
    const generateTags = async () => {
      if (!textSnippet.trim() || textSnippet.length < 10) {
        setTagSuggestions([]);
        setShowTagSuggestions(false);
        return;
      }

      setIsGeneratingTags(true);
      try {
        const response = await generateSmartTags({
          content: textSnippet,
          url: currentUrl,
        });
        setTagSuggestions(response.suggestions);
        setShowTagSuggestions(true);
      } catch (error) {
        console.error('Failed to generate tags:', error);
      } finally {
        setIsGeneratingTags(false);
      }
    };

    // Debounce tag generation
    const timeoutId = setTimeout(generateTags, 1000);
    return () => clearTimeout(timeoutId);
  }, [textSnippet, currentUrl]);

  const handleAcceptTag = (tag: string) => {
    setAcceptedTags(prev => new Set([...prev, tag]));
    setRejectedTags(prev => {
      const newSet = new Set(prev);
      newSet.delete(tag);
      return newSet;
    });
    
    // Add to manual tags input
    const currentTags = tags.split(',').map(t => t.trim()).filter(t => t);
    if (!currentTags.includes(tag)) {
      setTags([...currentTags, tag].join(', '));
    }
    
    // Save preference for learning
    saveTagPreference(tag, true);
  };

  const handleRejectTag = (tag: string) => {
    setRejectedTags(prev => new Set([...prev, tag]));
    setAcceptedTags(prev => {
      const newSet = new Set(prev);
      newSet.delete(tag);
      return newSet;
    });
    
    // Remove from manual tags input
    const currentTags = tags.split(',').map(t => t.trim()).filter(t => t !== tag);
    setTags(currentTags.join(', '));
    
    // Save preference for learning
    saveTagPreference(tag, false);
  };

  const handleSaveSnippet = async () => {
    if (!textSnippet.trim()) return;
    
    setIsSavingSnippet(true);
    await mockService.ingest({
      type: 'text',
      content: textSnippet,
      tags: tags.split(',').map(tag => tag.trim()),
    });
    setIsSavingSnippet(false);

    setIsSnippetSaved(true);
    setTimeout(() => {
      setIsSnippetSaved(false);
      setTextSnippet('');
      setTags('');
    }, 2500);
  };

  const handleSavePage = async () => {
    setIsSavingPage(true);
    await mockService.ingest({
      type: 'url',
      content: currentUrl,
    });
    setIsSavingPage(false);

    setIsPageSaved(true);
    setTimeout(() => {
      setIsPageSaved(false);
    }, 1500);
  };

  return (
    <div className="space-y-3">
      {/* Text Snippet Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="w-4 h-4 text-primary" />
            Text Snippet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Textarea
              placeholder="Paste or type your snippet here..."
              value={textSnippet}
              onChange={(e) => setTextSnippet(e.target.value)}
              className="min-h-[100px] resize-none text-sm"
              disabled={isSavingSnippet || isSnippetSaved}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium">
              Tags (optional)
            </Label>
            <Input
              id="tags"
              placeholder="AI, research, important"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="text-sm"
              disabled={isSavingSnippet || isSnippetSaved}
            />
            
            {/* Smart Tag Suggestions */}
            {showTagSuggestions && tagSuggestions.length > 0 && (
              <div className="mt-3">
                <TagSuggestions
                  suggestions={tagSuggestions}
                  onAccept={handleAcceptTag}
                  onReject={handleRejectTag}
                  acceptedTags={acceptedTags}
                  rejectedTags={rejectedTags}
                  disabled={isSavingSnippet || isSnippetSaved}
                />
              </div>
            )}
            
            {/* Tag Generation Loading */}
            {isGeneratingTags && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Analyzing content for smart tags...</span>
              </div>
            )}
          </div>

          <Button 
            onClick={handleSaveSnippet}
            disabled={!textSnippet.trim() || isSavingSnippet || isSnippetSaved}
            className="w-full"
          >
            {isSavingSnippet ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isSnippetSaved ? (
              <Check className="w-4 h-4 mr-2" />
            ) : null}
            {isSavingSnippet ? 'Saving...' : isSnippetSaved ? 'Saved!' : 'Save Snippet'}
          </Button>
        </CardContent>
      </Card>

      <Separator className="my-3" />

      {/* Current Page Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Link2 className="w-4 h-4 text-primary" />
            Current Page
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-medium break-all">
              {currentUrl || 'Loading...'}
            </p>
          </div>

          <Button 
            onClick={handleSavePage}
            disabled={isSavingPage || isPageSaved || !currentUrl}
            variant="outline"
            className="w-full"
          >
            {isSavingPage ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isPageSaved ? (
              <Check className="w-4 h-4 mr-2" />
            ) : null}
            {isSavingPage ? 'Saving...' : isPageSaved ? 'Page Saved!' : 'Save Page'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaveTab; 