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
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Hooks (useState, useEffect)
- **Auth**: Clerk.dev (planned)
- **Extension**: Manifest V3

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

---

## 🔧 Development Phases

### Phase 1: Frontend Foundation ✅ COMPLETE
**Goal**: Initial working Chrome extension with mock functionality.
- ✅ Set up Vite + React + Tailwind in `/extension`.
- ✅ Built initial tabbed layout (Save/Search/Vault).
- ✅ Background and content scripts for basic extension functionality.

### Phase 2: Lovable UI Integration & Mock API Foundation ✅ COMPLETE
**Goal**: Replace the placeholder UI and build a robust, decoupled frontend foundation with a mock API and clear data contracts.
- ✅ Integrated `shadcn/ui` and replaced all three tabs (Save, Search, Vault) with new layouts.
- ✅ Created a centralized mock API (`mockService.ts`) to encapsulate all mock data and logic, decoupling it from UI components.
- ✅ Established a canonical data contract with `shared/types.ts` to be used by both frontend and backend.
- ✅ Reconnected all UI components to browser logic (fetching tab URL, context menu snippets, opening links).
- ✅ Created a `useAuth` hook and implemented a complete mock login/logout flow.
- **Deliverable**: A fully interactive and visually polished extension running on a mock, contract-driven foundation, ready for backend integration.

### Phase 3: Backend API Implementation (Next for Backend Dev) 📋 NEXT
**Goal**: Build the real backend API, adhering to the established data contracts. This can be worked on in parallel with Phase 4.
- **Task**: Define the database schema based on the `KnowledgeEntry` interface in `shared/types.ts`.
- **Task**: Implement the API endpoints (`/api/ingest`, `/api/search`, etc.), ensuring their request/response bodies match the types in `shared/types.ts`.
- **Task**: Set up a real database (PostgreSQL, etc.) and connect it to the API.
- **Task**: Integrate a vector database for semantic search capabilities.
- **Deliverable**: A deployed backend API that fulfills the contract defined in `shared/types.ts`.

### Phase 4: Full-Stack Integration (Next for Frontend Dev) 🔌 WAITING
**Goal**: Connect the frontend to the live backend API and implement real authentication.
- **Task**: Create a real API service (e.g., `apiService.ts`) that makes authenticated `fetch` requests to the backend.
- **Task**: Replace all calls to `mockService.ts` with calls to the new, real API service.
- **Task**: Replace the `useAuth` hook with a real authentication context that uses a provider like Clerk.dev.
- **Task**: Implement robust loading, error, and success states for all real network operations.
- **Deliverable**: A fully working extension with a complete, end-to-end data and authentication flow.

### Phase 5: Advanced Features Implementation 🔄 IN PROGRESS
**Goal**: Implement advanced features to enhance user experience and knowledge management capabilities.
- **Task**: Smart Tagging - AI-powered tag suggestions with learning capabilities
- **Task**: Quick Notes & Highlights - Text highlighting and annotation system
- **Task**: Intelligent Knowledge Assistant - Chat interface that searches your vault
- **Task**: Multi-Modal Knowledge Capture - Support for images, PDFs, audio, and video
- **Deliverable**: Enhanced extension with advanced knowledge management features.

### Phase 6: Polish & Deploy 🚀 WAITING
**Goal**: Prepare the extension for production release.
- **Task**: Refine error handling and optimize performance.
- **Task**: Conduct thorough testing and bug fixing.
- **Task**: Prepare for Chrome Web Store submission.
- **Deliverable**: A production-ready extension.

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
**Current Phase**: Phase 1 COMPLETE ✅ | Phase 2 COMPLETE ✅ | Phase 3 NEXT 📋 | Phase 5 IN PROGRESS 🔄

### Phase 1 Completion Status ✅
- Complete Chrome extension with full UI built and tested
- All tabs (Save/Search/Vault) working with mock data and complete functionality
- Context menu, background script, and content script operational
- State management, loading states, and error handling implemented
- Ready for shared types setup and backend API integration

### Next Steps 
- **Phase 3**: Backend continues with Clerk setup and API development (backend task)
- **Phase 5**: Frontend implements advanced features (smart tagging, highlights, chat interface, file upload)
- **Phase 4**: Requires Phase 3 completion for authentication integration 