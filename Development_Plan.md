# Knowledge Bank Development Plan

## 🎯 Project Overview

We're building a Chrome extension for personal knowledge management with semantic search capabilities. The extension allows users to save web content and search their knowledge vault using natural language queries.

**Repository Structure:**
```
knowledge_bank/
├── extension/          # Chrome extension (React + Vite + Tailwind)
├── backend/           # API server (Node.js/Python + Vector DB)
├── shared/            # Shared types and contracts
└── docs/              # PRDs and documentation
```

---

## 🏗️ Architecture & Tech Stack

### Frontend (Chrome Extension)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: useContext + useReducer
- **Auth**: Clerk.dev (popup-based OAuth)
- **Extension**: Manifest V3
- **Permissions**: `["storage", "tabs", "activeTab", "contextMenus"]`

### Backend (API Server)
- **Runtime**: Node.js (TypeScript preferred) or Python
- **Auth Provider**: Clerk.dev
- **Database**: PostgreSQL/DynamoDB for metadata
- **Vector DB**: Pinecone/Weaviate/OpenSearch
- **Embedding**: OpenAI or AWS Bedrock
- **Infrastructure**: AWS (Lambda, S3, API Gateway)

### Shared
- **Types**: Shared TypeScript interfaces
- **API Contracts**: RESTful endpoints
- **Config**: Environment variables and feature flags

---

## 🔧 Development Phases

### Phase 1: Complete Frontend Foundation ✅ COMPLETE
**Goal**: Working Chrome extension with full UI and mock functionality

**Completed Tasks:**
- ✅ Set up Vite + React + Tailwind in `/extension`
- ✅ Create `manifest.json` with proper permissions
- ✅ Build tabbed layout (Save/Search/Vault) with complete UI
- ✅ Implement state management with React hooks
- ✅ Create Save tab with forms, URL capture, mock API integration
- ✅ Create Search tab with mock results and full UI
- ✅ Create Vault tab with mock recent entries and full UI
- ✅ Background script setup with context menu registration
- ✅ Content script for page interaction
- ✅ Context menu text capture → popup communication
- ✅ All loading/success/error states implemented

**Deliverable**: ✅ Complete working extension with all UI features and mock data

### Phase 2: Backend Foundation (Backend) 🔄 IN PROGRESS
**Goal**: API structure and auth setup

**Tasks:**
- Set up Clerk.dev account and configuration
- Create API endpoints: `/api/ingest`, `/api/search`, `/api/entries/recent`
- Basic auth middleware (JWT verification)
- Database schema for entries
- Set up embedding pipeline

**Deliverable**: API endpoints return real data, auth works

### Phase 3: Shared Types & Configuration 📋 NEXT
**Goal**: Prepare for API integration

**Tasks:**
- Create `/shared/types.ts` for frontend/backend interfaces
- Set up configuration management (`config.ts`)
- Create auth context structure (with mocks)
- Prepare API integration points

**Deliverable**: Shared contracts ready for backend integration

### Phase 4: Authentication Integration 🤝 WAITING FOR PHASE 2
**Goal**: Real authentication working

**Frontend Tasks:**
- Integrate Clerk frontend SDK
- Token storage in `chrome.storage.local`
- Auth context implementation with real auth

**Backend Tasks:**
- Complete Clerk backend integration
- JWT verification middleware
- User-scoped data access

**Deliverable**: Login/logout works, API calls authenticated

### Phase 5: Real API Integration 🔌 WAITING FOR PHASES 2 & 4
**Goal**: Replace mocks with real API calls

**Tasks:**
- Switch Save tab from mock to real API
- Switch Search tab from mock to real API  
- Switch Vault tab from mock to real API
- Error handling for real network conditions

**Deliverable**: Full search and browsing experience with real data

### Phase 7: Polish & Deploy (Both)
**Goal**: Production ready

**Tasks:**
- Error handling refinement
- Performance optimization
- Chrome Web Store submission prep
- Production deployment

---

## 📋 File Structure & Conventions

### Extension Structure
```
/extension
├── src/
│   ├── components/     # UI components (PascalCase)
│   │   ├── TabSwitcher.tsx
│   │   ├── SaveTab.tsx
│   │   ├── SearchTab.tsx
│   │   └── VaultTab.tsx
│   ├── hooks/          # Custom hooks (camelCase)
│   │   ├── useAuth.ts
│   │   ├── useSearch.ts
│   │   └── useVault.ts
│   ├── contexts/       # React contexts
│   │   ├── AuthContext.tsx
│   │   └── StateContext.tsx
│   ├── utils/          # Helper functions
│   │   ├── formatDate.ts
│   │   ├── config.ts
│   │   └── api.ts
│   └── mocks/          # Mock data & API
│       ├── mockApi.ts
│       └── dummyData.ts
├── public/             # Static assets
├── manifest.json
└── popup.html
```

### Naming Conventions
- **Components**: PascalCase (`VaultCard.tsx`)
- **Hooks/Utils**: camelCase (`useAuth.ts`, `formatDate.ts`)
- **Files**: One component per file
- **Types**: Co-located inline unless shared globally

---

## 🔗 API Contracts

