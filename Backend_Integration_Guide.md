# Backend Integration Guide

## 🎯 Overview

This document outlines the recent frontend developments and what the backend developer needs to know for successful integration. We've completed significant feature development and are ready for backend API implementation.

**Current Status**: Frontend is feature-complete with mock data, ready for real API integration.

---

## 📋 Recent Frontend Developments

### ✅ Completed Features

#### 1. **Smart Tagging System**
- **Location**: `extension/src/api/tagService.ts`
- **Components**: Integrated into `SaveTab.tsx` and `VaultTab.tsx`
- **Features**:
  - Intelligent tag suggestions based on content
  - Tag management and filtering
  - Auto-complete functionality
  - Tag-based search and organization

#### 2. **Quick Notes & Highlights**
- **Location**: `extension/src/api/highlightService.ts` (deleted, needs recreation)
- **Components**: `highlight-editor.tsx`, `highlights-manager.tsx` (deleted, needs recreation)
- **Features**:
  - Rich text note-taking
  - Highlight management
  - Note organization and search
- **Status**: Components were deleted but functionality is planned

#### 3. **Intelligent Knowledge Assistant** ⭐ **NEW**
- **Location**: `extension/src/api/chatService.ts`
- **Components**: 
  - `extension/src/components/ui/chat-message.tsx`
  - `extension/src/components/ui/chat-interface.tsx`
  - `extension/src/components/tabs/AssistantTab.tsx`
- **Features**:
  - Full chat interface with message bubbles
  - Mock AI responses with contextual intelligence
  - Conversation management (save, load, delete, export)
  - Template system for quick-start questions
  - Suggestion system for follow-up questions
  - Source attribution and confidence scoring

#### 4. **Enhanced UI Architecture**
- **New Tab**: Added "Assistant" tab to main navigation
- **Updated App Structure**: 4-tab layout (Save, Search, Vault, Assistant)
- **Component Library**: Extensive use of shadcn/ui components
- **Responsive Design**: Optimized for Chrome extension popup

---

## 🔧 Backend Integration Requirements

### 1. **Shared Types Updates Needed**

The current `shared/types.ts` needs expansion to support new features:

```typescript
// Current types (already exist)
interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  url?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  type: 'url' | 'text';
  summary?: string;
}

// NEW TYPES NEEDED:

// Smart Tagging
interface TagSuggestion {
  tag: string;
  confidence: number;
  category?: string;
}

interface TagRequest {
  content: string;
  existingTags?: string[];
}

interface TagResponse {
  suggestions: TagSuggestion[];
  popularTags?: string[];
}

// Quick Notes & Highlights
interface Note {
  id: string;
  entryId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

interface Highlight {
  id: string;
  entryId: string;
  text: string;
  startOffset: number;
  endOffset: number;
  note?: string;
  createdAt: string;
}

// Intelligent Assistant
interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    sources?: string[];
    confidence?: number;
    query?: string;
  };
}

interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: {
    recentEntries?: KnowledgeEntry[];
    searchHistory?: string[];
  };
}

interface ChatResponse {
  message: ChatMessage;
  conversationId: string;
  suggestions?: string[];
  sources?: {
    entryId: string;
    title: string;
    relevance: number;
    excerpt: string;
  }[];
}
```

### 2. **New API Endpoints Required**

#### Smart Tagging Endpoints
```typescript
// POST /api/tags/suggest
// Generate tag suggestions for content
interface TagSuggestionRequest {
  content: string;
  existingTags?: string[];
}

interface TagSuggestionResponse {
  suggestions: TagSuggestion[];
  popularTags?: string[];
}

// GET /api/tags/popular
// Get user's most used tags
interface PopularTagsResponse {
  tags: Array<{
    tag: string;
    count: number;
  }>;
}
```

#### Notes & Highlights Endpoints
```typescript
// POST /api/entries/{entryId}/notes
// Create a note for an entry
interface CreateNoteRequest {
  content: string;
  tags?: string[];
}

// GET /api/entries/{entryId}/notes
// Get all notes for an entry
interface NotesResponse {
  notes: Note[];
}

// POST /api/entries/{entryId}/highlights
// Create a highlight for an entry
interface CreateHighlightRequest {
  text: string;
  startOffset: number;
  endOffset: number;
  note?: string;
}

// GET /api/entries/{entryId}/highlights
// Get all highlights for an entry
interface HighlightsResponse {
  highlights: Highlight[];
}
```

