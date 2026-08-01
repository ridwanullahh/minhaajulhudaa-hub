# Production Gaps Audit - Minhaajulhudaa Hub

> BismiLLAH Ar-Rahman Ar-Roheem.
>
> Audit of the platform against enterprise production-grade specs.
> Each gap is tagged [CRITICAL] / [HIGH] / [MEDIUM] / [LOW] by impact.

## 1. Security [CRITICAL]

### 1.1 Admin routes are not protected
- **Gap**: `PlatformRouter.tsx` renders `<AdminDashboard platform="..." />`
  for `/admin/*` routes without wrapping in `AdminProtectedRoute`.
  Anyone can visit `/school/admin/students` and see the admin UI.
- **Fix**: Wrap every `path="/admin/*"` element in `<AdminProtectedRoute platform="...">`.
- **Status**: TODO

### 1.2 No global error boundary
- **Gap**: No `ErrorBoundary` component. An uncaught render error crashes
  the whole app to a white screen.
- **Fix**: Add `src/components/ErrorBoundary.tsx` with a fallback UI;
  wrap the app root in `AppProviders`.
- **Status**: TODO

### 1.3 Password hashing is client-side SHA-256
- **Gap**: `auth-context.tsx` hashes passwords with SHA-256 in the
  browser. This is reversible-equivalent (attacker who reads the DB can
  replay the hash). Production auth must hash server-side with bcrypt/
  argon2.
- **Fix**: When the Astro backend lands (Task 5), move auth to a
  server endpoint that hashes with bcrypt. For now, document as a known
  limitation and add a salt per-user.
- **Status**: DEFERRED to Task 5 (Astro backend)

### 1.4 No rate limiting on auth endpoints
- **Gap**: Login/register can be brute-forced.
- **Fix**: Add client-side throttle (max 5 attempts / 5 min) and
  server-side rate limit when Astro backend lands.
- **Status**: TODO (client throttle now, server limit in Task 5)

### 1.5 Secrets in client bundle
- **Gap**: `VITE_LIGHTBASE_API_KEY` is exposed in the client bundle
  (Vite inlines VITE_ vars). Anyone can extract it.
- **Fix**: Proxy DB calls through the Astro backend (Task 5) so the
  Lightbase key never reaches the browser. For now, the key is scoped
  to the minhaajulhuda-hub project only.
- **Status**: DEFERRED to Task 5

## 2. Data Integrity [HIGH]

### 2.1 No optimistic concurrency on updates
- **Gap**: `LightbaseSDK.update` does not send `If-Match: <revision>`,
  so concurrent edits can silently overwrite each other.
- **Fix**: Read `_revision` on get, send `If-Match` on patch, retry on
  409.
- **Status**: TODO

### 2.2 Subscribe uses polling, not realtime
- **Gap**: `LightbaseSDK.subscribe` polls every N seconds instead of
  using Lightbase's SSE realtime endpoint.
- **Fix**: Switch to EventSource on `/realtime/subscribe`.
- **Status**: MEDIUM (polling works; realtime is an optimization)

### 2.3 No pagination on list views
- **Gap**: `LightbaseSDK.get` fetches up to 1000 docs. Large collections
  will degrade.
- **Fix**: Add cursor-based pagination to admin list pages.
- **Status**: MEDIUM (current data volumes are small)

## 3. UX / Resilience [HIGH]

### 3.1 Inconsistent loading states
- **Gap**: 28 admin files reference `isLoading` but patterns vary
  (some use Skeleton, some use spinners, some show nothing).
- **Fix**: Standardize on a `<LoadingState>` component.
- **Status**: TODO (will be addressed in UI/UX revamp - Task 4)

### 3.2 No error states on data fetch
- **Gap**: Pages that fail to load data show nothing or a console
  error.
- **Fix**: Add `<ErrorState>` component with retry button; wrap data
  fetches in try/catch with toast on error.
- **Status**: TODO (will be addressed in UI/UX revamp - Task 4)

### 3.3 No empty states
- **Gap**: Collections with 0 items render empty tables.
- **Fix**: Add `<EmptyState>` component with a call-to-action.
- **Status**: TODO (will be addressed in UI/UX revamp - Task 4)

### 3.4 Form validation is inconsistent
- **Gap**: Only 2 files use zod. Most forms do manual validation or
  none.
- **Fix**: Standardize on react-hook-form + zodResolver across all
  forms.
- **Status**: MEDIUM (will be addressed incrementally)

## 4. Feature Gaps [MEDIUM]

### 4.1 School LMS incomplete
- **Gap**: TeacherPortal, AdminLMS, CourseCreator, AssignmentGrading,
  QuizBuilder, DiscussionForums, CertificateGeneration not implemented.
- **Fix**: Implement in a follow-up sprint.
- **Status**: DEFERRED (large scope)

### 4.2 Masjid Audio Lab incomplete
- **Gap**: Advanced search, playlist management, download functionality
  not implemented.
- **Fix**: Implement in a follow-up sprint.
- **Status**: DEFERRED

### 4.3 Charity donation tracking incomplete
- **Gap**: Recurring donations, impact metrics, Zakat calculator not
  fully implemented.
- **Fix**: Implement in a follow-up sprint.
- **Status**: DEFERRED

### 4.4 Travels booking engine incomplete
- **Gap**: Dynamic pricing, payment plan management not implemented.
- **Fix**: Implement in a follow-up sprint.
- **Status**: DEFERRED

## 5. Performance [MEDIUM]

### 5.1 Bundle size
- **Gap**: Main bundle is 676 KB (178 KB gzipped). Above 500 KB limit.
- **Fix**: Code-split per platform route (lazy import).
- **Status**: TODO

### 5.2 No caching strategy
- **Gap**: Every page navigation re-fetches from Lightbase.
- **Fix**: Use TanStack Query's cache (already available) for stale-
  time windows.
- **Status**: TODO

## 6. Observability [LOW]

### 6.1 No structured logging
- **Gap**: Console.log/error scattered; no structured logger.
- **Fix**: Add a logger utility.
- **Status**: LOW

### 6.2 No analytics
- **Gap**: No page-view or event tracking.
- **Fix**: Add VITE_GOOGLE_ANALYTICS_ID integration.
- **Status**: LOW

## 7. Testing [LOW]

### 7.1 No test framework
- **Gap**: No tests configured.
- **Fix**: Add vitest + react-testing-library; cover critical paths
  (auth, db CRUD, payment flow).
- **Status**: LOW (production can ship without, but should add)

---

## Implementation Priority Order

1. **[CRITICAL] 1.1 Admin route protection** - immediate security fix
2. **[CRITICAL] 1.2 Error boundary** - prevents white-screen crashes
3. **[HIGH] 1.4 Client-side auth rate limiting** - brute-force protection
4. **[HIGH] 2.1 Optimistic concurrency** - data integrity
5. **[HIGH] 3.1-3.3 Loading/error/empty states** - UX resilience (Task 4)
6. **[MEDIUM] 5.1 Code-splitting** - performance
7. **[DEFERRED] 1.3/1.5/4.x** - require Astro backend (Task 5)

---

End of audit. BaarokaLLAHU Fee.
