import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FileText, Link2, Check } from 'lucide-react';

export const SaveTab = () => {
  const [textSnippet, setTextSnippet] = useState('');
  const [tags, setTags] = useState('');
  const [currentUrl] = useState('https://www.theringer.com/2025/07/09/nba/summer');
  const [isSnippetSaved, setIsSnippetSaved] = useState(false);
  const [isPageSaved, setIsPageSaved] = useState(false);
  const [showSnippetPreview, setShowSnippetPreview] = useState(false);

  const handleSaveSnippet = () => {
    if (!textSnippet.trim()) return;
    
    // Simulate save
    setIsSnippetSaved(true);
    setShowSnippetPreview(true);
    setTimeout(() => {
      setIsSnippetSaved(false);
      setShowSnippetPreview(false);
      setTextSnippet('');
      setTags('');
    }, 2500);
  };

  const handleSavePage = () => {
    // Simulate save
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
            />
          </div>

          {showSnippetPreview && (
            <div className="p-3 bg-accent/50 rounded-md border border-accent">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-accent-foreground">Snippet Saved</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {textSnippet.slice(0, 100)}...
              </p>
              {tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.split(',').map((tag, index) => (
                    <span key={index} className="text-xs bg-secondary px-2 py-1 rounded-md">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button 
            onClick={handleSaveSnippet}
            disabled={!textSnippet.trim() || isSnippetSaved}
            className="w-full"
          >
            {isSnippetSaved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              'Save Snippet'
            )}
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
              {currentUrl}
            </p>
          </div>

          <Button 
            onClick={handleSavePage}
            disabled={isPageSaved}
            variant="outline"
            className="w-full"
          >
            {isPageSaved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Page Saved!
              </>
            ) : (
              'Save Page'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaveTab; 