# Home Assistant — Project Documentation & Audit

## 1. Purpose

This project is a lightweight AI-first productivity/dashboard platform (codename: YAPIAP) combining a React/Tailwind dashboard, a tiny Node tracking API, and a lightweight mobile front-end. The UI demonstrates modules for tasks, calendar, analytics, automation, and an AI chatbot. The repository appears to be an early-stage prototype / UI mock coupled with a simple JSON-backed tracking API.

## 2. Tech stack

- Frontend: React 18 + Vite (dashboard-web, mobile-app)
- Styling: Tailwind CSS
- Animations: Framer Motion
- Routing: react-router-dom
- Icons: lucide-react (used in code; not declared in `dashboard-web` dependencies)
- Backend: Express (simple JSON-file data store in `data/tracks.json`)
- Dev tooling: Vite, ESLint, nodemon (in backend devDependencies)
- Data storage: Local JSON file (`backend/data/tracks.json`)

Notes:
- The top-level `package.json` declares a workspace containing `dashboard-web`.
- The repository contains duplicated copies under `Home-assistant/` and a `repo-backups/` snapshot.

## 3. Implemented features and functionality

- Dashboard UI with multiple widgets (Daily Overview, Focus Timer, AI Assistant)
- Multiple pages/routes: Dashboard, Tasks, Calendar, Analytics, Automation, Chatbot, Profile, Settings
- Reusable UI components (GlassCard, ModuleCard, Sidebar, Topbar, AIOrb)
- Small Express API (present in `dashboard-web/server.js` and in backup `repo-backups/.../backend/server.js`) which implements:
  - POST `/track` - validate and store tracking events to `data/tracks.json`
  - GET `/data` - read stored events with optional query filters (`deviceType`, `limit`)
- Mobile-app scaffold (Vite + React) with simple entry files

## 4. Pages / Screens / Routes (what each does)

All routes are defined in `dashboard-web/src/App.jsx`.

- `/` — Dashboard: overview widgets, tasks list, AI orb, progress
- `/tasks` — Tasks: Kanban-like lanes (static items)
- `/calendar` — Calendar: weekly schedule and upcoming events (static)
- `/analytics` — Analytics: metrics cards and placeholder chart area
- `/automation` — Automation: workflow triggers and canvas (visual placeholders)
- `/chatbot` — Chatbot: static conversation mock and memory/uploads area
- `/profile` — Profile: user summary and streak
- `/settings` — Settings: appearance and layout options (static)

Notes: Pages are currently UI-only and mostly populated with static placeholder content (no network calls).

## 5. Folder structure & architecture

Top-level (key folders):
- `package.json` — workspace config (references `dashboard-web`)
- `backend/` — contains `package.json` and `data/tracks.json` (empty array). Note: `server.js` is not present here in the main `backend/` folder.
- `dashboard-web/` — main web app (Vite + React):
  - `index.html`, `vite.config.js`, `tailwind.config.cjs`
  - `src/` — React source
    - `App.jsx`, `main.jsx`, `index.css`
    - `components/` — UI components (AIOrb, GlassCard, ModuleCard, Sidebar, Topbar)
    - `layouts/` — MainLayout
    - `pages/` — page components
  - `server.js` — a simple Express API that stores tracks in `dashboard-web/data/tracks.json`
  - `data/tracks.json` (present under backend as well)
- `mobile-app/` — separate Vite-based mobile scaffold
- `Home-assistant/` — mirrored/duplicated copy of project (appears to be a working snapshot)
- `repo-backups/` — backup snapshot(s)

Architecture notes:
- Frontend is client-side React (single-page app) with client routes.
- Backend(s) are simple Express servers writing JSON files.
- No database abstraction, no message queues, no worker processes present.

## 6. Data flow

- Client UI is currently static and does not call backend APIs in the provided React code.
- The Express server (`dashboard-web/server.js` and backup backend `.../backend/server.js`) exposes endpoints:
  - POST `/track` validates payload and appends a record to `data/tracks.json` (atomic write via tmp file + rename).
  - GET `/data` returns the stored array, supports filtering by `deviceType` and `limit` query params.
- The `tracks.json` file is the single source of truth for event storage.
- Typical track object structure (when created by POST `/track`):
  - id, deviceType, deviceId, payload, receivedAt, timestamp

## 7. External integrations / Home Assistant

- There are no active Home Assistant (HASS) API integrations or Home Assistant components in the codebase.
- The README references many planned integrations (OpenAI, Hugging Face, Discord, GitHub, Google, Postgres, Redis, etc.), but these are aspirational—no code integrates with those services in this repo snapshot.

## 8. Reusable components

Found in `dashboard-web/src/components/`:
- `AIOrb` — decorative avatar/orb for AI assistant actions
- `GlassCard` — core card wrapper used across pages for the "glass" UI panel
- `ModuleCard` — small metric/summary tile used on Dashboard
- `Sidebar` — navigation sidebar (uses lucide-react icons)
- `Topbar` — header with title and notifications
- `layouts/MainLayout` — page-level layout composing `Sidebar` and `Topbar`

Purpose: these components form the visual system for the dashboard and are reused across multiple pages.

## 9. Authentication, user management, permissions

- No authentication, user accounts, sessions, or RBAC are implemented.
- `Profile` page is static and contains a hard-coded name string.

## 10. Unfinished / placeholder / mock features

- Chatbot: static conversation; no backend or AI integration.
- Analytics: chart area is a placeholder with dashed border.
- Automation: visual canvas is UI-only; no drag/drop or persistent workflow storage.
- Tasks: static Kanban lanes without CRUD, drag/drop, or persistence.
- Mobile-app: basic scaffold without connected features.
- README lists many planned modules that are not implemented in this snapshot.

