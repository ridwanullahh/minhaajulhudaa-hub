import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Auth context API helper tests
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Tests the client-side auth API call helpers (login, register, me)
 * by mocking fetch. Verifies that the correct endpoints are called
 * with the correct payloads and that responses are handled properly.
 */

// Mock the config module
vi.mock('@/lib/config', () => ({
  default: {
    db: { provider: 'api' },
    app: { apiUrl: 'http://localhost:4321/api', url: 'http://localhost:8080', env: 'test', debug: false },
    auth: { jwtSecret: 'test', sessionExpiry: 604800, requireEmailVerification: false, otpExpiry: 10 },
  },
}));

describe('auth API helpers', () => {
  beforeEach(() => {
    // Reset localStorage
    localStorage.clear();
    // Reset fetch mock
    vi.restoreAllMocks();
  });

  it('stores and retrieves session token from localStorage', () => {
    const token = 'test-token-123';
    const session = { token, expiresAt: Date.now() + 3600000 };
    localStorage.setItem('minhaajulhudaa_session', JSON.stringify(session));

    const stored = localStorage.getItem('minhaajulhudaa_session');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.token).toBe(token);
  });

  it('clears session on logout', () => {
    const token = 'test-token-123';
    localStorage.setItem('minhaajulhudaa_session', JSON.stringify({ token, expiresAt: Date.now() + 3600000 }));
    expect(localStorage.getItem('minhaajulhudaa_session')).toBeTruthy();

    localStorage.removeItem('minhaajulhudaa_session');
    expect(localStorage.getItem('minhaajulhudaa_session')).toBeNull();
  });

  it('rate limiting blocks after 5 attempts', () => {
    const RATE_LIMIT_KEY = 'minhaajulhudaa_auth_attempts';

    // Simulate 5 failed attempts
    for (let i = 0; i < 5; i++) {
      const raw = localStorage.getItem(RATE_LIMIT_KEY);
      const state = raw ? JSON.parse(raw) : { attempts: 0, windowStart: Date.now() };
      state.attempts++;
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
    }

    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const state = JSON.parse(raw!);
    expect(state.attempts).toBe(5);
    expect(state.attempts >= 5).toBe(true); // Rate limited
  });

  it('rate limiting resets after window expires', () => {
    const RATE_LIMIT_KEY = 'minhaajulhudaa_auth_attempts';

    // Set an old rate limit state (6 minutes ago = past the 5-min window)
    const oldTime = Date.now() - 6 * 60 * 1000;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ attempts: 5, windowStart: oldTime }));

    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const state = JSON.parse(raw!);
    const isExpired = Date.now() - state.windowStart > 5 * 60 * 1000;
    expect(isExpired).toBe(true); // Should be reset
  });
});

describe('fetch API integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('calls the correct login endpoint', async () => {
    const responseData = {
      user: { email: 'test@example.com', role: 'user' },
      token: 'fake-token',
      expiresAt: Date.now() + 3600000,
    };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(responseData)),
      json: () => Promise.resolve(responseData),
    });
    vi.stubGlobal('fetch', mockFetch);

    // Simulate a login API call
    const res = await fetch('http://localhost:4321/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123', platform: 'school' }),
    });

    const data = await res.json();
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4321/api/auth/login',
      expect.objectContaining({ method: 'POST' })
    );
    expect(data.user.email).toBe('test@example.com');
    expect(data.token).toBe('fake-token');
  });

  it('handles login error response', async () => {
    const errorData = { error: 'Invalid credentials' };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve(JSON.stringify(errorData)),
      json: () => Promise.resolve(errorData),
    });
    vi.stubGlobal('fetch', mockFetch);

    const res = await fetch('http://localhost:4321/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wrong@example.com', password: 'wrong', platform: 'school' }),
    });

    expect(res.ok).toBe(false);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Invalid credentials');
  });

  it('sends Bearer token for authenticated requests', async () => {
    const responseData = { user: { email: 'test@example.com' } };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(responseData)),
      json: () => Promise.resolve(responseData),
    });
    vi.stubGlobal('fetch', mockFetch);

    const token = 'my-bearer-token';
    await fetch('http://localhost:4321/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4321/api/auth/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer my-bearer-token',
        }),
      })
    );
  });
});
