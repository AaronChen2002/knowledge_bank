/**
 * Knowledge Bank - Shared TypeScript Interfaces
 * 
 * This file contains all shared type definitions used by both
 * the frontend (Chrome extension) and backend (Node.js API).
 * 
 * When making changes, ensure both teams are notified!
 */

// ===================================
// CORE DATA MODELS
// ===================================

/**
 * Main knowledge entry - represents any saved content
 */
export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;           // Full text content or snippet
  summary?: string;          // AI-generated or manual summary
  url?: string;             // Source URL (if applicable)
  type: 'text' | 'url' | 'file' | 'image';
  tags: string[];
  createdAt: string;        // ISO 8601 timestamp
  updatedAt: string;        // ISO 8601 timestamp
  userId: string;           // Owner of this entry
  isPublic: boolean;        // Whether entry can be shared
  sourceInfo?: SourceMetadata;
}

/**
 * Additional metadata about the source
 */
export interface SourceMetadata {
  domain?: string;          // e.g., "github.com"
  pageTitle?: string;       // Original page title
  description?: string;     // Meta description
  author?: string;          // Content author
  publishedAt?: string;     // When content was published
  favicon?: string;         // Site favicon URL
}

/**
 * User account information
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  subscription: SubscriptionInfo;
  createdAt: string;
  lastActiveAt: string;
}

/**
 * User preferences and settings
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  defaultTags: string[];
  autoSummary: boolean;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  browser: boolean;
  summary: boolean;
}

export interface PrivacySettings {
  searchHistory: boolean;
  analytics: boolean;
  publicProfile: boolean;
}

/**
 * Subscription/plan information
 */
export interface SubscriptionInfo {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due';
  entriesLimit: number;
  currentEntries: number;
  expiresAt?: string;
}

/**
 * Tag with usage statistics
 */
export interface Tag {
  name: string;
  color?: string;          // Hex color for UI
  category?: TagCategory;
  usageCount: number;
  createdAt: string;
}

export type TagCategory = 
  | 'general'
  | 'technology' 
  | 'research'
  | 'development'
  | 'ai'
  | 'important'
  | 'notes'
  | 'personal'
  | 'work';

// ===================================
// API REQUEST/RESPONSE TYPES
// ===================================

/**
 * Save new knowledge entry
 */
export interface SaveEntryRequest {
  title?: string;           // Optional, can be auto-generated
  content: string;
  url?: string;
  type: KnowledgeEntry['type'];
  tags: string[];
  isPublic?: boolean;
}

export interface SaveEntryResponse {
  success: boolean;
  entry?: KnowledgeEntry;
  error?: string;
}

/**
 * Search entries
 */
export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  pagination?: PaginationParams;
}

export interface SearchFilters {
  type?: KnowledgeEntry['type'][];
  tags?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  userId?: string;          // For admin searches
}

export interface PaginationParams {
  page: number;
  limit: number;            // Max 100
}

export interface SearchResponse {
  success: boolean;
  results: SearchResult[];
  pagination: PaginationInfo;
  error?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  url?: string;
  type: KnowledgeEntry['type'];
  tags: string[];
  createdAt: string;
  relevanceScore: number;   // 0-1, how relevant to search query
  highlightedContent?: string; // Content with search terms highlighted
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Get recent entries
 */
export interface GetEntriesRequest {
  limit?: number;
  offset?: number;
  type?: KnowledgeEntry['type'];
}

export interface GetEntriesResponse {
  success: boolean;
  entries: KnowledgeEntry[];
  total: number;
  error?: string;
}

/**
 * Authentication
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;           // JWT token
  refreshToken?: string;
  error?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// ===================================
// UI/STATE TYPES
// ===================================

/**
 * Extension tab types
 */
export type TabType = 'save' | 'search' | 'vault';

/**
 * Loading states for UI components
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;        // 0-100 for progress bars
}

/**
 * Authentication state
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * App-wide state
 */
export interface AppState {
  auth: AuthState;
  entries: KnowledgeEntry[];
  searchResults: SearchResult[];
  tags: Tag[];
  loading: LoadingState;
  error: AppError | null;
}

// ===================================
// ERROR HANDLING
// ===================================

/**
 * Standardized error format
 */
export interface AppError {
  code: ErrorCode;
  message: string;
  details?: string;
  timestamp: string;
  requestId?: string;
}

export type ErrorCode = 
  // Authentication errors
  | 'AUTH_REQUIRED'
  | 'AUTH_INVALID_TOKEN'
  | 'AUTH_EXPIRED'
  | 'AUTH_INVALID_CREDENTIALS'
  
  // Permission errors
  | 'PERMISSION_DENIED'
  | 'QUOTA_EXCEEDED'
  
  // Validation errors
  | 'VALIDATION_ERROR'
  | 'INVALID_INPUT'
  | 'MISSING_REQUIRED_FIELD'
  
  // Resource errors
  | 'ENTRY_NOT_FOUND'
  | 'USER_NOT_FOUND'
  
  // Server errors
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'DATABASE_ERROR'
  
  // Network errors
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  
  // Chrome extension specific
  | 'EXTENSION_ERROR'
  | 'PERMISSION_REQUIRED';

// ===================================
// API CONFIGURATION
// ===================================

/**
 * API endpoint configuration
 */
export interface ApiConfig {
  baseUrl: string;
  version: string;
  timeout: number;
  retries: number;
}

/**
 * Environment configuration
 */
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  api: ApiConfig;
  auth: {
    clerkPublishableKey: string;
    sessionCookieName: string;
  };
  features: FeatureFlags;
}

