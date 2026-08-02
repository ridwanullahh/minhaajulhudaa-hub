/**
 * POST /api/auth/login
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Server-side login. Looks up the user in Lightbase, verifies the
 * password, and returns a session token (HMAC-SHA256 signed JWT).
 *
 * Supports three password hash formats:
 *   1. scrypt$ (current, server-side) - verified with scrypt
 *   2. $2 (bcrypt, legacy server-side) - verified with bcrypt
 *   3. Legacy SHA-256 (client-side) - recompute and compare, then
 *      upgrade to scrypt on next successful login
 *
 * Request body: { email, password, platform }
 * Response: { user: {...without password}, token, expiresAt }
 */
import type { APIRoute } from 'astro';
import { listDocs, updateDoc } from '@/lib/lightbase';
import { createSessionToken, verifyPassword, hashPassword } from '@/lib/auth-server';

export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const { email, password, platform } = body || {};
  if (!email || !password || !platform) {
    return new Response(
      JSON.stringify({ error: 'email, password, and platform are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Rate limit: max 5 failed attempts per email per 5 minutes
  const rateKey = `login:${String(email).toLowerCase()}`;
  const rateState = loginRateMap.get(rateKey) || { count: 0, windowStart: Date.now() };
  if (Date.now() - rateState.windowStart > 5 * 60 * 1000) {
    rateState.count = 0;
    rateState.windowStart = Date.now();
  }
  if (rateState.count >= 5) {
    return new Response(
      JSON.stringify({ error: 'Too many login attempts. Please try again in a few minutes.' }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '300' } }
    );
  }

  try {
    // Fetch all users and filter in-memory (Lightbase filter syntax can
    // be finicky; this is more reliable for auth where correctness is
    // critical). At current scale (<1000 users) this is fine.
    const allUsers = await listDocs('users', { limit: 1000 });
    const emailLower = String(email).toLowerCase();
    const user = allUsers.find(
      (u) => String(u.email || '').toLowerCase() === emailLower && u.platform === platform
    );

    if (!user) {
      rateState.count += 1;
      loginRateMap.set(rateKey, rateState);
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401, headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify password based on hash format
    const storedHash = String(user.password || '');
    let valid = false;

    if (storedHash.startsWith('scrypt$')) {
      // Current server-side scrypt hash
      valid = await verifyPassword(password, storedHash);
    } else if (storedHash.startsWith('$2')) {
      // Legacy bcrypt hash
      valid = await verifyPassword(password, storedHash);
    } else {
      // Legacy SHA-256 (client-side): recompute and compare
      const encoder = new TextEncoder();
      const secret = process.env.VITE_JWT_SECRET || process.env.SESSION_SECRET || 'default-secret-change-in-production';
      const data = encoder.encode(password + secret);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const legacyHash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      valid = legacyHash === storedHash;

      // Upgrade to scrypt on successful login
      if (valid) {
        try {
          const newHash = await hashPassword(password);
          await updateDoc('users', user.id, { password: newHash });
        } catch (upgradeErr) {
          // Non-fatal: log but don't block login
          console.warn('[auth/login] failed to upgrade hash:', upgradeErr);
        }
      }
    }

    if (!valid) {
      rateState.count += 1;
      loginRateMap.set(rateKey, rateState);
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401, headers: { 'Content-Type': 'application/json' },
      });
    }

    // Clear rate limit on success
    loginRateMap.delete(rateKey);

    const token = await createSessionToken({
      uid: user.id,
      email: user.email,
      platform: user.platform,
      role: user.role,
    });

    const { password: _pw, _checksum, _deleted, _revision, ...safeUser } = user;
    return new Response(
      JSON.stringify({
        user: { ...safeUser, uid: user.id },
        token,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[auth/login] error:', err);
    return new Response(
      JSON.stringify({ error: 'Login failed. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// In-memory rate limit map (per server instance)
const loginRateMap = new Map<string, { count: number; windowStart: number }>();
