import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tag, Hash, Plus, Search, Filter, X } from 'lucide-react';
import { getPopularTags, getTagColor, Tag as TagType } from '@/api/smartTagService';

interface TagManagerProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagDeselect: (tag: string) => void;
  showPopularTags?: boolean;
  maxDisplay?: number;
}

export const TagManager: React.FC<TagManagerProps> = ({
  selectedTags,
  onTagSelect,
  onTagDeselect,
  showPopularTags = true,
  maxDisplay = 20,
}) => {
  const [popularTags, setPopularTags] = useState<TagType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPopularTags = async () => {
      try {
        const tags = await getPopularTags();
        setPopularTags(tags);
      } catch (error) {
        console.error('Failed to load popular tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (showPopularTags) {
      loadPopularTags();
    }
  }, [showPopularTags]);

  const filteredTags = popularTags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tag.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'development', label: 'Development' },
    { value: 'ai', label: 'AI' },
    { value: 'research', label: 'Research' },
    { value: 'general', label: 'General' },
    { value: 'important', label: 'Important' },
  ];

  const handleTagClick = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagDeselect(tagName);
    } else {
      onTagSelect(tagName);
    }
  };

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
          <Hash className="w-4 h-4 text-primary" />
          Tag Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Search and Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-1 overflow-x-auto pb-1">
            {categories.map((category) => (
              <Button
                key={category.value}
                size="sm"
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                className="whitespace-nowrap"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Selected Tags</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tagName) => {
                const tag = popularTags.find(t => t.name === tagName);
                const tagColor = tag ? getTagColor(tag.category) : getTagColor('general');
                
                return (
                  <Badge
                    key={tagName}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                    style={{ backgroundColor: tagColor + '20', color: tagColor, borderColor: tagColor + '40' }}
                    onClick={() => handleTagClick(tagName)}
                  >
                    {tagName}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Tags */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Available Tags</h4>
          <div className="flex flex-wrap gap-2">
            {filteredTags.slice(0, maxDisplay).map((tag) => {
              const isSelected = selectedTags.includes(tag.name);
              const tagColor = getTagColor(tag.category);
              
              return (
                <Badge
                  key={tag.name}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-primary/10'
                  }`}
                  style={!isSelected ? { 
                    borderColor: tagColor + '40',
                    color: tagColor 
                  } : undefined}
                  onClick={() => handleTagClick(tag.name)}
                >
                  {tag.name}
                  {tag.usageCount > 0 && (
                    <span className="ml-1 text-xs opacity-70">({tag.usageCount})</span>
                  )}
                </Badge>
              );
            })}
          </div>
          
          {filteredTags.length > maxDisplay && (
            <p className="text-xs text-muted-foreground">
              Showing {maxDisplay} of {filteredTags.length} tags
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 