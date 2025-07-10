## ✨ Purpose

Define how client-side state is managed across the Chrome extension popup, ensuring reliable, consistent behavior across ingestion, search, and authentication flows. This PRD establishes clear expectations for how data is stored, passed between components, and synchronized with the backend.

It serves as a reference for implementing local state, session management, and user feedback UI (loading, success, error).

---

## 🔐 Core State Categories

| Category | Description |
| --- | --- |
| **Auth State** | Tracks whether user is logged in, stores user ID + token |
| **Ingest State** | Manages input fields + submission status in the "Save" tab |
| **Search State** | Tracks current query, loading status, and returned results |
| **UI State** | Controls active tab (`save` or `search`), toasts, and loading spinners |

---

## 📦 Global State Structure

```
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
    activeTab: 'save' | 'search';
    toast?: {
      message: string;
      type: 'success' | 'error';
    };
  };
}

```

---

## 🧠 State Design Philosophy

- Use **component-local `useState`** for small, scoped values (like text input fields)
- Use **`useContext` or `useReducer`** for global session and result data
- Use **custom hooks** (`useAuth()`, `useSearch()`, etc.) for encapsulation and separation of concerns
- Session token and `userId` should persist across extension reloads using `chrome.storage.local`

---

## 🔁 State Transitions & Examples

### 🔹 Ingest Flow

| Action | State Update |
| --- | --- |
| User pastes snippet | `ingest.snippet = value` |
| Clicks Save | `ingest.status = 'saving'` |
| API success | `ingest.status = 'success'`, show toast |
| API fail | `ingest.status = 'error'`, `errorMessage` set |

---

### 🔹 Search Flow

| Action | State Update |
| --- | --- |
| User types query | `search.query = value` |
| Submits search | `search.status = 'loading'` |
| Results returned | `search.results = [...]`, `search.status = 'success'` |
| No results | `search.results = []` (UI shows empty state) |
| API fail | `search.status = 'error'`, `errorMessage` set |

---

### 🔹 Auth Flow

| Action | State Update |
| --- | --- |
| User logs in | `user.isAuthenticated = true`, `userId` and `token` set |
| User logs out | Reset all user-related state |
| Auth check fails | Redirect to login or prompt auth popup |

---

### 🔹 UI Feedback

| Event | UI State |
| --- | --- |
| Save success | `toast = { message: "Saved!", type: "success" }` |
| Search fail | `toast = { message: "Something went wrong", type: "error" }` |
| Tab switch | `ui.activeTab = 'search' |

---

## 🧪 Local Storage / Persistence (Extension Only)

| Item | Where stored | Purpose |
| --- | --- | --- |
| `token` | `chrome.storage.local` | Used in `Authorization` headers |
| `userId` | `chrome.storage.local` | Included in payloads |
| Last active tab (optional) | `localStorage` | Restore UX state on reopen |

---

## 🚀 Success Criteria

- Session persists across popup opens
- UI state resets appropriately after actions (e.g. clear form after save)
- Clear feedback shown for all async operations
- One centralized place to manage and debug state issues
- Ingestion and search flows do not interfere with each other

---

## 🧩 Tools & Patterns

| Tool | Purpose |
| --- | --- |
| `useState`, `useReducer` | Core state control |
| `useContext` | Global state access (e.g. auth, results) |
| `chrome.storage.local` | Persist session data |
| `react-hot-toast` or custom toast system | UI feedback |
| `React Query` or `SWR` (optional) | For search and ingest fetches if preferred |

---

## 🌐 Future Enhancements

- Global error boundary / retry logic
- Offline saving w/ background sync
- Recently searched query history
- In-memory caching of search results by query

---

Would you like me to generate the **Backend Responsibilities Doc** next? Or combine all PRDs into a master document for internal tracking?