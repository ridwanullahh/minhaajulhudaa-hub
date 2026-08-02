/**
 * GET /api/auth/me
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Returns the currently authenticated user based on the Bearer token.
 * Used by the client to restore session on page load without needing
 * to fetch the entire users collection.
 *
 * Request: Authorization: Bearer <token>
 * Response: { user: {...without password} } or 401
 */
import type { APIRoute } from 'astro';
import { getDoc } from '@/lib/lightbase';
import { verifySessionToken, getBearerToken } from '@/lib/auth-server';

export const GET: APIRoute = async ({ request }) => {
  const token = getBearerToken(request);
  if (!token) {
    return new Response(JSON.stringify({ error: 'No token provided' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const user = await getDoc('users', session.uid);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404, headers: { 'Content-Type': 'application/json' },
      });
    }

    const { password: _pw, _checksum, _deleted, _revision, ...safeUser } = user;
    return new Response(JSON.stringify({
      user: { ...safeUser, uid: user.id },
    }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[auth/me] error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch user' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};
