import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ExternalLink, FileText, Link2, Archive, Hash, Highlighter } from 'lucide-react';
import * as mockService from '@/api/mockService';
import type { KnowledgeEntry } from '@/shared/types';
import { TagManager } from '@/components/ui/tag-manager';
import { HighlightsManager } from '@/components/ui/highlights-manager';

export const VaultTab = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagManager, setShowTagManager] = useState(false);
  const [showHighlightsManager, setShowHighlightsManager] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);
  
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setIsRefreshing(true);
    const recentEntries = await mockService.getRecentEntries();
    setEntries(recentEntries);
    setIsRefreshing(false);
  };

  const handleRefresh = () => {
    loadEntries();
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => [...prev, tag]);
  };

  const handleTagDeselect = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const handleEntryClick = (entry: KnowledgeEntry) => {
    setSelectedEntry(entry);
    setShowHighlightsManager(true);
  };

  const handleCloseHighlights = () => {
    setShowHighlightsManager(false);
    setSelectedEntry(null);
  };

  // Filter entries by selected tags
  const filteredEntries = selectedTags.length > 0 
    ? entries.filter(entry => 
        selectedTags.some(tag => entry.tags.includes(tag))
      )
    : entries;

  const handleEntryClick = (entry: KnowledgeEntry) => {
    setSelectedEntry(entry);
    setShowHighlightsManager(true);
  };

  const handleCloseHighlights = () => {
    setShowHighlightsManager(false);
    setSelectedEntry(null);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Archive className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-base">Recent Entries</h2>
          {selectedTags.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {filteredEntries.length} of {entries.length}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTagManager(!showTagManager)}
            className="h-8"
          >
            <Hash className="w-3 h-3 mr-1" />
            Tags
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Tag Manager */}
      {showTagManager && (
        <TagManager
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          onTagDeselect={handleTagDeselect}
          showPopularTags={true}
          maxDisplay={15}
        />
      )}

      {/* Highlights Manager */}
      {showHighlightsManager && selectedEntry && (
        <HighlightsManager
          entryId={selectedEntry.id}
          onHighlightUpdate={loadEntries}
        />
      )}

      {/* Entries List */}
      <div className="space-y-2">
        {filteredEntries.length === 0 && !isRefreshing && (
          <Card className="shadow-sm">
            <CardContent className="pt-4 text-center">
              <Archive className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">
                No saved entries yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Start saving snippets and pages to see them here
              </p>
            </CardContent>
          </Card>
        )}

        {filteredEntries.map((entry) => (
          <Card 
            key={entry.id} 
            className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleEntryClick(entry)}
          >
            <CardContent className="pt-3 pb-3">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {entry.type === 'text' ? (
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <Link2 className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                    <h3 className="font-medium text-sm leading-tight truncate">
                      {entry.title}
                    </h3>
                  </div>
                  {entry.url && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="ml-2 flex-shrink-0 h-7 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        chrome.tabs.create({ url: entry.url });
                      }}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open
                    </Button>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {entry.summary}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-wrap gap-1">
                    <Badge 
                      variant={entry.type === 'text' ? 'default' : 'secondary'}
                      className="text-xs h-5"
                    >
                      {entry.type}
                    </Badge>
                    {entry.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs h-5">
                        {tag}
                      </Badge>
                    ))}
                    {entry.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs h-5">
                        +{entry.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VaultTab;