/**
 * /api/db/:collection
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Generic DB proxy (collection-level). The React app calls this
 * instead of calling Lightbase directly, so the API key never reaches
 * the browser.
 *
 *   GET    /api/db/:collection?limit=100&filter=...   -> list docs
 *   POST   /api/db/:collection                        -> insert doc
 *
 * Single-doc operations (GET/PATCH/DELETE /api/db/:collection/:id)
 * are handled by [id].ts in this same directory.
 *
 * Auth model:
 *   - Reads (GET list): open for PUBLIC_COLLECTIONS, require Bearer
 *     token for everything else.
 *   - Writes (POST): always require Bearer token.
 */
import type { APIRoute } from 'astro';
import { listDocs, insertDoc } from '../../../lib/lightbase';
import { verifySessionToken, getBearerToken } from '../../../lib/auth-server';

const PUBLIC_COLLECTIONS = new Set([
  'school_blog_posts', 'school_events', 'school_programs', 'school_courses', 'school_classes', 'school_library', 'school_shop_products', 'school_announcements',
  'masjid_blog_posts', 'masjid_events', 'masjid_prayer_times', 'masjid_audio_library', 'masjid_quran_recitations', 'masjid_announcements', 'masjid_programs', 'masjid_islamic_calendar',
  'charity_blog_posts', 'charity_events', 'charity_campaigns', 'charity_projects', 'charity_testimonials', 'charity_impact_reports',
  'travels_blog_posts', 'travels_events', 'travels_packages', 'travels_reviews', 'travels_itineraries',
]);

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'Authentication required' }), {
    status: 401, headers: { 'Content-Type': 'application/json' },
  });
}

function badRequest(msg: string): Response {
  return new Response(JSON.stringify({ error: msg }), {
    status: 400, headers: { 'Content-Type': 'application/json' },
  });
}

async function requireAuth(request: Request) {
  const token = getBearerToken(request);
  return token ? await verifySessionToken(token) : null;
}

export const GET: APIRoute = async ({ params, url, request }) => {
  const collection = params.collection as string;
  if (!collection) return badRequest('Collection name required');

  if (!PUBLIC_COLLECTIONS.has(collection)) {
    const session = await requireAuth(request);
    if (!session) return unauthorized();
  }

  const limit = parseInt(url.searchParams.get('limit') || '100', 10);
  const filterParam = url.searchParams.get('filter');
  let filter: any = undefined;
  if (filterParam) {
    try { filter = JSON.parse(filterParam); } catch { /* ignore */ }
  }
  const sort = url.searchParams.get('sort') || undefined;

  try {
    const docs = await listDocs(collection, { limit, filter, sort });
    return new Response(JSON.stringify({ data: docs, count: docs.length }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[db GET list] error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ params, request }) => {
  const collection = params.collection as string;
  if (!collection) return badRequest('Collection name required');

  const session = await requireAuth(request);
  if (!session) return unauthorized();

  let body: any;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  try {
    const doc = await insertDoc(collection, body);
    return new Response(JSON.stringify({ document: doc }), {
      status: 201, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[db POST] error:', err);
    return new Response(JSON.stringify({ error: 'Failed to create document' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};
