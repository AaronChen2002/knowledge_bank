import { Tag } from '@/shared/types';

/**
 * Smart Tagging Service
 * 
 * Provides AI-powered tag suggestions based on content analysis.
 * Currently uses mock data and basic keyword extraction.
 * Will be replaced with real AI integration when backend is ready.
 */

export interface TagSuggestion {
  tag: string;
  confidence: number; // 0-1 score
  reason: string;
  category?: Tag['category'];
}

export interface SmartTagRequest {
  content: string;
  title?: string;
  url?: string;
  existingTags?: string[];
}

export interface SmartTagResponse {
  suggestions: TagSuggestion[];
  extractedKeywords: string[];
  contentType: 'article' | 'documentation' | 'blog' | 'news' | 'general';
}

// Mock AI tag suggestions based on content analysis
const MOCK_TAG_SUGGESTIONS: Record<string, TagSuggestion[]> = {
  'ai': [
    { tag: 'artificial-intelligence', confidence: 0.95, reason: 'High frequency of AI-related terms', category: 'ai' },
    { tag: 'machine-learning', confidence: 0.85, reason: 'ML concepts detected', category: 'ai' },
    { tag: 'technology', confidence: 0.75, reason: 'Tech-related content', category: 'technology' },
  ],
  'react': [
    { tag: 'react', confidence: 0.95, reason: 'React framework mentioned', category: 'development' },
    { tag: 'javascript', confidence: 0.85, reason: 'JS ecosystem detected', category: 'development' },
    { tag: 'frontend', confidence: 0.80, reason: 'Frontend development content', category: 'development' },
    { tag: 'web-development', confidence: 0.75, reason: 'Web development context', category: 'development' },
  ],
  'python': [
    { tag: 'python', confidence: 0.95, reason: 'Python language mentioned', category: 'development' },
    { tag: 'programming', confidence: 0.90, reason: 'Programming language content', category: 'development' },
    { tag: 'backend', confidence: 0.70, reason: 'Backend development context', category: 'development' },
  ],
  'research': [
    { tag: 'research', confidence: 0.90, reason: 'Research methodology detected', category: 'research' },
    { tag: 'academic', confidence: 0.80, reason: 'Academic content style', category: 'research' },
    { tag: 'important', confidence: 0.70, reason: 'Important reference material', category: 'important' },
  ],
  'tutorial': [
    { tag: 'tutorial', confidence: 0.90, reason: 'Step-by-step instructions detected', category: 'general' },
    { tag: 'learning', confidence: 0.85, reason: 'Educational content', category: 'general' },
    { tag: 'how-to', confidence: 0.80, reason: 'How-to guide format', category: 'general' },
  ],
  'news': [
    { tag: 'news', confidence: 0.90, reason: 'News article format detected', category: 'general' },
    { tag: 'current-events', confidence: 0.80, reason: 'Current events content', category: 'general' },
  ],
  'documentation': [
    { tag: 'documentation', confidence: 0.95, reason: 'Technical documentation format', category: 'development' },
    { tag: 'reference', confidence: 0.85, reason: 'Reference material', category: 'general' },
    { tag: 'api', confidence: 0.70, reason: 'API documentation detected', category: 'development' },
  ],
};

// Common stop words to filter out
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'his', 'hers', 'ours', 'theirs',
  'what', 'when', 'where', 'why', 'how', 'which', 'who', 'whom', 'whose',
  'if', 'then', 'else', 'while', 'for', 'against', 'between', 'among', 'through', 'during', 'before', 'after',
  'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once',
  'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn'
]);

/**
 * Extract keywords from content using basic TF-IDF approach
 */
