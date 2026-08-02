/**
 * API Proxy SDK (client-side)
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Client-side DB interface that talks to the Astro backend
 * (`/api/db/:collection`, `/api/auth/login`, etc.) instead of calling
 * Lightbase directly. This keeps the Lightbase API key server-side:
 * the key NEVER appears in the client bundle.
 *
 * Implements the SAME interface as LightbaseSDK / UniversalSDK so
 * `db.ts`, `platform-db.ts`, and every service / admin page work
 * unchanged:
 *   - get(collection)
 *   - getItem(collection, id)
 *   - insert(collection, doc)
 *   - update(collection, id, patch)
 *   - delete(collection, id)
 *   - find(collection, query)
 *   - subscribe(collection, cb)
 *   - queryBuilder(collection)
 *
 * And the platform-scoped equivalents:
 *   - getPlatform / insertPlatform / updatePlatform / deletePlatform /
 *     findPlatform / subscribePlatform
 *
 * Auth: reads the session token from localStorage (set by auth-context
 * on successful login) and sends it as `Authorization: Bearer <token>`
 * on every request. The Astro backend verifies the token and rejects
 * unauthenticated calls to non-public collections with 401.
 */

import config from './config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiProxyDoc {
  id: string;
  uid: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface ApiProxyConfig {
  baseUrl: string;
  getToken?: () => string | null;
}

// ---------------------------------------------------------------------------
// Session token storage (shared with auth-context)
// ---------------------------------------------------------------------------

const SESSION_KEY = 'minhaajulhudaa_session';

function readSessionToken(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session.expiresAt && session.expiresAt > Date.now()) {
      return session.token || null;
    }
    return null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// ApiProxySDK
// ---------------------------------------------------------------------------

export class ApiProxySDK {
  private baseUrl: string;
  private cache: Map<string, any[]> = new Map();
  private subscribers: Map<string, Set<(data: any[]) => void>> = new Map();

  constructor(cfg?: Partial<ApiProxyConfig>) {
    // Default to the configured VITE_API_URL, stripping any trailing
    // /api so we can append our own paths consistently.
    const fromEnv = cfg?.baseUrl || config.app.apiUrl || '';
    this.baseUrl = (fromEnv.replace(/\/+$/, '')).replace(/\/api$/, '');
  }

  private get headers(): Record<string, string> {
    const h: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = readSessionToken();
    if (token) {
      h['Authorization'] = `Bearer ${token}`;
    }
    return h;
  }

  private dbUrl(collection: string): string {
    return `${this.baseUrl}/api/db/${encodeURIComponent(collection)}`;
  }

  // -------------------------------------------------------------------------
  // UniversalSDK-compatible surface (global collections)
  // -------------------------------------------------------------------------

  async init(): Promise<this> {
    return this;
  }

  async get<T = any>(collection: string): Promise<T[]> {
    try {
      const res = await fetch(`${this.dbUrl(collection)}?limit=1000`, {
        method: 'GET',
        headers: this.headers,
      });
      if (!res.ok) {
        if (res.status === 401) {
          // Auth required for this collection and user not logged in -
          // return empty rather than throwing so public pages don't crash.
          return [];
        }
        const text = await res.text().catch(() => '');
        throw new Error(`ApiProxy get(${collection}) failed: ${res.status} ${text}`);
      }
      const json = await res.json();
      const data = (json.data || []).map((d: any) => this.normalize<T>(d));
      this.cache.set(collection, data);
      return data;
    } catch (err) {
      console.error(`[ApiProxySDK] get(${collection}) error:`, err);
      return this.cache.get(collection) || [];
    }
  }

