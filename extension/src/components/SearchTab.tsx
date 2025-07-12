import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, FileText, Link2 } from 'lucide-react';
import * as mockService from '@/api/mockService';
import type { SearchResult } from '@/shared/types';

export const SearchTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const searchResults = await mockService.search(searchQuery);
    setResults(searchResults);
    setIsSearching(false);
    setHasSearched(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search your saved content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Results */}
        <div className="space-y-3">
        {results.length === 0 && hasSearched && !isSearching && (
          <Card className="shadow-sm">
            <CardContent className="pt-6 text-center">
              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No results found for "{searchQuery}"
              </p>
            </CardContent>
          </Card>
        )}

        {results.length === 0 && !hasSearched && (
          <Card className="shadow-sm">
            <CardContent className="pt-6 text-center">
              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Search through your saved snippets and pages
              </p>
            </CardContent>
          </Card>
        )}

        {results.map((result) => (
          <Card key={result.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {result.type === 'text' ? (
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <Link2 className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                    <h3 className="font-medium text-sm leading-tight">{result.title}</h3>
                  </div>
                  {result.url && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="ml-2 flex-shrink-0"
                      onClick={() => chrome.tabs.create({ url: result.url })}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open
                    </Button>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {result.summary}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {result.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(result.createdAt).toLocaleDateString()}
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

export default SearchTab; 