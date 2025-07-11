import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ExternalLink, FileText, Link2, Archive } from 'lucide-react';

interface VaultEntry {
  id: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  type: 'snippet' | 'page';
  url?: string;
}

export const VaultTab = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [entries] = useState<VaultEntry[]>([
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
    },
    {
      id: '3',
      title: 'TypeScript Advanced Types',
      summary: 'Deep dive into conditional types, mapped types, and utility types...',
      date: '2025-01-07',
      tags: ['typescript', 'programming', 'types'],
      type: 'snippet'
    }
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Archive className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-base">Recent Entries</h2>
        </div>
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

      {/* Entries List */}
      <div className="space-y-2">
        {entries.length === 0 && (
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

        {entries.map((entry) => (
          <Card key={entry.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-3 pb-3">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {entry.type === 'snippet' ? (
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <Link2 className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                    <h3 className="font-medium text-sm leading-tight truncate">
                      {entry.title}
                    </h3>
                  </div>
                  <Button size="sm" variant="outline" className="ml-2 flex-shrink-0 h-7 px-2">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {entry.summary}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-wrap gap-1">
                    <Badge 
                      variant={entry.type === 'snippet' ? 'default' : 'secondary'}
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
                    {new Date(entry.date).toLocaleDateString()}
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