## ✨ Purpose

Enable users to search their saved knowledge (snippets + links) using **natural language**, directly from the Chrome extension. The goal is to provide fast, intelligent retrieval of previously saved content — with results ranked by semantic relevance, not keyword match.

This search functionality coexists with the ingestion UI inside the same extension popup, creating a unified surface for saving and retrieving information.

---

## 💡 Feature Scope

- Natural language search input
- Semantically matched results via vector similarity (not string matching)
- Each result includes title, summary, source, date, and optional tags
- Embedded within the extension popup UI (alongside the “Save” flow)
- Empty, loading, and error handling states

> 🔁 There is no separate web interface — search happens entirely in the extension.
> 

---

## 🤠 User Flow

1. User opens the Chrome extension popup
2. Switches to the **"Search" tab** (or collapsible panel)
3. Enters a natural language query
4. Clicks "Search" or presses Enter
5. Results appear below, ranked by semantic relevance
6. User clicks a source link to revisit the original content (opens in new tab)

---

## 🖼️ UI Layout (Extension-Friendly)

| Section | Description |
| --- | --- |
| **Tabs** | Two main tabs: `Save` and `Search` |
| **Search Bar** | Input field + search button |
| **Result List** | Scrollable vertical list of results |
| **Each Result Includes** |  |
| • Title | Truncated headline of saved item |
| • Summary | 1–3 sentence generated summary |
| • Source link | Opens original article (if type is `url`) |
| • Type badge | `"url"` or `"text"` |
| • Date saved | Shown as relative or formatted string |
| • Tags | Optional chips for context |
| **Empty State** | “No matches — try rephrasing” |
| **Loading State** | Spinner + “Searching your vault…” |
| **Error State** | Fallback message on failure |

---

## 📂 Data Model

```
interface SearchRequest {
  query: string;
  filters?: {
    tags?: string[];
    fromDate?: string;
    toDate?: string;
  };
  userId: string;
}

```

```
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

---

## 📆 API Contract

### Endpoint: `POST /api/search`

### Sample Request

```json
{
  "query": "What did I learn about AI alignment?",
  "userId": "user_abc123"
}

```

### Sample Response

```json
[
  {
    "id": "entry_xyz456",
    "title": "Understanding AI Alignment Risks",
    "summary": "This article covered concerns about misaligned objectives in powerful AI systems...",
    "source": "https://example.com/ai-alignment",
    "date": "2024-07-07T11:05:00Z",
    "type": "url",
    "tags": ["AI", "Alignment"]
  }
]

```

---

## 🧠 Retrieval Logic Requirements (Backend)

- All saved entries should be embedded on ingestion
- User queries are embedded at search time
- Search must use **semantic vector similarity**, not keyword matching
- Optional: bias results toward recent entries

> ❌ No LLM-generated answers are required
> 
> 
> ✅ Retrieval must feel intelligent and meaningful
> 

---

## 📊 Component Breakdown

| Component | Role |
| --- | --- |
| `SearchTab` | Houses search UI within extension popup |
| `SearchBar` | Accepts user query |
| `SearchResultsList` | Displays matching entries |
| `SearchResultCard` | Shows title, summary, date, type, etc. |
| `EmptyState` | Encouraging fallback when no matches |
| `Spinner` | Loading indicator during API fetch |
| `ErrorMessage` | Displayed on API failure |

---

## 🚀 Success Criteria

- Search tab loads inside the Chrome extension
- User enters a query and sees relevant entries ranked by meaning
- API call includes `userId`
- Handles loading and error gracefully
- Clicking source links opens external content in a new tab

---

## ⚠️ Error & Edge Cases

| Scenario | Behavior |
| --- | --- |
| No query entered | Search button disabled |
| No results | Empty state prompt shown |
| API fails | Error message + retry option |
| User not logged in | Block access and redirect to auth flow |

---

## 🌐 Auth Integration

- Search requests must include a valid `userId`
- Auth state should persist inside the extension
- If no valid session is found, user is prompted to log in before searching

---

## 🔮 Future Enhancements (v2+)

- Smart filtering (tags, date, source)
- AI-generated answer above result list
- Click-to-copy snippets
- Pin or favorite entries
- "Remind me later" or spaced repetition-style prompts

---