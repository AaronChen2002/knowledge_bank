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

### Phase 2: Lovable UI Integration ✅ COMPLETE
**Goal**: Replace the initial placeholder UI with the new design system from the `snippet-vault-flow` repository.
- ✅ Integrated `shadcn/ui` components.
- ✅ Replaced all three tabs (Save, Search, Vault) with new layouts.
- ✅ Configured Tailwind CSS, PostCSS, and Vite for the new design system.
- ✅ Ensured the extension builds successfully with the new UI.
- **Deliverable**: A visually updated extension, still using mock data, that serves as the new foundation.

### Phase 3: Frontend Logic Re-integration (Next for Frontend Dev) 📋 NEXT
**Goal**: Connect the new UI components to the underlying Chrome extension logic. This is the immediate next step for the frontend developer.
- **Task**: In `SaveTab.tsx`, replace the hardcoded URL with a call to the background script to get the actual current tab URL.
- **Task**: Re-implement the logic to listen for and populate snippets saved via the context menu.
- **Task**: In `SearchTab.tsx` and `VaultTab.tsx`, ensure the "Open" button correctly opens the result URL in a new tab using `chrome.tabs.create`.
- **Task**: Clean up state management (`useState`) in each tab to be more robust and remove any redundant mock data.
- **Deliverable**: A fully interactive extension where UI actions correctly interact with the browser.

### Phase 4: Backend Foundation (Next for Backend Dev) 🔄 IN PROGRESS
**Goal**: Build the core API structure and set up authentication. This can be worked on in parallel with Phase 3.
- **Task**: Set up Clerk.dev account and configuration.
- **Task**: Create initial API endpoints: `/api/ingest`, `/api/search`, `/api/entries/recent`.
- **Task**: Implement basic auth middleware for JWT verification.
- **Task**: Define the database schema for knowledge entries.
- **Deliverable**: A running backend server with protected endpoints ready for integration.

### Phase 5: Shared Types & Configuration 📋 WAITING
**Goal**: Formalize the data contracts between the frontend and backend.
- **Task**: Finalize all interfaces in `/shared/types.ts`.
- **Task**: Prepare frontend API utility functions for making authenticated requests.
- **Deliverable**: A stable, shared contract that both apps can rely on.

### Phase 6: Full-Stack Integration 🔌 WAITING
**Goal**: Connect the frontend to the live backend API.
- **Task**: Replace all mock API calls in the frontend with real, authenticated requests to the backend.
- **Task**: Implement robust loading, error, and success states for all network operations.
- **Task**: Integrate the Clerk frontend SDK for login/logout functionality.
- **Deliverable**: A fully working extension with a complete end-to-end data flow.

### Phase 7: Polish & Deploy 🚀 WAITING
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