  async getItem<T = any>(collection: string, id: string): Promise<T | null> {
    try {
      const res = await fetch(`${this.dbUrl(collection)}/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: this.headers,
      });
      if (res.status === 404) return null;
      if (res.status === 401) return null;
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`ApiProxy getItem(${collection},${id}) failed: ${res.status} ${text}`);
      }
      const json = await res.json();
      return this.normalize<T>(json.document || json);
    } catch (err) {
      console.error(`[ApiProxySDK] getItem(${collection},${id}) error:`, err);
      return null;
    }
  }

  async insert<T = any>(collection: string, item: Partial<T>): Promise<T & ApiProxyDoc> {
    const res = await fetch(this.dbUrl(collection), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(this.sanitize(item)),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`ApiProxy insert(${collection}) failed: ${res.status} ${text}`);
    }
    const json = await res.json();
    const doc = this.normalize<T>(json.document);
    const cached = this.cache.get(collection) || [];
    this.cache.set(collection, [...cached, doc]);
    this.notifySubscribers(collection);
    return doc;
  }

  async update<T = any>(collection: string, id: string, updates: Partial<T>): Promise<T & ApiProxyDoc> {
    // The Astro backend exposes POST (insert) and GET (list) on
    // /api/db/:collection. For updates we use the same collection
    // endpoint with PATCH (the backend's [collection].ts handles GET
    // and POST; we extend it with PATCH/DELETE in apps/server).
    const res = await fetch(`${this.dbUrl(collection)}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(this.sanitize(updates)),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`ApiProxy update(${collection},${id}) failed: ${res.status} ${text}`);
    }
    const json = await res.json();
    const doc = this.normalize<T>(json.document || json);
    const cached = this.cache.get(collection) || [];
    const idx = cached.findIndex((d) => d.id === id || d.uid === id);
    if (idx >= 0) {
      cached[idx] = doc;
      this.cache.set(collection, [...cached]);
    }
    this.notifySubscribers(collection);
    return doc;
  }

