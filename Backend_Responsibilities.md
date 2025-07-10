## 🧠 Purpose

This document outlines the responsibilities of the backend system powering the Chrome extension, including:

- Ingestion processing
- Embedding + semantic storage
- Auth enforcement
- Search retrieval
- API contracts
- Security expectations

The backend will support ingestion, search, and future digest features — all scoped to authenticated users and designed to scale efficiently with semantic intelligence.

---

## 🧱 Tech Stack Assumptions (Recommended)

| Layer | Choice |
| --- | --- |
| Cloud Infra | AWS (Lambda, S3, DynamoDB/RDS, API Gateway) |
| Auth Provider | Clerk.dev or Supabase Auth |
| Embedding API | OpenAI or AWS Bedrock (e.g. Titan, Claude) |
| Vector DB | Pinecone, Weaviate, or OpenSearch |
| Server Runtime | Node.js or Python (TS preferred for parity with frontend) |

---

## 🔑 Core Responsibilities

### 1. 🔐 **Authentication & Identity**

- Every request must include a JWT in the `Authorization` header
- Backend verifies JWT via Clerk or Supabase
- Extract `userId` from decoded token and use to scope:
    - Database queries
    - Vector search
    - Storage access
- Reject all unauthenticated calls with HTTP `401`

---

### 2. 🧾 **Ingestion Pipeline**

### Endpoint: `POST /api/ingest`

Request may include:

- Type: `'text'` or `'url'`
- Content: snippet text or link
- Source: (for text) original URL context
- Tags: optional
- userId: extracted from token

### Responsibilities:

- Validate content is not empty
- Store raw entry metadata in DB (Postgres or DynamoDB)
- Generate `title` and `summary` (if not provided)
- **Embedding**:
    - Generate semantic embedding (or multiple embeddings if chunked)
    - Store in vector DB under user’s namespace/index
- Return `entryId` and success

---

### 3. 📐 **Long Content Handling**

If ingested content exceeds ~4K tokens:

- Chunk text into ~500–800 token segments
- Embed each chunk individually
- Store:
    - Chunk embeddings (for granular semantic search)
    - (Optional) Summary-level embedding for fast match
    - Full content in DB or S3 (retrievable)

---

### 4. 🔍 **Search Query Pipeline**

### Endpoint: `POST /api/search`

Request includes:

- Query string
- Filters (optional: date range, tags)
- JWT (required)

### Responsibilities:

- Embed query using same model as ingestion
- Perform **vector similarity search** in user’s vector namespace
- Retrieve metadata (title, summary, date, type, source) for top matches
- Return top N results ranked by similarity (optionally bias by recency)

---

### 5. 🗂️ **Get Recent Entries**

### Endpoint: `GET /api/entries/recent`

Query: `?limit=N`

Headers: `Authorization: Bearer <JWT>`

### Responsibilities:

- Return N most recent saved entries (by date)
- Must be scoped to `userId` extracted from token
- No semantic logic required — simple chronological query

---

### 6. 📨 **Digest Preparation (Future)**

Backend will:

- Periodically query a user’s saved entries over last 24h
- Summarize into daily digest (LLM-generated)
- Email summary to user using email service (e.g. SES, Clerk, Resend)

---

### 7. 🔐 Security & Rate Limiting

- All routes require token auth
- Implement request rate-limiting (e.g. 10 writes/minute per user)
- Reject duplicate `url` saves within same day if desired
- Protect against malformed inputs and unexpected content size

---

## 📊 Data Models (Suggested)

```
ts
CopyEdit
interface Entry {
  entryId: string;
  userId: string;
  type: 'text' | 'url';
  content: string;
  source?: string;
  summary?: string;
  title?: string;
  tags?: string[];
  embeddingIds?: string[];
  date: string;
}

```

---

## ✅ Success Criteria

- Ingested entries show up in semantic search
- Saved items appear in Vault tab in reverse-chron order
- Embeddings created once per item at save time
- Search query returns meaningful matches (not string-matched)
- Only authenticated users can read/write data
- API contracts match frontend PRDs exactly