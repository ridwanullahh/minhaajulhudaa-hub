/**
 * /api/db/:collection
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Generic DB proxy. The React app calls this instead of calling
 * Lightbase directly, so the API key never reaches the browser.
 *
 * GET  /api/db/:collection?limit=100&filter=...   -> list docs
 * POST /api/db/:collection                         -> insert doc
 *
 * All writes require a valid session token (Authorization: Bearer).
 * Reads are open for public collections (blog_posts, events,
 * campaigns, packages, prayer_times, audio_library) and require
 * auth for everything else.
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

export const GET: APIRoute = async ({ params, url, request }) => {
  const collection = params.collection as string;
  if (!collection) {
    return new Response(JSON.stringify({ error: 'Collection name required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // Auth check for non-public collections
  if (!PUBLIC_COLLECTIONS.has(collection)) {
    const token = getBearerToken(request);
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
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
    return new Response(JSON.stringify({ data: docs, count: docs.length }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error('[db GET] error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const POST: APIRoute = async ({ params, request }) => {
  const collection = params.collection as string;
  if (!collection) {
    return new Response(JSON.stringify({ error: 'Collection name required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // All writes require auth
  const token = getBearerToken(request);
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const doc = await insertDoc(collection, body);
    return new Response(JSON.stringify({ document: doc }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error('[db POST] error:', err);
    return new Response(JSON.stringify({ error: 'Failed to create document' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
