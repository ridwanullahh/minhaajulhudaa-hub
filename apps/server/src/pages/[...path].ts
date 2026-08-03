/**
 * SPA fallback route
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Serves the React app's static assets (JS, CSS, images) and
 * index.html for all non-API routes so that client-side routing
 * (React Router) works on deep links like /school/programs/123
 * without a 404.
 *
 * For static asset requests (/assets/*.js, /assets/*.css, etc.) the
 * file is read from the React build output and served with the
 * correct Content-Type. For all other non-API routes, index.html is
 * served (SPA fallback).
 *
 * This route is needed because Astro's publicDir static serving does
 * not reliably serve files when a catch-all [...path] route exists;
 * the catch-all intercepts the request before the static middleware.
 */
import type { APIRoute } from 'astro';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';

// Resolve the React build output directory. The Astro server runs
// from apps/server/dist/server/ in production, so the React build at
// the repo root /dist is several levels up. We check multiple
// candidate locations for robustness across dev and prod.
function findReactBuildDir(): string | null {
  const candidates = [
    // Production: server runs from apps/server/dist/server/
    resolve(process.cwd(), '..', '..', '..', 'dist'),
    // Dev: server runs from apps/server/
    resolve(process.cwd(), '..', 'dist'),
    // Fallback: repo root
    resolve(process.cwd(), 'dist'),
  ];
  for (const dir of candidates) {
    if (existsSync(resolve(dir, 'index.html'))) return dir;
  }
  return null;
}

const buildDir = findReactBuildDir();

// MIME type map for common static asset extensions.
const MIME_TYPES: Record<string, string> = {
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

export const ALL: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip API routes (handled by /api/* endpoints)
  if (pathname.startsWith('/api/')) {
    return new Response('Not found', { status: 404 });
  }

  if (!buildDir) {
    return new Response(
      'Frontend build not found. Run "npm run build:all" first.',
      { status: 500, headers: { 'Content-Type': 'text/plain' } }
    );
  }

  // Try to serve the requested path as a static file from the build dir.
  // This handles /assets/*.js, /assets/*.css, /vite.svg, /favicon.ico, etc.
  // Normalize the path: strip leading slash, prevent directory traversal.
  const relativePath = pathname.replace(/^\//, '');
  if (relativePath) {
    // Prevent directory traversal attacks
    const safePath = relativePath.replace(/\.\./g, '');
    const filePath = resolve(buildDir, safePath);

    // Ensure the resolved path is still within the build dir
    if (filePath.startsWith(buildDir) && existsSync(filePath) && !filePath.endsWith('.html')) {
      const ext = extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      try {
        const fileContent = readFileSync(filePath);
        return new Response(fileContent, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      } catch {
        // Fall through to SPA fallback
      }
    }
  }

  // SPA fallback: serve index.html for all non-static, non-API routes.
  // This allows React Router to handle deep links like /school/programs/123.
  try {
    const html = readFileSync(resolve(buildDir, 'index.html'), 'utf8');
    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch {
    return new Response('Internal server error', { status: 500 });
  }
};
