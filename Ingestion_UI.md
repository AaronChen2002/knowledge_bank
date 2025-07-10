## ✨ Purpose

Enable users to quickly and easily save information they encounter online to their personal knowledge vault. This could be a URL (full page) or a manually copied snippet. The extension should feel lightweight, fast, and intelligent, capturing both the content and the context (page URL).

## 💡 Feature Scope

- Google Chrome extension popup interface
- Two ingestion flows:
    1. **Snippet + Link**: User pastes a copied snippet into the popup. Extension also captures the current page URL.
    2. **Link Only**: User clicks "Save this page". Extension captures the URL.
- Optional tagging functionality
- Displays success/failure to user

> 🧩 Note: This Chrome extension popup will also serve as the entry point for search, not just ingestion. There is no separate web interface. The UI must accommodate both flows: saving and querying.
> 

## 🤠 User Flow

### A. Snippet + Link Flow

1. User copies a piece of text from a webpage
2. Clicks extension icon to open popup
3. Pastes text into the snippet field
4. Tags (optional)
5. Clicks "Save"
6. Sees a toast/confirmation that it was saved

### B. Link Only Flow

1. User visits a page and wants to save it in full
2. Opens popup and leaves snippet field blank
3. Clicks "Save This Page"
4. Extension captures tab URL
5. Confirmation toast shows successful save

C. Right click save snippet

1. User highlights a piece of text from a webpage
2. Keyboard shortcut or popup is clicked
3. This passes the text to the extension automatically without the extension icon needing to be pressed

## 📊 UI Layout

### Popup Layout

- **Header**: App logo / title
- **Snippet Input**: Multiline `textarea` for pasting text
- **URL Display**: Auto-filled, non-editable field showing the current tab URL
- **Tags Input**: Optional input with comma-separated tags or chip-style UI
- **Save Button**: Triggers `POST /api/ingest`
- **Confirmation/Toast**: Appears briefly on success or failure

## 📂 Data Model

```
interface IngestRequest {
  type: 'url' | 'text';
  content: string;           // Either the snippet or the URL itself
  source?: string;           // Always the URL, included for snippets
  tags?: string[];
  userId: string;            // From auth context
}

```

```
interface IngestResponse {
  success: boolean;
  entryId: string;
}

```

## 📆 API Contract

### Endpoint: `POST /api/ingest`

- For `text` entries:

```json
{
  "type": "text",
  "content": "Prompt injection is a risk...",
  "source": "https://example.com/blog",
  "tags": ["LLMs", "Security"],
  "userId": "user_abc123"
}

```

- For `url` entries:

```json
{
  "type": "url",
  "content": "https://example.com/full-article",
  "userId": "user_abc123"
}

```

### Expected Response:

```json
{
  "success": true,
  "entryId": "xyz789"
}

```

## 🚀 Success Criteria

- User can open the extension and either:
    - Paste a snippet and submit
    - Click a "Save this page" button with no snippet
- The current URL is always captured
- A confirmation message shows the save was successful
- Submitted data lands in `mockApi.ts` or backend with all fields intact
- UI is responsive and styled consistently with the rest of the app

## ⚠️ Error & Edge States

- Show error toast if:
    - User is not logged in (no `userId`)
    - API call fails
    - Snippet field is required but left empty (optional rule)
- Disable Save button while request is in-flight

## 🌐 Auth Integration

- User must be logged in to submit
- Extension reads from global auth context or localStorage (e.g. JWT)
- `userId` is required on all submission calls

## 🌐 Future Enhancements (v2+)

- Auto-suggest tags
- Upload PDFs or image OCR