function extractKeywords(content: string, maxKeywords: number = 10): string[] {
  // Clean and normalize content
  const cleanContent = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into words and filter
  const words = cleanContent.split(' ')
    .filter(word => 
      word.length > 2 && 
      !STOP_WORDS.has(word) &&
      !/^\d+$/.test(word) // Filter out pure numbers
    );

  // Count word frequencies
  const wordCounts = new Map<string, number>();
  words.forEach(word => {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  });

  // Sort by frequency and return top keywords
  return Array.from(wordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Detect content type based on content and URL
 */
function detectContentType(content: string, url?: string): SmartTagResponse['contentType'] {
  const lowerContent = content.toLowerCase();
  const lowerUrl = url?.toLowerCase() || '';

  // Check for documentation patterns
  if (lowerContent.includes('api') || lowerContent.includes('documentation') || 
      lowerUrl.includes('docs.') || lowerUrl.includes('documentation')) {
    return 'documentation';
  }

  // Check for tutorial patterns
  if (lowerContent.includes('step') || lowerContent.includes('tutorial') || 
      lowerContent.includes('guide') || lowerContent.includes('how to')) {
    return 'tutorial';
  }

  // Check for news patterns
  if (lowerContent.includes('news') || lowerContent.includes('announcement') || 
      lowerContent.includes('released') || lowerContent.includes('update')) {
    return 'news';
  }

  // Check for blog patterns
  if (lowerContent.includes('blog') || lowerContent.includes('post') || 
      lowerContent.includes('article')) {
    return 'blog';
  }

  return 'general';
}

/**
 * Generate smart tag suggestions based on content analysis
 */
export async function generateSmartTags(request: SmartTagRequest): Promise<SmartTagResponse> {
  const { content, title, url } = request;
  
  // Extract keywords from content
  const keywords = extractKeywords(content);
  
  // Detect content type
  const contentType = detectContentType(content, url);
  
  // Generate suggestions based on keywords and content type
  const suggestions: TagSuggestion[] = [];
  const usedTags = new Set<string>();

  // Add suggestions based on keywords
  keywords.forEach(keyword => {
    const keywordSuggestions = MOCK_TAG_SUGGESTIONS[keyword] || [];
    keywordSuggestions.forEach(suggestion => {
      if (!usedTags.has(suggestion.tag)) {
        suggestions.push(suggestion);
        usedTags.add(suggestion.tag);
      }
    });
  });

  // Add content type specific suggestions
  const contentTypeSuggestions: TagSuggestion[] = [];
  switch (contentType) {
    case 'documentation':
      contentTypeSuggestions.push(
        { tag: 'documentation', confidence: 0.90, reason: 'Technical documentation detected', category: 'development' },
        { tag: 'reference', confidence: 0.80, reason: 'Reference material', category: 'general' }
      );
      break;
    case 'tutorial':
      contentTypeSuggestions.push(
        { tag: 'tutorial', confidence: 0.90, reason: 'Tutorial content detected', category: 'general' },
        { tag: 'learning', confidence: 0.85, reason: 'Educational content', category: 'general' }
      );
      break;
    case 'news':
      contentTypeSuggestions.push(
        { tag: 'news', confidence: 0.90, reason: 'News content detected', category: 'general' },
        { tag: 'current-events', confidence: 0.80, reason: 'Current events', category: 'general' }
      );
      break;
    case 'blog':
      contentTypeSuggestions.push(
        { tag: 'blog', confidence: 0.90, reason: 'Blog post detected', category: 'general' },
        { tag: 'article', confidence: 0.85, reason: 'Article content', category: 'general' }
      );
      break;
  }

  contentTypeSuggestions.forEach(suggestion => {
    if (!usedTags.has(suggestion.tag)) {
      suggestions.push(suggestion);
      usedTags.add(suggestion.tag);
    }
  });

  // Sort by confidence and limit results
  suggestions.sort((a, b) => b.confidence - a.confidence);
  const topSuggestions = suggestions.slice(0, 8);

  return {
    suggestions: topSuggestions,
    extractedKeywords: keywords,
    contentType,
  };
}

/**
 * Get popular tags from user's existing entries
 */
export async function getPopularTags(): Promise<Tag[]> {
  // Mock popular tags - in real implementation, this would come from user's vault
  return [
    { name: 'react', color: '#61dafb', category: 'development', usageCount: 15, createdAt: new Date().toISOString() },
    { name: 'javascript', color: '#f7df1e', category: 'development', usageCount: 12, createdAt: new Date().toISOString() },
    { name: 'ai', color: '#ff6b6b', category: 'ai', usageCount: 10, createdAt: new Date().toISOString() },
    { name: 'tutorial', color: '#4ecdc4', category: 'general', usageCount: 8, createdAt: new Date().toISOString() },
    { name: 'research', color: '#45b7d1', category: 'research', usageCount: 6, createdAt: new Date().toISOString() },
    { name: 'important', color: '#ffa726', category: 'important', usageCount: 5, createdAt: new Date().toISOString() },
  ];
}

/**
 * Save user's tag preferences for learning
 */
export async function saveTagPreference(tag: string, accepted: boolean): Promise<void> {
  // Mock implementation - in real app, this would save to backend for AI learning
  console.log(`Tag preference saved: ${tag} - ${accepted ? 'accepted' : 'rejected'}`);
  
  // Store in local storage for now
  const preferences = JSON.parse(localStorage.getItem('tagPreferences') || '{}');
  if (!preferences[tag]) {
    preferences[tag] = { accepted: 0, rejected: 0 };
  }
  preferences[tag][accepted ? 'accepted' : 'rejected']++;
  localStorage.setItem('tagPreferences', JSON.stringify(preferences));
}

/**
 * Get tag color based on category
 */
export function getTagColor(category?: Tag['category']): string {
  const colorMap: Record<Tag['category'], string> = {
    general: '#6b7280',
    technology: '#3b82f6',
    research: '#8b5cf6',
    development: '#10b981',
    ai: '#ef4444',
    important: '#f59e0b',
    notes: '#06b6d4',
    personal: '#ec4899',
    work: '#6366f1',
  };
  
  return colorMap[category || 'general'];
} 