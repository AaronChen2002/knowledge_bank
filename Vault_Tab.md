# Vault Tab PRD — "Recents" View

### ✨ Purpose

Give users a lightweight, scrollable view of their **recently saved content**, all within the Chrome extension. This supports reflection, memory recall, and reduces friction compared to requiring semantic search for every lookup.

This tab exists alongside the "Save" and "Search" tabs in the popup.

---

### 💡 Feature Scope

- A new tab labeled `Vault` or `Recents`
- Pulls last **10–25 saved entries** for the authenticated user
- Entries appear in reverse chronological order
- Each item shows:
    - Title (if available)
    - Summary (truncated if long)
    - Date
    - Type badge (`url` or `text`)
    - Optional: link icon (for `url` items)

---

### 🤠 User Flow

1. User opens extension and clicks `Vault` tab
2. Recent entries appear in scrollable list
3. User clicks link icon to open original source in new tab
4. (Optional) User can copy a snippet or tag an entry

---

### 🧩 Component Breakdown

| Component | Role |
| --- | --- |
| `VaultTab` | Main container |
| `VaultEntryCard` | Renders each item |
| `EmptyState` | If no entries exist |
| `LoadingState` | While fetching results |

---

### 📆 API Contract

```
ts
CopyEdit
GET /api/entries/recent?limit=25

// Headers:
Authorization: Bearer <JWT>

// Response:
[
  {
    id: "entry_123",
    title: "Prompt Injection Risks",
    summary: "This explains how prompt injection can override instructions...",
    type: "url",
    date: "2024-07-11T10:34:00Z",
    source: "https://example.com/article",
    tags: ["Security", "LLMs"]
  },
  ...
]

```

---

### ✅ Success Criteria

- Authenticated user sees 10–25 most recent entries
- Scrolls smoothly and renders summaries
- Entries with links open in new tab
- Entries without links still show cleanly
- If no entries exist, show empty state message

---

### 🔮 Future Enhancements

- Date range picker ("Entries from last week")
- “Pin” or “Favorite” entries
- Quick re-ingest or edit tags