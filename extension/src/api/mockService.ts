// src/api/mockService.ts

import type { SearchResult, KnowledgeEntry } from '@/shared/types';

// --- Mock Data ---

const mockKnowledgeEntries: KnowledgeEntry[] = [
  {
    id: '1',
    title: 'React Hooks Best Practices',
    content: 'Key principles for using React hooks effectively...',
    summary: 'Key principles for using React hooks effectively in modern applications...',
    createdAt: '2025-01-09T10:00:00Z',
    updatedAt: '2025-01-09T10:00:00Z',
    userId: 'user-123',
    isPublic: false,
    tags: ['react', 'hooks', 'frontend'],
    type: 'text',
  },
  {
    id: '2',
    title: 'NBA Summer League Analysis',
    content: 'Comprehensive breakdown of player performances...',
    summary: 'Comprehensive breakdown of player performances and team strategies...',
    url: 'https://www.theringer.com/2025/07/09/nba/summer',
    createdAt: '2025-01-08T11:00:00Z',
    updatedAt: '2025-01-08T11:00:00Z',
    userId: 'user-123',
    isPublic: false,
    tags: ['sports', 'nba', 'analysis'],
    type: 'url',
  },
  {
    id: '3',
    title: 'TypeScript Advanced Types',
    content: 'Deep dive into conditional types...',
    summary: 'Deep dive into conditional types, mapped types, and utility types...',
    createdAt: '2025-01-07T12:00:00Z',
    updatedAt: '2025-01-07T12:00:00Z',
    userId: 'user-123',
    isPublic: false,
    tags: ['typescript', 'programming', 'types'],
    type: 'text',
  }
];

// --- Mock API Functions ---

const simulateNetworkDelay = (delay = 800) => new Promise(resolve => setTimeout(resolve, delay));

/**
 * Simulates saving a text snippet or a page URL.
 */
export const ingest = async (data: { type: 'text' | 'url', content: string, tags?: string[] }): Promise<{ success: boolean }> => {
  await simulateNetworkDelay(1000);
  console.log('Mock Ingest:', data);
  // In a real scenario, you might add the new item to the mock data list
  return { success: true };
}

/**
 * Simulates searching the user's vault.
 */
export const search = async (query: string): Promise<SearchResult[]> => {
  await simulateNetworkDelay();
  if (!query.trim()) {
    return [];
  }
  
  const lowerCaseQuery = query.toLowerCase();
  const results = mockKnowledgeEntries.filter(entry => 
    entry.title.toLowerCase().includes(lowerCaseQuery) ||
    (entry.summary && entry.summary.toLowerCase().includes(lowerCaseQuery)) ||
    entry.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
  ).map(entry => ({
    ...entry,
    relevanceScore: Math.random(),
    highlightedContent: entry.summary,
  }));

  return results;
}

/**
 * Simulates fetching recent entries for the vault.
 */
export const getRecentEntries = async (): Promise<KnowledgeEntry[]> => {
  await simulateNetworkDelay();
  return mockKnowledgeEntries;
} 