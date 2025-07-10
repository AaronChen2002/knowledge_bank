## ✨ Purpose

Establish a secure, user-friendly authentication system **entirely within the Chrome extension**. The goal is to ensure:

- Only authenticated users can ingest and search content
- Each saved or retrieved item is correctly tied to the user's identity
- Session state persists across popup opens
- Backend APIs can trust requests are scoped to the right user

This PRD outlines the UX, session persistence, token handling, and backend expectations for supporting user identity inside the extension.

---

## 💡 Feature Scope

- In-extension sign-in UI (email or OAuth)
- Session token and user ID stored locally (`chrome.storage.local`)
- Access control across all features (ingestion, search, future digest settings)
- `userId` included in all requests to backend APIs
- Token used to authenticate requests securely

> ❌ There is no separate web UI
> 
> 
> ✅ Auth must work *entirely* inside the Chrome extension popup
> 

---

## 🤠 User Flow

### A. First-Time User (Not Authenticated)

1. User opens the extension
2. UI checks for valid session (`chrome.storage.local`)
3. If no session, user is shown a login screen
4. User logs in via magic link or OAuth (via popup or redirect tab)
5. On success:
    - JWT token and `userId` are stored securely
    - Auth state is loaded into memory

### B. Returning User (Authenticated)

1. On popup open, session is restored from `chrome.storage.local`
2. User is shown the main UI:
    - “Save” tab
    - “Search” tab
3. Token is appended to all API calls
4. Logout option clears session + refreshes extension state

---

## 🧱 Auth Provider Recommendation

| Feature | Recommended Provider |
| --- | --- |
| Auth method | **Clerk.dev** or **Supabase Auth** |
| Login type | Magic link or Google OAuth |
| Token format | JWT |
| Identity fields | `userId`, `email`, `token`, `expiresAt` |

Both services offer Chrome-extension-friendly auth flows (with popup or redirect support), strong docs, and built-in user management.

---

## 📂 Session State Model

```
interface AuthSession {
  userId: string;
  email?: string;
  token: string; // JWT
  expiresAt: number;
  isAuthenticated: boolean;
}

```

- Stored via `chrome.storage.local`
- Loaded into React context (`useAuth()`) at extension startup

---

## 📆 API Contract Integration

### All requests to backend APIs must:

- Include `Authorization: Bearer <JWT>` header (preferred)
- OR explicitly include `userId` in request body (fallback for MVP)

### Backend must:

- Verify token on each request
- Reject expired or invalid tokens
- Scope all queries to authenticated `userId`

---

## 🔁 Frontend Integration Points

| Area | Uses Auth? | Behavior |
| --- | --- | --- |
| Ingest Tab | ✅ | Appends `userId` to `POST /api/ingest` |
| Search Tab | ✅ | Appends `userId` to `POST /api/search` |
| Digest (future) | ✅ | Digest logic uses token or ID to query entries |
| Login View | ✅ | Initiates provider flow and stores session |

---

## 🚀 Success Criteria

- Login is fully contained inside the extension (no external UI required)
- Auth state is available immediately after login
- Session persists between popup opens
- Authenticated users can ingest + search, unauthenticated users cannot
- Auth token is passed and verified on every API call

---

## ⚠️ Error & Edge States

| Scenario | Behavior |
| --- | --- |
| No valid token | Show login screen |
| Token expired | Prompt re-authentication |
| API call with invalid token | Show error + refresh token or logout |
| Logout | Clear all local session data and reset app state |

---

## 🔐 Security Notes

- Use `chrome.storage.local` for token storage (not `localStorage`)
- Minimize exposure of JWT — store in memory only when needed
- Consider token refresh flow (e.g. via silent re-auth)

---

## 🌐 Future Enhancements

- Profile page inside extension
- Multi-device session management
- Account deletion or data export
- Biometric unlock (OS pass-through, advanced)

---

Let me know if you'd like this added to your Canvas workspace, or we can move on to drafting the **Backend Responsibilities Document** next.