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
import { listDocs, insertDoc } from '@/lib/lightbase';
import { verifySessionToken, getBearerToken } from '@/lib/auth-server';

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

  // Pagination: fetch limit+1 docs to determine hasMore. The `after`
  // param is a document id; we fetch docs with id > after (ULID
  // time-sortable, so this gives chronological ordering).
  const requestedLimit = parseInt(url.searchParams.get('limit') || '100', 10);
  const limit = Math.min(Math.max(requestedLimit, 1), 1000); // clamp 1-1000
  const after = url.searchParams.get('after') || undefined;
  const filterParam = url.searchParams.get('filter');
  let filter: any = undefined;
  if (filterParam) {
    try { filter = JSON.parse(filterParam); } catch { /* ignore */ }
  }
  const sort = url.searchParams.get('sort') || undefined;
  const countOnly = url.searchParams.get('count') === 'true';

  try {
    // If only count is requested, fetch all and count (Lightbase
    // doesn't have a dedicated count endpoint in the current API)
    if (countOnly) {
      const allDocs = await listDocs(collection, { limit: 1000, filter });
      return new Response(JSON.stringify({ count: allDocs.length }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch limit+1 to check if there are more docs
    const fetchLimit = after ? limit + 1 : limit + 1;
    const docs = await listDocs(collection, { limit: fetchLimit, filter, sort });

    // If `after` is provided, filter out docs up to and including `after`
    let result = docs;
    if (after) {
      const afterIdx = docs.findIndex((d) => d.id === after);
      if (afterIdx >= 0) {
        result = docs.slice(afterIdx + 1);
      } else {
        // after not found in results, start from beginning
        result = docs;
      }
    }

    // Check if there are more docs
    const hasMore = result.length > limit;
    if (hasMore) {
      result = result.slice(0, limit);
    }

    // The cursor for the next page is the last doc's id
    const nextCursor = hasMore && result.length > 0 ? result[result.length - 1].id : null;

    return new Response(JSON.stringify({
      data: result,
      count: result.length,
      hasMore,
      nextCursor,
    }), {
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
