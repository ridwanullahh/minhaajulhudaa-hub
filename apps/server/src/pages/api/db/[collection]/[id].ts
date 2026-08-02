/**
 * /api/db/:collection/:id
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Single-document operations on a collection.
 *
 *   GET    /api/db/:collection/:id   -> get single doc
 *   PATCH  /api/db/:collection/:id   -> update doc
 *   DELETE /api/db/:collection/:id   -> delete doc
 *
 * Auth model:
 *   - GET single: open for PUBLIC_COLLECTIONS, require Bearer token
 *     for everything else.
 *   - PATCH / DELETE: always require Bearer token.
 */
import type { APIRoute } from 'astro';
import { getDoc, updateDoc, deleteDoc } from '../../../../lib/lightbase';
import { verifySessionToken, getBearerToken } from '../../../../lib/auth-server';

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

export const GET: APIRoute = async ({ params, request }) => {
  const collection = params.collection as string;
  const id = params.id as string;
  if (!collection || !id) return badRequest('Collection name and id required');

  if (!PUBLIC_COLLECTIONS.has(collection)) {
    const session = await requireAuth(request);
    if (!session) return unauthorized();
  }

  try {
    const doc = await getDoc(collection, id);
    if (!doc) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404, headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ document: doc }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[db GET single] error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch document' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const collection = params.collection as string;
  const id = params.id as string;
  if (!collection || !id) return badRequest('Collection name and id required');

  const session = await requireAuth(request);
  if (!session) return unauthorized();

  let body: any;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  try {
    const doc = await updateDoc(collection, id, body);
    return new Response(JSON.stringify({ document: doc }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[db PATCH] error:', err);
    return new Response(JSON.stringify({ error: 'Failed to update document' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  const collection = params.collection as string;
  const id = params.id as string;
  if (!collection || !id) return badRequest('Collection name and id required');

  const session = await requireAuth(request);
  if (!session) return unauthorized();

  try {
    await deleteDoc(collection, id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[db DELETE] error:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete document' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};
