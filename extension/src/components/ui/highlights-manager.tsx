import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Highlighter, 
  Search, 
  Filter, 
  MessageSquare,
  Plus,
  Palette
} from 'lucide-react';
import { Highlight, Note, HighlightColor } from '@/shared/types';
import { 
  getHighlightsForEntry, 
  getNotesForEntry, 
  searchHighlights,
  getHighlightColors,
  getHighlightColorHex
} from '@/api/highlightService';
import { HighlightEditor } from './highlight-editor';

interface HighlightsManagerProps {
  entryId: string;
  onHighlightUpdate?: () => void;
}

export const HighlightsManager: React.FC<HighlightsManagerProps> = ({
  entryId,
  onHighlightUpdate,
}) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<HighlightColor | 'all'>('all');
  const [showWithNotesOnly, setShowWithNotesOnly] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState<Highlight | null>(null);

  useEffect(() => {
    loadHighlightsAndNotes();
  }, [entryId]);

  const loadHighlightsAndNotes = async () => {
    setIsLoading(true);
    try {
      const [entryHighlights, entryNotes] = await Promise.all([
        getHighlightsForEntry(entryId),
        getNotesForEntry(entryId),
      ]);
      setHighlights(entryHighlights);
      setNotes(entryNotes);
    } catch (error) {
      console.error('Failed to load highlights and notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() && selectedColor === 'all' && !showWithNotesOnly) {
      await loadHighlightsAndNotes();
      return;
    }

    setIsLoading(true);
    try {
      const response = await searchHighlights({
        query: searchQuery,
        entryId,
        filters: {
          color: selectedColor !== 'all' ? [selectedColor] : undefined,
          hasNotes: showWithNotesOnly || undefined,
        },
      });
      setHighlights(response.highlights);
      setNotes(response.notes);
    } catch (error) {
      console.error('Failed to search highlights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHighlightSave = async (highlight: Highlight, note?: Note) => {
    try {
      // Update the highlight in the list
      setHighlights(prev => {
        const index = prev.findIndex(h => h.id === highlight.id);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = highlight;
          return updated;
        }
        return [...prev, highlight];
      });

      // Update notes if provided
      if (note) {
        setNotes(prev => {
          const index = prev.findIndex(n => n.id === note.id);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = note;
            return updated;
          }
          return [...prev, note];
        });
      }

      setEditingHighlight(null);
      onHighlightUpdate?.();
    } catch (error) {
      console.error('Failed to save highlight:', error);
    }
  };

  const handleHighlightDelete = async (highlightId: string) => {
    try {
      setHighlights(prev => prev.filter(h => h.id !== highlightId));
      setNotes(prev => prev.filter(n => n.highlightId !== highlightId));
      setEditingHighlight(null);
      onHighlightUpdate?.();
    } catch (error) {
      console.error('Failed to delete highlight:', error);
    }
  };

  const getNoteForHighlight = (highlightId: string): Note | undefined => {
    return notes.find(n => n.highlightId === highlightId);
  };

  const filteredHighlights = highlights.filter(highlight => {
    if (selectedColor !== 'all' && highlight.color !== selectedColor) return false;
    if (showWithNotesOnly && !getNoteForHighlight(highlight.id)) return false;
    return true;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Highlighter className="w-4 h-4 text-primary" />
          Highlights & Notes
          <Badge variant="secondary" className="text-xs">
            {highlights.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search highlights and notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
            
            {/* Color Filter */}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={selectedColor === 'all' ? "default" : "outline"}
                onClick={() => setSelectedColor('all')}
                className="h-6 px-2"
              >
                All
              </Button>
              {getHighlightColors().map((color) => (
                <Button
                  key={color}
                  size="sm"
                  variant={selectedColor === color ? "default" : "outline"}
                  onClick={() => setSelectedColor(color)}
                  className="h-6 px-2"
                  style={selectedColor === color ? { backgroundColor: getHighlightColorHex(color) } : undefined}
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getHighlightColorHex(color) }}
                  />
                </Button>
              ))}
            </div>
            
            {/* Notes Filter */}
            <Button
              size="sm"
              variant={showWithNotesOnly ? "default" : "outline"}
              onClick={() => setShowWithNotesOnly(!showWithNotesOnly)}
              className="h-6 px-2"
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              With Notes
            </Button>
          </div>
        </div>

        <Separator />

        {/* Highlights List */}
        <div className="space-y-3">
          {filteredHighlights.length === 0 ? (
            <div className="text-center py-8">
              <Highlighter className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground">
                No highlights found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {highlights.length === 0 
                  ? "Start highlighting text on saved pages to see them here"
                  : "Try adjusting your search or filters"
                }
              </p>
            </div>
          ) : (
            filteredHighlights.map((highlight) => (
              <HighlightEditor
                key={highlight.id}
                highlight={highlight}
                note={getNoteForHighlight(highlight.id)}
                onSave={handleHighlightSave}
                onDelete={handleHighlightDelete}
                onCancel={() => setEditingHighlight(null)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 