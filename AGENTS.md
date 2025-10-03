# Agent Instructions

## Commands

### Setup
```bash
npm install
```

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Test
No test framework configured.

### Dev Server
```bash
npm run dev
```

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite
- **UI:** shadcn/ui (Radix UI primitives) + Tailwind CSS
- **Routing:** React Router v6
- **State:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod validation

## Architecture
- Multi-platform app with route-based separation (`/school`, `/masjid`, `/charity`, `/travels`)
- Component-based architecture with shared UI components in `src/components/ui/`
- Path alias `@/` points to `src/`
- Platform-specific routing via `PlatformRouter` and `PlatformLayout` wrappers

## Code Style
- Components use React functional components with TypeScript
- Utility-first CSS with Tailwind (use `cn()` from `@/lib/utils` for class merging)
- shadcn/ui patterns: variant props with `class-variance-authority`, forwarded refs
- Relaxed TypeScript config (implicit any, unused vars allowed)
- ESLint configured with React Hooks plugin, unused vars warnings disabled