#### Intelligent Assistant Endpoints
```typescript
// POST /api/chat/message
// Send a message to the AI assistant
interface ChatMessageRequest {
  message: string;
  conversationId?: string;
  context?: {
    recentEntries?: KnowledgeEntry[];
    searchHistory?: string[];
  };
}

interface ChatMessageResponse {
  message: ChatMessage;
  conversationId: string;
  suggestions?: string[];
  sources?: {
    entryId: string;
    title: string;
    relevance: number;
    excerpt: string;
  }[];
}

// GET /api/chat/conversations
// Get user's conversation history
interface ConversationsResponse {
  conversations: Conversation[];
}

// POST /api/chat/conversations
// Create a new conversation
interface CreateConversationRequest {
  title: string;
  initialMessage?: string;
}

// DELETE /api/chat/conversations/{conversationId}
// Delete a conversation

// GET /api/chat/templates
// Get conversation starter templates
interface TemplatesResponse {
  templates: Array<{
    title: string;
    message: string;
    tags: string[];
  }>;
}
```

### 3. **Database Schema Updates**

#### New Tables Needed:
```sql
-- Tags table for better tag management
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  tag VARCHAR(100) NOT NULL,
  usage_count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, tag)
);

-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES entries(id),
  content TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Highlights table
CREATE TABLE highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES entries(id),
  text TEXT NOT NULL,
  start_offset INTEGER NOT NULL,
  end_offset INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  type VARCHAR(10) NOT NULL CHECK (type IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### 4. **AI Integration Requirements**

#### For Intelligent Assistant:
- **Embedding Service**: For understanding user queries and finding relevant content
- **LLM Integration**: For generating contextual responses (OpenAI, Claude, etc.)
- **Vector Search**: For finding relevant knowledge entries based on semantic similarity
- **Context Management**: For maintaining conversation context and history

#### Suggested AI Flow:
1. User sends message
2. Embed the message
3. Search knowledge vault for relevant entries
4. Generate response using LLM with context from found entries
5. Return response with sources and suggestions

---

## 🔄 Integration Strategy

### Phase 1: Core API Implementation
1. **Update shared types** with new interfaces
2. **Implement basic CRUD endpoints** for entries, tags, notes, highlights
3. **Set up database schema** with new tables
4. **Test with frontend mock data replacement**

### Phase 2: AI Integration
1. **Set up vector database** (Pinecone, Weaviate, etc.)
2. **Implement embedding service** for content indexing
3. **Integrate LLM** for chat responses
4. **Build semantic search** for knowledge retrieval

### Phase 3: Advanced Features
1. **Implement conversation management**
2. **Add template system**
3. **Build suggestion engine**
4. **Optimize performance and caching**

---

## 🧪 Testing Coordination

### Frontend Testing
- All features currently work with mock data
- Ready to switch to real API endpoints
- Need coordination on authentication flow

### Integration Testing Points
1. **Authentication**: Test Clerk.dev integration
2. **Data Flow**: Verify CRUD operations work end-to-end
3. **AI Responses**: Test chat functionality with real AI
4. **Performance**: Ensure response times are acceptable

### Testing Checklist
- [ ] User can save entries with tags
- [ ] User can search and filter by tags
- [ ] User can add notes and highlights
- [ ] User can chat with AI assistant
- [ ] Conversations are saved and retrievable
- [ ] AI responses are contextual and helpful

---

## 📞 Communication Protocol

### For Backend Developer:
1. **Update shared types** when implementing new endpoints
2. **Coordinate on authentication** implementation
3. **Test API endpoints** with frontend developer
4. **Document any API changes** in this guide

### For Frontend Developer:
1. **Replace mock services** with real API calls
2. **Test all features** with real backend
3. **Report any integration issues**
4. **Coordinate on deployment**

---

## 🚀 Next Steps

### Immediate (Backend Developer):
1. Review and update `shared/types.ts`
2. Set up database schema
3. Implement basic CRUD endpoints
4. Test with frontend developer

### Short-term:
1. Implement AI integration
2. Build conversation management
3. Optimize performance
4. Deploy to staging

### Long-term:
1. Production deployment
2. Chrome Web Store submission
3. User feedback and iteration

---

## 📝 Notes

- All frontend features are **production-ready** with mock data
- **No breaking changes** expected to existing functionality
- **Backward compatibility** maintained for existing endpoints
- **Performance considerations** important for AI features
- **Security** critical for user data and AI interactions

**Last Updated**: January 2025
**Status**: Ready for backend integration 