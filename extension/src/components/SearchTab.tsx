import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, FileText, Link2 } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  type: 'snippet' | 'page';
  url?: string;
}

export const SearchTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'React Hooks Best Practices',
      summary: 'Key principles for using React hooks effectively in modern applications...',
      date: '2025-01-09',
      tags: ['react', 'hooks', 'frontend'],
      type: 'snippet'
    },
    {
      id: '2',
      title: 'NBA Summer League Analysis',
      summary: 'Comprehensive breakdown of player performances and team strategies...',
      date: '2025-01-08',
      tags: ['sports', 'nba', 'analysis'],
      type: 'page',
      url: 'https://www.theringer.com/2025/07/09/nba/summer'
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      setResults(mockResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ));
      setIsSearching(false);
    }, 800);
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
        {results.length === 0 && searchQuery && !isSearching && (
          <Card className="shadow-sm">
            <CardContent className="pt-6 text-center">
              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No results found for "{searchQuery}"
              </p>
            </CardContent>
          </Card>
        )}

        {results.length === 0 && !searchQuery && (
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
                    {result.type === 'snippet' ? (
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <Link2 className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                    <h3 className="font-medium text-sm leading-tight">{result.title}</h3>
                  </div>
                  <Button size="sm" variant="outline" className="ml-2 flex-shrink-0">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open
                  </Button>
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
                    {new Date(result.date).toLocaleDateString()}
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