export interface FeatureFlags {
  aiSummaries: boolean;
  publicSharing: boolean;
  advancedSearch: boolean;
  bulkOperations: boolean;
  analytics: boolean;
}

// ===================================
// UTILITY TYPES
// ===================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AppError;
  meta?: {
    requestId: string;
    timestamp: string;
    version: string;
  };
}

/**
 * Partial update type
 */
export type PartialUpdate<T> = Partial<T> & { id: string };

/**
 * Create request type (omit server-generated fields)
 */
export type CreateRequest<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;

/**
 * Update request type
 */
export type UpdateRequest<T> = PartialUpdate<Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>;

// ===================================
// WEBHOOK TYPES (for future)
// ===================================

export interface WebhookPayload {
  event: WebhookEvent;
  data: any;
  timestamp: string;
  signature: string;
}

export type WebhookEvent = 
  | 'entry.created'
  | 'entry.updated' 
  | 'entry.deleted'
  | 'user.registered'
  | 'search.performed'
  | 'conversation.created'
  | 'conversation.updated'
  | 'note.created'
  | 'highlight.created';

// ===================================
// SMART TAGGING TYPES
// ===================================

/**
 * Tag suggestion with confidence score
 */
export interface TagSuggestion {
  tag: string;
  confidence: number;        // 0-1 confidence score
  category?: TagCategory;
  reason?: string;           // Why this tag was suggested
}

/**
 * Request for tag suggestions
 */
export interface TagSuggestionRequest {
  content: string;
  existingTags?: string[];
  context?: {
    entryType?: KnowledgeEntry['type'];
    domain?: string;
    recentTags?: string[];
  };
}

/**
 * Response with tag suggestions
 */
export interface TagSuggestionResponse {
  suggestions: TagSuggestion[];
  popularTags?: Array<{
    tag: string;
    count: number;
    category?: TagCategory;
  }>;
  autoTags?: string[];       // Automatically applied tags
}

// ===================================
// NOTES & HIGHLIGHTS TYPES
// ===================================

/**
 * Note attached to a knowledge entry
 */
export interface Note {
  id: string;
  entryId: string;
  content: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/**
 * Text highlight within an entry
 */
export interface Highlight {
  id: string;
  entryId: string;
  text: string;
  startOffset: number;
  endOffset: number;
  note?: string;             // Optional note for this highlight
  color?: string;            // Highlight color
  createdAt: string;
  userId: string;
}

/**
 * Request to create a note
 */
export interface CreateNoteRequest {
  content: string;
  tags?: string[];
}

/**
 * Request to create a highlight
 */
export interface CreateHighlightRequest {
  text: string;
  startOffset: number;
  endOffset: number;
  note?: string;
  color?: string;
}

// ===================================
// INTELLIGENT ASSISTANT TYPES
// ===================================

/**
 * Chat message in a conversation
 */
export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    sources?: string[];      // Entry IDs that informed this response
    confidence?: number;     // AI confidence in response (0-1)
    query?: string;          // Original user query
    tokens?: number;         // Token count for billing
    model?: string;          // AI model used
  };
}

/**
 * Conversation with the AI assistant
 */
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  metadata?: {
    totalMessages: number;
    lastActivity: string;
    summary?: string;
  };
}

/**
 * Request to send a message to the AI assistant
 */
export interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: {
    recentEntries?: KnowledgeEntry[];
    searchHistory?: string[];
    userPreferences?: UserPreferences;
  };
}

/**
 * Response from the AI assistant
 */
export interface ChatResponse {
  message: ChatMessage;
  conversationId: string;
  suggestions?: string[];    // Follow-up question suggestions
  sources?: Array<{
    entryId: string;
    title: string;
    relevance: number;       // 0-1 relevance score
    excerpt: string;         // Relevant text excerpt
  }>;
  metadata?: {
    processingTime: number;  // Response time in ms
    tokensUsed: number;      // Total tokens consumed
    model: string;           // AI model used
  };
}

/**
 * Conversation template for quick starts
 */
export interface ConversationTemplate {
  id: string;
  title: string;
  message: string;
  tags: string[];
  category: 'research' | 'summary' | 'search' | 'organization' | 'general';
  usageCount: number;
  isDefault: boolean;
}

/**
 * Request to create a new conversation
 */
export interface CreateConversationRequest {
  title: string;
  initialMessage?: string;
  templateId?: string;
}

// ===================================
// AI/ML SPECIFIC TYPES
// ===================================

/**
 * AI model configuration
 */
export interface AIModelConfig {
  model: string;
  temperature: number;       // 0-1, controls randomness
  maxTokens: number;
  topP: number;             // Nucleus sampling parameter
  frequencyPenalty: number; // Reduce repetition
  presencePenalty: number;  // Encourage new topics
}

/**
 * Embedding vector for semantic search
 */
export interface Embedding {
  id: string;
  entryId: string;
  vector: number[];         // Vector representation
  model: string;            // Embedding model used
  createdAt: string;
}

/**
 * Semantic search result
 */
export interface SemanticSearchResult {
  entryId: string;
  score: number;            // Similarity score (0-1)
  highlights: string[];     // Relevant text snippets
  context?: string;         // Additional context
}

// ===================================
// EXPORTS FOR CONVENIENCE
// ===================================

// Re-export commonly used types for easy importing
export type { 
  KnowledgeEntry as Entry,
  SearchResult as Result,
  AppError as Error
}; 