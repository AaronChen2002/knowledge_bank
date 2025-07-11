# 🤝 Knowledge Bank - Shared Types

This directory contains **shared TypeScript interfaces** used by both the frontend (Chrome extension) and backend (Node.js API).

## 🎯 Purpose

- **Consistency**: Ensures both frontend and backend use the same data structures
- **Type Safety**: Catches integration issues at compile time
- **Communication**: Serves as a contract between teams
- **Documentation**: Self-documenting code through types

## 📁 Structure

```
shared/
├── types.ts          # All shared interfaces and types
├── README.md         # This file
└── package.json      # Package configuration for importing
```

## 🚀 How to Use

### Frontend (Chrome Extension)

```typescript
// Import specific types
import { KnowledgeEntry, SearchRequest, AppError } from '../shared/types';

// Use in your components
const saveEntry = async (entry: KnowledgeEntry) => {
  // Your code here - TypeScript will validate the structure
};
```

### Backend (Node.js API)

```typescript
// Import types for API endpoints
import { SaveEntryRequest, SaveEntryResponse, User } from '../shared/types';

// Use in your API handlers
app.post('/api/entries', (req: SaveEntryRequest): SaveEntryResponse => {
  // Your code here - TypeScript ensures correct request/response shape
});
```

## 📋 Key Interfaces

### Core Data Models
- **`KnowledgeEntry`** - Main saved content (text, URLs, files)
- **`User`** - User account and preferences  
- **`Tag`** - Content categorization with usage stats

### API Contracts
- **`SaveEntryRequest/Response`** - Saving new content
- **`SearchRequest/Response`** - Searching saved content
- **`LoginRequest/Response`** - Authentication

### UI State
- **`AuthState`** - Authentication status
- **`LoadingState`** - Loading indicators
- **`AppError`** - Standardized error handling

## 🔄 Making Changes

### ⚠️ IMPORTANT RULES

1. **Coordinate Changes**: Any changes to these types affect BOTH projects
2. **Version Breaking Changes**: If you change an existing interface, update both projects immediately
3. **Communicate**: Notify your teammate before making changes
4. **Test Both Sides**: Ensure changes work in both frontend and backend

### Safe Changes ✅
- Adding optional fields (`field?: string`)
- Adding new interfaces
- Adding new union type values
- Adding new error codes

### Breaking Changes ⚠️
- Removing fields
- Changing field names
- Changing field types
- Making optional fields required

## 🛠️ Development Workflow

1. **Discuss the change** with your teammate
2. **Update the interface** in `types.ts`
3. **Update both projects** to use the new interface
4. **Test integration** to ensure everything works
5. **Commit and push** the changes

## 📝 Examples

### Adding a New Feature

```typescript
// 1. Add to shared types
export interface KnowledgeEntry {
  // ... existing fields
  aiSummary?: string;  // New optional field
}

// 2. Frontend can now use it
const entry: KnowledgeEntry = {
  // ... required fields
  aiSummary: "AI-generated summary"
};

// 3. Backend can handle it
const createEntry = (data: KnowledgeEntry) => {
  if (data.aiSummary) {
    // Handle AI summary
  }
};
```

### API Evolution

```typescript
// Version 1: Basic search
interface SearchRequest {
  query: string;
}

// Version 2: Add optional filters (safe change)
interface SearchRequest {
  query: string;
  filters?: SearchFilters;  // Optional - won't break existing code
}
```

## 🤖 Integration Benefits

### For Your Brother's Backend:
- **Clear API contracts** - knows exactly what to build
- **Type validation** - catches errors before runtime  
- **Auto-completion** - IDE helps with development
- **Refactoring safety** - changes update both projects

### For Your Frontend:
- **No integration surprises** - API matches expectations
- **Compile-time checking** - catch mismatches early
- **Better developer experience** - autocomplete and type hints
- **Easier debugging** - clear data structure expectations

## 📚 TypeScript Tips

```typescript
// Use utility types for common patterns
type CreateEntry = CreateRequest<KnowledgeEntry>;  // Omits id, timestamps
type UpdateEntry = UpdateRequest<KnowledgeEntry>;  // Partial with id

// Type guards for runtime checking
const isKnowledgeEntry = (data: any): data is KnowledgeEntry => {
  return data && typeof data.id === 'string' && typeof data.title === 'string';
};

// Generic API responses
const response: ApiResponse<KnowledgeEntry[]> = {
  success: true,
  data: entries
};
```

---

**Remember**: These types are the foundation of your project's data architecture. Keep them well-maintained and documented! 🏗️ 