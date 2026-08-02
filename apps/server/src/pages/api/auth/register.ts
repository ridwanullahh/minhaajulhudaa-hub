/**
 * POST /api/auth/register
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Server-side user registration. Hashes the password with scrypt
 * (never sent to the client), checks for duplicate email+platform,
 * creates the user, and returns a session token.
 *
 * Request body: { email, password, name, platform, role? }
 * Response: { user: {...without password}, token, expiresAt }
 */
import type { APIRoute } from 'astro';
import { listDocs, insertDoc } from '@/lib/lightbase';
import { createSessionToken, hashPassword } from '@/lib/auth-server';

export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const { email, password, name, platform, role = 'user' } = body || {};

  // Validate input
  if (!email || !password || !name || !platform) {
    return new Response(JSON.stringify({ error: 'email, password, name, and platform are required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }
  if (password.length < 8) {
    return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email format' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Check for duplicate
    const existing = await listDocs('users', {
      limit: 1,
      filter: { field: 'email', op: 'eq', value: String(email).toLowerCase() },
    });
    const dup = existing.find((u) => u.platform === platform);
    if (dup) {
      return new Response(JSON.stringify({ error: 'User already exists with this email on this platform' }), {
        status: 409, headers: { 'Content-Type': 'application/json' },
      });
    }

    // Hash password server-side with scrypt
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await insertDoc('users', {
      email: String(email).toLowerCase(),
      password: hashedPassword,
      name,
      platform,
      role,
      roles: [role],
      permissions: [],
      verified: true, // Auto-verify when email verification is disabled
      createdAt: new Date().toISOString(),
    });

    // Issue session token
    const token = await createSessionToken({
      uid: newUser.id,
      email: newUser.email,
      platform: newUser.platform,
      role: newUser.role,
    });

    const { password: _pw, _checksum, _deleted, _revision, ...safeUser } = newUser;

    return new Response(JSON.stringify({
      user: { ...safeUser, uid: newUser.id },
      token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }), {
      status: 201, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[auth/register] error:', err);
    return new Response(JSON.stringify({ error: 'Registration failed. Please try again.' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};
