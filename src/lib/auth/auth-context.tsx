import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import config from '../config';

/**
 * Auth Context (API-backed)
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * All authentication operations now go through the Astro backend:
 *   - login: POST /api/auth/login (server-side password verification)
 *   - register: POST /api/auth/register (server-side password hashing)
 *   - me: GET /api/auth/me (session restoration)
 *
 * The client NEVER hashes passwords, NEVER reads the users collection
 * directly for auth, and NEVER has access to password hashes. The
 * Lightbase API key stays server-side.
 *
 * Session token is stored in localStorage as a Bearer token and sent
 * on every API request via the ApiProxySDK's Authorization header.
 */

interface User {
  id: string;
  uid: string;
  email: string;
  name?: string;
  platform: string;
  role: string;
  roles?: string[];
  permissions?: string[];
  verified: boolean;
  createdAt: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, platform: string) => Promise<User>;
  register: (email: string, password: string, name: string, platform: string, role?: string) => Promise<User>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  updateProfile: (updates: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'minhaajulhudaa_session';
const SESSION_EXPIRY = config.auth.sessionExpiry * 1000;

// --- Client-side rate limiting for auth attempts ---------------------------
const RATE_LIMIT_KEY = 'minhaajulhudaa_auth_attempts';
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

interface RateLimitState {
  attempts: number;
  windowStart: number;
}

const getRateLimitState = (): RateLimitState => {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { attempts: 0, windowStart: Date.now() };
    return JSON.parse(raw);
  } catch {
    return { attempts: 0, windowStart: Date.now() };
  }
};

const recordAuthAttempt = (): void => {
  const state = getRateLimitState();
  const now = Date.now();
  if (now - state.windowStart > RATE_LIMIT_WINDOW_MS) {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ attempts: 1, windowStart: now }));
    return;
  }
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ attempts: state.attempts + 1, windowStart: state.windowStart }));
};

const clearAuthAttempts = (): void => {
  localStorage.removeItem(RATE_LIMIT_KEY);
};

const isRateLimited = (): boolean => {
  const state = getRateLimitState();
  const now = Date.now();
  if (now - state.windowStart > RATE_LIMIT_WINDOW_MS) return false;
  return state.attempts >= RATE_LIMIT_MAX_ATTEMPTS;
};

// --- API helpers -----------------------------------------------------------

function getApiBaseUrl(): string {
  // Use the configured API URL, or default to same-origin /api
  const url = config.app.apiUrl || '';
  // Strip trailing /api so we can append our own paths
  return url.replace(/\/api\/?$/, '');
}

async function apiCall(path: string, options: RequestInit = {}): Promise<any> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* keep text */ }
  if (!res.ok) {
    const msg = json?.error || text || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session.expiresAt > Date.now()) {
      return session.token || null;
    }
    localStorage.removeItem(SESSION_KEY);
    return null;
  } catch {
    return null;
  }
}

function storeSession(token: string): void {
  const session = {
    token,
    expiresAt: Date.now() + SESSION_EXPIRY,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiCall('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.user);
      } catch {
        // Token invalid or expired
        localStorage.removeItem(SESSION_KEY);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string, platform: string): Promise<User> => {
    if (isRateLimited()) {
      throw new Error('Too many login attempts. Please try again in a few minutes.');
    }
    recordAuthAttempt();

    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, platform }),
    });

    clearAuthAttempts();
    storeSession(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    platform: string,
    role: string = 'user'
  ): Promise<User> => {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, platform, role }),
    });

    storeSession(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin' || user.roles?.includes('admin')) return true;
    return user.permissions?.includes(permission) || false;
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role || user.roles?.includes(role) || false;
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    if (!user) {
      throw new Error('No user logged in');
    }
    // Strip fields that should never be updated via this method
    const { password, email, uid, id, ...allowedUpdates } = updates;

    const token = getStoredToken();
    const data = await apiCall(`/db/users/${user.uid}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(allowedUpdates),
    });

    const updatedUser = data.document || data;
    setUser({ ...user, ...updatedUser });
    return { ...user, ...updatedUser };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        hasPermission,
        hasRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { User, AuthContextType };
