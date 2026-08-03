# Test User Credentials

> BismiLLAH Ar-Rahman Ar-Roheem.
>
> This file documents all seeded test user credentials for the
> Minhaajulhudaa Hub platform. Use these to log in and test the
> various platform features and role-based access.
>
> **WARNING: These are test credentials for development/staging only.
> Change all passwords before going to production.**

## How to Seed

Run the seed script to populate Lightbase with test data:

```bash
npm run seed
```

This creates all the users below plus platform data (blog posts,
events, campaigns, packages, etc.) for end-to-end testing.

## Platform Admin Credentials

These users have full admin access to their respective platform's
admin dashboard. Log in at `/<platform>/admin/login`.

| Platform | Email | Password | Role |
|----------|-------|----------|------|
| School | admin@minhaajulhudaa.org | Admin@2026 | admin |
| Masjid | admin.masjid@minhaajulhudaa.org | Admin@2026 | admin |
| Charity | admin.charity@minhaajulhudaa.org | Admin@2026 | admin |
| Travels | admin.travels@minhaajulhudaa.org | Admin@2026 | admin |

**Admin panel URL format:** `/<platform>/admin`
- School admin: `/school/admin`
- Masjid admin: `/masjid/admin`
- Charity admin: `/charity/admin`
- Travels admin: `/travels/admin`

## School Platform Users

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Student | student@minhaajulhudaa.org | Student@2026 | Can access student portal, courses, exams |
| Teacher | teacher@minhaajulhudaa.org | Teacher@2026 | Can access teacher portal, grade assignments, create quizzes |

**School portal URL:** `/school/portal`
**Teacher portal URL:** `/school/portal/teacher`

## Masjid Platform Users

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Member | member@minhaajulhudaa.org | Member@2026 | Standard masjid community member |

## Charity Platform Users

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Donor | donor@minhaajulhudaa.org | Donor@2026 | Can make donations and track impact |
| Volunteer | volunteer@minhaajulhudaa.org | Volunteer@2026 | Can log volunteer hours and browse opportunities |

## Travels Platform Users

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Customer | traveler@minhaajulhudaa.org | Traveler@2026 | Can book packages and view itineraries |

## Environment-Based Admin Login

In addition to the database-backed user auth above, the admin panel
also supports env-based login via `VITE_ADMIN_USERS_<PLATFORM>` env
vars. The default credentials (set in `.env`) are:

| Platform | Username | Password |
|----------|----------|----------|
| School | admin | Minhaajulhudaa@2026 |
| Masjid | admin | Minhaajulhudaa@2026 |
| Charity | admin | Minhaajulhudaa@2026 |
| Travels | admin | Minhaajulhudaa@2026 |

These are checked against the env var, not the database. They are a
fallback for when the database is unavailable.

## API Authentication

All API endpoints (except public collections) require a Bearer token.
To get a token:

```bash
curl -X POST https://your-domain/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@minhaajulhudaa.org","password":"Admin@2026","platform":"school"}'
```

Response:
```json
{
  "user": { "email": "...", "role": "admin", ... },
  "token": "eyJ1aWQiOi...",
  "expiresAt": 1234567890000
}
```

Use the token in subsequent requests:
```bash
curl -H "Authorization: Bearer <token>" https://your-domain/api/db/users
```

## Public Collections (No Auth Required)

These collections can be read without authentication:

- School: blog_posts, events, programs, courses, classes, library, shop_products, announcements
- Masjid: blog_posts, events, prayer_times, audio_library, quran_recitations, announcements, programs, islamic_calendar
- Charity: blog_posts, events, campaigns, projects, testimonials, impact_reports
- Travels: blog_posts, events, packages, reviews, itineraries

All other collections (users, otps, transactions, donations, bookings,
etc.) require authentication.

## Lightbase Database

- **Base URL:** http://lightbase.80.225.189.74.sslip.io
- **Project ID:** minhaajulhuda-hub
- **Tenant:** default
- **API Key:** lb_live_5hzteka02tjjmddc7zhn813j7dgmrfenw0x89tmf9c95s9zjhtzg

The API key is stored server-side only (in the Astro backend). It is
NEVER exposed in the client bundle. The React app talks to the Astro
`/api/db/*` proxy which forwards requests to Lightbase with the key.

---

BaarokaLLAHU Fee.
