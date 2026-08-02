/**
 * SPA fallback route
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Serves the React app's index.html for all non-API routes so that
 * client-side routing (React Router) works on deep links like
 * /school/programs/123 without a 404.
 *
 * In production, the React build output (../dist/) is the Astro
 * publicDir, so index.html and all assets are served as static files.
 * This catch-all only handles paths that don't match a static file or
 * an /api/* endpoint.
 */
import type { APIRoute } from 'astro';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Resolve the React build output. The Astro server runs from
// apps/server/dist/server/ in production, so the React build at the
// repo root /dist is 4 levels up. We also check a few candidate
// locations for robustness.
function findReactBuild(): string | null {
  const candidates = [
    // Production: server runs from apps/server/dist/server/
    resolve(process.cwd(), '..', '..', '..', 'dist'),
    // Dev: server runs from apps/server/
    resolve(process.cwd(), '..', 'dist'),
    // Fallback: repo root
    resolve(process.cwd(), 'dist'),
  ];
  for (const dir of candidates) {
    const idx = resolve(dir, 'index.html');
    if (existsSync(idx)) return idx;
  }
  return null;
}

const indexHtmlPath = findReactBuild();

export const ALL: APIRoute = async ({ request }) => {
  // Skip API routes (handled by /api/* endpoints)
  if (new URL(request.url).pathname.startsWith('/api/')) {
    return new Response('Not found', { status: 404 });
  }

  // Serve index.html for all other routes (SPA fallback)
  try {
    if (!indexHtmlPath) {
      return new Response(
        'Frontend build not found. Run "npm run build:all" first.',
        { status: 500, headers: { 'Content-Type': 'text/plain' } }
      );
    }
    const html = readFileSync(indexHtmlPath, 'utf8');
    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (err: any) {
    console.error('[SPA fallback] error:', err);
    return new Response('Internal server error', { status: 500 });
  }
};