### Authentication
All API requests must include:
```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Endpoints

#### POST /api/ingest
**Request:**
```typescript
interface IngestRequest {
  type: 'url' | 'text';
  content: string;
  source?: string;
  tags?: string[];
  userId: string; // extracted from JWT
}
```

**Response:**
```typescript
interface IngestResponse {
  success: boolean;
  entryId: string;
}
```

#### POST /api/search
**Request:**
```typescript
interface SearchRequest {
  query: string;
  filters?: {
    tags?: string[];
    fromDate?: string;
    toDate?: string;
  };
  userId: string; // extracted from JWT
}
```

**Response:**
```typescript
interface SearchResult {
  id: string;
  title: string;
  summary: string;
  source?: string;
  date: string;
  type: 'url' | 'text';
  tags?: string[];
}
```

#### GET /api/entries/recent
**Query:** `?limit=25`
**Response:** `SearchResult[]`

---

## 🔧 Shared Types

Create `/shared/types.ts` for interfaces used by both frontend and backend:

```typescript
// User & Auth
interface User {
  userId: string;
  email: string;
  token: string;
  expiresAt: number;
  isAuthenticated: boolean;
}

// Entry Models
interface Entry {
  id: string;
  userId: string;
  type: 'url' | 'text';
  content: string;
  source?: string;
  title?: string;
  summary?: string;
  tags?: string[];
  date: string;
  embeddingIds?: string[];
}

// API Contracts (as above)
interface IngestRequest { ... }
interface SearchRequest { ... }
interface SearchResult { ... }
```

---

## 🎛️ Configuration

### Environment Variables
```typescript
// config.ts
export const config = {
  API_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3001',
  CLERK_PUBLISHABLE_KEY: process.env.VITE_CLERK_PUBLISHABLE_KEY,
  USE_MOCK_API: process.env.VITE_USE_MOCK_API === 'true',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
};
```

### Feature Flags
```typescript
export const features = {
  ENABLE_CONTEXT_MENU: true,
  ENABLE_TAGS: true,
  ENABLE_FILTERS: false, // v2
  ENABLE_DIGEST: false,  // v2
};
```

---

## 🤝 Collaboration Protocol

### Communication
- **API Changes**: Update `/docs/api.md` and notify before shipping
- **Type Changes**: Update `/shared/types.ts` immediately
- **Integration**: Test together during Phase 4 (auth integration)

### Code Review
- Create feature branches: `feature/save-tab`, `feature/auth-middleware`
- Open PRs for major changes
- Review together before merging to main

### Testing Coordination
- **Mock Phase**: Frontend uses `mockApi.ts`
- **Integration Phase**: Switch to real API endpoints
- **End-to-End**: Test complete user flows together

---

## 📝 State Management

### Frontend State Structure
```typescript
interface GlobalState {
  user: {
    userId: string;
    token: string;
    email?: string;
    isAuthenticated: boolean;
  };
  ingest: {
    snippet: string;
    tags: string[];
    status: 'idle' | 'saving' | 'success' | 'error';
    errorMessage?: string;
  };
  search: {
    query: string;
    results: SearchResult[];
    status: 'idle' | 'loading' | 'error' | 'success';
    errorMessage?: string;
  };
  ui: {
    activeTab: 'save' | 'search' | 'vault';
    toast?: {
      message: string;
      type: 'success' | 'error';
    };
  };
}
```

### Persistence Strategy
- **chrome.storage.local**: `token`, `userId`, `activeTab`
- **In-memory**: Form inputs, search results, loading states
- **localStorage**: Optional last search query

---

## 🧪 Testing Strategy

### Manual Testing
- **Popup**: Click extension icon → test all tabs
- **Context Menu**: Highlight text → right-click → "Save Snippet"
- **API**: Use browser dev tools to inspect network requests

### Integration Testing
- **Phase 4**: Test auth flow end-to-end
- **Phase 5**: Test search with real embeddings
- **Phase 6**: Test context menu → API flow

### Chrome Extension Testing
- Load unpacked extension from `/extension`
- Test on various websites
- Verify permissions work correctly

---

## 🚀 Deployment

### Chrome Extension
- Build: `npm run build`
- Load unpacked: Chrome Extensions → Developer mode
- Publish: Chrome Web Store (Phase 7)

### Backend
- Deploy to AWS Lambda/ECS
- Set up production Clerk environment
- Configure vector database

---

## 📞 Getting Started

### Frontend Developer
1. `cd extension && npm install`
2. `npm run dev` for development
3. Load unpacked extension in Chrome
4. Start with Phase 1 tasks

### Backend Developer
1. Set up Clerk.dev account
2. Create API server structure
3. Implement Phase 2 endpoints
4. Share Clerk keys via secure channel

---

## 🔄 Status Updates

We'll track progress in this document and update as we complete phases. Both developers should update their section when major milestones are reached.

**Last Updated**: January 2025
**Current Phase**: Phase 1 COMPLETE ✅ | Phase 2 IN PROGRESS 🔄 | Phase 3 NEXT 📋

### Phase 1 Completion Status ✅
- Complete Chrome extension with full UI built and tested
- All tabs (Save/Search/Vault) working with mock data and complete functionality
- Context menu, background script, and content script operational
- State management, loading states, and error handling implemented
- Ready for shared types setup and backend API integration

### Next Steps 
- **Phase 3**: Create shared types and configuration structure (frontend task)
- **Phase 2**: Backend continues with Clerk setup and API development (backend task)  
- **Phase 4**: Requires Phase 2 completion for authentication integration 