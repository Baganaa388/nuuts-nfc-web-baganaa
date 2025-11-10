# Migration Notes: React + Vite + Node.js Stack

## Overview

This project has been migrated from a server-side rendered Express.js application to a modern React + Vite frontend with a Node.js + Express backend API, while preserving all core logic exactly as it was.

## Folder Structure

```
nfc-web/
├── nfc-web/              # ORIGINAL PROJECT (read-only reference)
│   ├── server.js
│   ├── routes_public.js
│   ├── routes_api.js
│   ├── routes_admin.js
│   ├── db.js
│   ├── config.js
│   ├── layouts.js
│   └── leaderboard.sqlite3
│
├── backend/              # NEW: Node.js + Express API
│   ├── server.js
│   ├── config.js
│   ├── db.js
│   ├── routes/
│   │   ├── api.js        # ESP32/Gateway API endpoints
│   │   ├── public.js      # Public API endpoints
│   │   └── admin.js      # Admin API endpoints
│   └── package.json
│
└── frontend/             # NEW: React + Vite Frontend
    ├── src/
    │   ├── App.jsx
    │   ├── api.js        # API client
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   └── Layout.css
    │   └── pages/
    │       ├── HomePage.jsx
    │       ├── ProfilePage.jsx
    │       ├── RegisterPage.jsx
    │       ├── AboutPage.jsx
    │       ├── ResolvePage.jsx
    │       ├── AdminLoginPage.jsx
    │       └── AdminDashboardPage.jsx
    ├── vite.config.js
    └── package.json
```

## Core Logic Preservation

### Registration Link Logic

**Original Location:** `nfc-web/routes_public.js` - `getRegister()` and `postRegister()`

**New Location:**
- **Backend:** `backend/routes/public.js` - `checkRegister()` and `postRegister()`
- **Frontend:** `frontend/src/pages/RegisterPage.jsx`

**Preserved Behavior:**
- GET `/register?uid=...` checks if UID exists and shows appropriate message
- POST `/register` creates user with NFC UID using `createUserWithUid()` function
- Same validation: name is required, UID is optional but preserved if provided
- Same database operations: UID is uppercased, trimmed, and checked for uniqueness

### NFC UID Handling Logic

**Original Locations:**
1. `nfc-web/routes_public.js` - `getResolveUID()` - resolves UID to profile or registration
2. `nfc-web/routes_api.js` - `postScan()`, `getLastScanApi()`, `getNdefUrl()`

**New Locations:**
- **Backend:** 
  - `backend/routes/public.js` - `getResolveUID()` (preserved logic)
  - `backend/routes/api.js` - `postScan()`, `getLastScanApi()`, `getNdefUrl()` (preserved logic)
- **Frontend:** 
  - `frontend/src/pages/ResolvePage.jsx` - handles UID resolution redirects

**Preserved Behavior:**
- `/r/:uid` route resolves UID: redirects to `/u/:id` if user exists, `/register?uid=...` if not
- `/api/scan` endpoint: inserts scan, checks for user, optionally adds transaction
- `/api/last-scan` endpoint: returns last scanned UID and associated user
- `/api/ndef-url` endpoint: returns profile URL if user exists, registration URL if not
- All UID processing: uppercased, trimmed, validated exactly as before

### Database Operations

**Original Location:** `nfc-web/db.js`

**New Location:** `backend/db.js` (1:1 copy, no changes)

**Preserved Functions:**
- `getUserByUID()` - finds user by NFC UID
- `createUserWithUid()` - creates user with UID (handles UID uniqueness)
- `insertScan()` - records NFC scan
- `insertTransactionAndUpdateTotal()` - adds transaction and updates totals
- All other database helper functions preserved exactly

## API Endpoints

### Public API (JSON responses)

- `GET /api/leaderboard` - Returns leaderboard rows
- `GET /api/user/:id` - Returns user profile data
- `GET /api/register/check?uid=...` - Checks if UID is registered
- `POST /api/register` - Creates new user registration
- `GET /api/resolve/:uid` - Resolves UID to redirect path

### ESP32 / Gateway API (unchanged)

- `POST /api/scan` - Records NFC scan, optionally adds transaction
- `GET /api/last-scan` - Returns last scanned UID and user info
- `GET /api/ndef-url?uid=...` - Returns URL to write to NFC card

### Admin API (JSON responses)

- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/dashboard?q=...` - Admin dashboard data
- `POST /api/admin/quick-add-tx` - Add transaction to user
- `POST /api/admin/quick-register-link` - Quick register user with UID
- `POST /api/admin/delete-user` - Delete user and cascade

## How to Run

### Backend

```bash
cd backend
npm install
npm start
# Server runs on http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Environment Variables

Create `.env` files in both `backend/` and `frontend/` if needed:

**backend/.env:**
```
PORT=8000
DB_PATH=./leaderboard.sqlite3
ADMIN_USER=baganaa
ADMIN_PASS=123456
SESSION_SECRET=CHANGE_THIS_SESSION_SECRET
FRONTEND_URL=http://localhost:5173
```

**frontend/.env:**
```
VITE_API_BASE=/api
```

## Key Changes Made

1. **Server-side rendering → API + React:**
   - Original: Express routes returned HTML strings
   - New: Express routes return JSON, React renders UI

2. **Route structure:**
   - Original: `/`, `/u/:id`, `/register`, `/r/:uid` returned HTML
   - New: Same routes in React Router, API endpoints prefixed with `/api`

3. **Session management:**
   - Original: Server-side sessions for admin
   - New: Same server-side sessions, cookies sent with API requests

4. **Database:**
   - Same SQLite database schema
   - Same database file location (can be shared or separate)
   - All database operations preserved exactly

5. **CORS:**
   - Added CORS middleware to backend for frontend communication
   - Configured to allow credentials (for sessions)

## Testing Checklist

- [ ] Leaderboard displays correctly
- [ ] User registration with NFC UID works
- [ ] Profile pages show correct user data
- [ ] NFC UID resolution (`/r/:uid`) redirects correctly
- [ ] Admin login and dashboard work
- [ ] Admin can add transactions
- [ ] Admin can quick-register users
- [ ] ESP32 API endpoints (`/api/scan`, `/api/ndef-url`) work
- [ ] Database operations match original behavior

## Notes

- The original project in `nfc-web/` is completely untouched and serves as reference
- All core business logic is preserved exactly, only wrapped in API endpoints
- The React frontend recreates the exact same UI and user flows
- Database schema and operations are identical
- NFC UID processing (uppercase, trim, validation) is preserved
- Registration flow and link generation logic is preserved

