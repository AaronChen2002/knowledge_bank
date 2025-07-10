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

### Phase 1: Foundation (Frontend) ⚡
**Goal**: Working Chrome extension with tabbed UI

**Tasks:**
- Set up Vite + React + Tailwind in `/extension`
- Create `manifest.json` with proper permissions
- Build tabbed layout (Save/Search/Vault)
- Implement state management with contexts
- Create mock API structure (`mockApi.ts`)

**Deliverable**: Extension loads, tabs work, ready for features

### Phase 2: Backend Foundation (Backend) ⚡
**Goal**: API structure and auth setup

**Tasks:**
- Set up Clerk.dev account and configuration
- Create API endpoints: `/api/ingest`, `/api/search`, `/api/entries/recent`
- Basic auth middleware (JWT verification)
- Database schema for entries
- Set up embedding pipeline

**Deliverable**: API endpoints return mock data, auth works

### Phase 3: Save Tab (Frontend)
**Goal**: Complete ingestion flow

**Tasks:**
- Build Save tab UI with forms
- Integrate with mock API
- Handle loading/success/error states
- URL capture from current tab

**Deliverable**: Users can save snippets/URLs (mock data)

### Phase 4: Auth Integration (Both) 🤝
**Goal**: Real authentication working

**Frontend Tasks:**
- Integrate Clerk frontend SDK
- Token storage in `chrome.storage.local`
- Auth context implementation

**Backend Tasks:**
- Complete Clerk backend integration
- JWT verification middleware
- User-scoped data access

**Deliverable**: Login/logout works, API calls authenticated

### Phase 5: Search & Vault (Frontend)
**Goal**: Complete read-only features

**Tasks:**
- Search tab with results display
- Vault tab with recent entries
- Switch from mock to real API
- Error handling and loading states

**Deliverable**: Full search and browsing experience

### Phase 6: Context Menu (Frontend)
**Goal**: Right-click functionality

**Tasks:**
- Background script setup
- Context menu registration  
- Text capture → popup communication

**Deliverable**: Complete v1 user experience

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

**Last Updated**: [Current Date]
**Current Phase**: Foundation (Phases 1 & 2 in parallel) 