## 11. Bugs, code smells, and areas for improvement

Major issues:
- Missing dependency: `lucide-react` is imported in `dashboard-web/src/components/Sidebar.jsx` and `Topbar.jsx`, but `dashboard-web/package.json` does not include `lucide-react`. Running `npm install` in `dashboard-web` will fail unless the icon package is added or hoisted.
- Duplicate/misaligned backend code: `server.js` exists under `dashboard-web/` and in `repo-backups/.../backend/` but the top-level `backend/` folder (next to `dashboard-web`) lacks `server.js`. This is confusing and can lead to starting the wrong server or missing files.
- Duplicated project copies (`Home-assistant/`, `repo-backups/`) cause maintenance overhead and ambiguity about the canonical source.
- Frontend pages are static placeholders — missing API integrations and unit/integration tests.
- No authentication or environment config; secrets handling is absent.
- No package-lock / yarn.lock consistency in workspaces — multiple package.json files across packages could cause version mismatches.
- No CI configuration, no tests, no linting config checked in (though ESLint is a devDependency in dashboard-web).

Code style suggestions:
- Convert duplicated `server.js` instances to a single canonical backend package and include it in the workspace and README run instructions.
- Add missing runtime dependencies to `dashboard-web/package.json` (e.g. `lucide-react`) and ensure devDependencies are consistent.
- Replace local JSON file storage with a simple DB (SQLite, lowdb, or Postgres) for durability depending on goals.
- Add runtime env var handling (dotenv) so ports and file paths are configurable.
- Add basic tests for backend endpoints and a smoke test for the frontend routing.

Security considerations:
- JSON file writes are not hardened; ensure restricted file permissions for production and validate payloads strictly.
- Add rate-limiting and input sanitization before exposing `/track` publicly.

## 12. How to run the project locally

Prerequisites:
- Node.js 18+ and npm
- (Optional) Git

Recommended quick steps for the UI-only development (dashboard):

1. Open a terminal and run:

```bash
cd dashboard-web
npm install
npm run dev
```

This starts the Vite dev server (default `http://localhost:5173`).

Backend (if you want to run the tracking API):

Note: the canonical `server.js` is present as `dashboard-web/server.js` and also in the backups. There is also a `backend` folder with `package.json` but no `server.js` file — choose the location you want as canonical.

To run the server using the one shipped inside `dashboard-web`:

```bash
cd dashboard-web
npm install  # to install express/cors if not already in parent
node server.js
# or for development with auto-reload (if nodemon installed at root):
# npx nodemon server.js
```

Or to use the `backend` package (if you copy `server.js` into `backend/`):

```bash
cd backend
npm install
npm start
```

API endpoints:
- POST `http://localhost:3000/track` — accepts JSON body { deviceType, deviceId?, payload, timestamp? }
- GET `http://localhost:3000/data` — returns stored array; query `?deviceType=phone&limit=10` supported

Important local fixes before running:
- Install missing frontend dependency: `npm install lucide-react` inside `dashboard-web` if running the dashboard.
- Confirm which server.js you want to use; ensure `data/` directory exists and is writable.

## 13. Project status report

- Completed features:
  - Dashboard UI skeleton with pages and reusable components
  - Simple Express endpoints for tracking events (present in backup and `dashboard-web`) that persist to JSON
- Partially completed features:
  - Automation UI scaffold (visuals only)
  - Chatbot UI (static messaging) — no AI integration
  - Analytics metrics cards — no real metrics feeding them
- Missing features:
  - Authentication & user management
  - Real AI integrations (OpenAI/HuggingFace)
  - Persistent database (beyond JSON file)
  - Background workers, queues, and task execution
  - Tests, CI, and deployment config
  - Consistent package and server layout (no duplicates)

Suggested next steps (prioritized):
1. Fix workspace/package issues: add missing `lucide-react` to `dashboard-web/package.json` and choose canonical backend location.
2. Consolidate or remove duplicated copies (`Home-assistant/`, `repo-backups/`) and document canonical paths.
3. Add environment config (`dotenv`) and move `server.js` into `backend/` (or make a single `api/` package) with scripts in root `package.json` to run both server and frontend concurrently.
4. Wire frontend to backend for tasks, data, and chatbot features with small API clients.
5. Add authentication (JWT, Clerk, or Auth.js) if user-specific features required.
6. Add unit tests for backend endpoints and a smoke test for React routing.
7. If AI features are desired, add integration modules behind a server-side adapter (avoid exposing keys in client).

---

## Appendix: Quick checklist for onboarding a new developer

- Node.js version: 18+
- To run frontend:
  - `cd dashboard-web && npm install && npm run dev`
- To run backend:
  - Choose the server implementation (recommended: move `dashboard-web/server.js` to `backend/server.js`) then `cd backend && npm install && npm start`
- Run local sanity checks: visit `http://localhost:5173` (frontend), `http://localhost:3000/data` (API)
- Recommended immediate PRs:
  - Add `lucide-react` to `dashboard-web/package.json`
  - Add a README section clarifying canonical repo layout and how backups mirror the source
  - Add `.env.example` with PORT and other settings

---

If you'd like, I can:
- Create and commit `PROJECT_DOCUMENTATION.md` (done) and open a PR structure.
- Patch `dashboard-web/package.json` to add `lucide-react` and run a quick `npm install` (I can create the patch here).
- Consolidate `server.js` into `backend/` and update start scripts.
- Wire one small API call from the dashboard (e.g., fetch `/data`) as a proof-of-concept.

Tell me which follow-up action you prefer next.