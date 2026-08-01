# Minhaajulhudaa Hub - Monorepo

> BismiLLAH Ar-Rahman Ar-Roheem.

A multi-platform Islamic community hub comprising four platforms (School,
Masjid, Charity, Travels) with a shared React frontend and an Astro
backend API.

## Architecture

```
minhaajulhudaa-hub/
├── apps/
│   └── server/              # Astro backend (API only, no UI)
│       └── src/pages/api/   # REST endpoints
├── src/                     # React frontend (Vite + React + TS)
│   ├── pages/               # Public + admin pages per platform
│   ├── components/          # Shared UI components (shadcn/ui)
│   └── lib/                 # DB, auth, payment, email services
├── scripts/tools/           # Seed and maintenance scripts
└── package.json             # Root workspace (npm workspaces)
```

### Frontend (root)
- **Stack**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Routing**: React Router v6 with platform-scoped routes (`/school`, `/masjid`, `/charity`, `/travels`)
- **DB**: Lightbase BaaS via `/api/v1` (default), switchable to GitHub-repo DB via `VITE_DB_PROVIDER`
- **Dev port**: 8080

### Backend (`apps/server`)
- **Stack**: Astro 4 + Node adapter (standalone)
- **Role**: Serves ONLY the API. All UIs remain on the React app.
- **Endpoints**:
  - `GET /api/health` - server + DB health check
  - `POST /api/auth/login` - server-side login with scrypt password hashing
  - `GET /api/db/:collection` - list docs (public collections open, others require auth)
  - `POST /api/db/:collection` - insert doc (requires auth)
- **Why**: Moves the Lightbase API key and password verification server-side so they never reach the browser.
- **Dev port**: 4321

## Development

```bash
# Install all deps (root + workspace)
npm install

# Run frontend only
npm run dev

# Run backend only
npm run dev:server

# Run both concurrently
npm run dev:all

# Seed Lightbase with test data
npm run seed

# Build both
npm run build:all
```

## Environment

Copy `.env.example` to `.env` and fill in values. Key vars:

- `VITE_DB_PROVIDER` - `lightbase` (default) or `github`
- `VITE_LIGHTBASE_BASE_URL` / `VITE_LIGHTBASE_API_KEY` / `VITE_LIGHTBASE_PROJECT_ID`
- `VITE_ADMIN_USERS_<PLATFORM>` - admin credentials (e.g. `admin:password`)

The Astro backend reads `LIGHTBASE_*` (without the `VITE_` prefix) at
runtime. The `.env` file sets both forms.

## Test Credentials

After running `npm run seed`:

| Role | Email | Password |
|---|---|---|
| School admin | admin@minhaajulhudaa.org | Admin@2026 |
| Masjid admin | admin.masjid@minhaajulhudaa.org | Admin@2026 |
| Charity admin | admin.charity@minhaajulhudaa.org | Admin@2026 |
| Travels admin | admin.travels@minhaajulhudaa.org | Admin@2026 |
| School student | student@minhaajulhudaa.org | Student@2026 |
| School teacher | teacher@minhaajulhudaa.org | Teacher@2026 |
| Masjid member | member@minhaajulhudaa.org | Member@2026 |
| Charity donor | donor@minhaajulhudaa.org | Donor@2026 |
| Charity volunteer | volunteer@minhaajulhudaa.org | Volunteer@2026 |
| Travels customer | traveler@minhaajulhudaa.org | Traveler@2026 |

## Core Working Protocol

All agents and contributors MUST follow `Core_Working_Protocol.md`.
Every commit, response, and generation begins and ends with the
prescribed adhkar. This is the non-negotiable foundation of all work
in this repository.

BaarokaLLAHU Fee.