  async delete<T = any>(collection: string, id: string): Promise<void> {
    const res = await fetch(`${this.dbUrl(collection)}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: this.headers,
    });
    if (!res.ok && res.status !== 404) {
      const text = await res.text().catch(() => '');
      throw new Error(`ApiProxy delete(${collection},${id}) failed: ${res.status} ${text}`);
    }
    const cached = this.cache.get(collection) || [];
    this.cache.set(collection, cached.filter((d) => d.id !== id && d.uid !== id));
    this.notifySubscribers(collection);
  }

  async find<T = any>(collection: string, query: Partial<T>): Promise<T[]> {
    const all = await this.get<T>(collection);
    return all.filter((item: any) =>
      Object.entries(query).every(([key, value]) => item[key] === value)
    );
  }

  subscribe<T = any>(collection: string, callback: (data: T[]) => void): () => void {
    if (!this.subscribers.has(collection)) {
      this.subscribers.set(collection, new Set());
    }
    this.subscribers.get(collection)!.add(callback);
    this.get<T>(collection).then(callback).catch(() => {});
    return () => {
      this.subscribers.get(collection)?.delete(callback);
    };
  }

  unsubscribe(collection: string, callback: Function): void {
    this.subscribers.get(collection)?.delete(callback as any);
  }

  queryBuilder<T = any>(collection: string): ApiProxyQueryBuilder<T> {
    return new ApiProxyQueryBuilder<T>(this, collection);
  }

  // -------------------------------------------------------------------------
  // Platform-scoped surface (RealTimeGitHubDB-compatible)
  // -------------------------------------------------------------------------

  private platformCollection(platform: string, collection: string): string {
    return `${platform}_${collection}`;
  }

  async getPlatform<T = any>(platform: string, collection: string): Promise<T[]> {
    return this.get<T>(this.platformCollection(platform, collection));
  }

  async insertPlatform<T = any>(
    platform: string,
    collection: string,
    item: Partial<T>
  ): Promise<T & ApiProxyDoc> {
    return this.insert<T>(this.platformCollection(platform, collection), {
      ...item,
      platform,
    });
  }

  async updatePlatform<T = any>(
    platform: string,
    collection: string,
    id: string,
    updates: Partial<T>
  ): Promise<T & ApiProxyDoc> {
    return this.update<T>(this.platformCollection(platform, collection), id, updates);
  }

  async deletePlatform(platform: string, collection: string, id: string): Promise<boolean> {
    await this.delete(this.platformCollection(platform, collection), id);
    return true;
  }

  async findPlatform<T = any>(
    platform: string,
    collection: string,
    query: Partial<T>
  ): Promise<T[]> {
    return this.find<T>(this.platformCollection(platform, collection), query);
  }

  subscribePlatform<T = any>(
    platform: string,
    collection: string,
    callback: (data: T[]) => void
  ): () => void {
    return this.subscribe<T>(this.platformCollection(platform, collection), callback);
  }

  async initializePlatform(platform: string): Promise<void> {
    // No-op: the Astro backend creates collections lazily on first
    // write (Lightbase ensureCollection is called server-side).
  }

  async initializeAllPlatforms(): Promise<void> {
    // No-op for the proxy path.
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  private normalize<T = any>(raw: any): ApiProxyDoc & T {
    if (!raw || typeof raw !== 'object') return raw;
    const {
      id,
      _created_at,
      _updated_at,
      _revision,
      _deleted,
      _checksum,
      ...rest
    } = raw;
    return {
      ...rest,
      id: id || rest.id,
      uid: rest.uid || id,
      createdAt: rest.createdAt || _created_at || new Date().toISOString(),
      updatedAt: rest.updatedAt || _updated_at || _created_at || new Date().toISOString(),
    } as ApiProxyDoc & T;
  }

  private sanitize(payload: any): any {
    if (!payload || typeof payload !== 'object') return payload;
    const {
      id,
      uid,
      createdAt,
      updatedAt,
      _created_at,
      _updated_at,
      _revision,
      _deleted,
      _checksum,
      ...rest
    } = payload;
    return rest;
  }

  private notifySubscribers(collection: string): void {
    const subs = this.subscribers.get(collection);
    if (!subs || subs.size === 0) return;
    const data = this.cache.get(collection) || [];
    subs.forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        console.warn(`[ApiProxySDK] subscriber callback error for ${collection}:`, err);
      }
    });
  }
}

// ---------------------------------------------------------------------------
// QueryBuilder (matches UniversalSDK / LightbaseSDK shape)
// ---------------------------------------------------------------------------

class ApiProxyQueryBuilder<T = any> {
  private sdk: ApiProxySDK;
  private collection: string;
  private filters: ((item: any) => boolean)[] = [];
  private sortField?: string;
  private sortDir: 'asc' | 'desc' = 'asc';
  private projectedFields?: string[];

  constructor(sdk: ApiProxySDK, collection: string) {
    this.sdk = sdk;
    this.collection = collection;
  }

  where(fn: (item: T) => boolean): this {
    this.filters.push(fn as (item: any) => boolean);
    return this;
  }

  sort(field: string, dir: 'asc' | 'desc' = 'asc'): this {
    this.sortField = field;
    this.sortDir = dir;
    return this;
  }

  project(fields: string[]): this {
    this.projectedFields = fields;
    return this;
  }

  async exec(): Promise<T[]> {
    let data = await this.sdk.get<T>(this.collection);
    for (const f of this.filters) {
      data = data.filter(f);
    }
    if (this.sortField) {
      data = [...data].sort((a: any, b: any) => {
        const av = a[this.sortField!];
        const bv = b[this.sortField!];
        if (av === bv) return 0;
        const cmp = av > bv ? 1 : -1;
        return this.sortDir === 'asc' ? cmp : -cmp;
      });
    }
    if (this.projectedFields) {
      data = data.map((item: any) => {
        const proj: any = {};
        for (const f of this.projectedFields!) {
          if (f in item) proj[f] = item[f];
        }
        return proj;
      });
    }
    return data;
  }
}

export default ApiProxySDK;
