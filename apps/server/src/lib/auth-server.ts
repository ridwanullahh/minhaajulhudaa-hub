/**
 * Server-side auth utilities
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Session token creation/verification using HMAC-SHA256 (Node's
 * built-in crypto). No external JWT library required.
 *
 * Password hashing uses scrypt (Node built-in) with a per-user salt.
 */

const SESSION_SECRET = process.env.SESSION_SECRET || process.env.VITE_JWT_SECRET || 'default-secret-change-in-production';
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface SessionPayload {
  uid: string;
  email: string;
  platform: string;
  role: string;
}

async function hmacSign(data: string): Promise<string> {
  const { createHmac } = await import('node:crypto');
  return createHmac('sha256', SESSION_SECRET).update(data).digest('hex');
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const body = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const data = Buffer.from(JSON.stringify(body)).toString('base64url');
  const sig = await hmacSign(data);
  return `${data}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expectedSig = await hmacSign(data);
  if (sig !== expectedSig) return null;
  try {
    const body = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (body.exp && body.exp < Math.floor(Date.now() / 1000)) return null;
    return { uid: body.uid, email: body.email, platform: body.platform, role: body.role };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const { scryptSync, randomBytes } = await import('node:crypto');
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (stored.startsWith('scrypt$')) {
    const [, salt, hash] = stored.split('$');
    const { scryptSync } = await import('node:crypto');
    const test = scryptSync(password, salt, 64).toString('hex');
    return test === hash;
  }
  return false;
}

export function getBearerToken(request: Request): string | null {
  const auth = request.headers.get('Authorization') || request.headers.get('authorization');
  if (!auth) return null;
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}
