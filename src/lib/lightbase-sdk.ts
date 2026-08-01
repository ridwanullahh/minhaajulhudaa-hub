/**
 * Lightbase SDK
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Drop-in replacement for the GitHub-based DB layer that talks to the
 * Lightbase BaaS core API (`/api/v1`) instead of storing JSON files in a
 * Git repository.
 *
 * Implements BOTH interfaces used by the codebase:
 *   1. The "global" UniversalSDK interface (get / insert / update / delete
 *      by collection) used by `src/lib/db.ts` for auth, OTPs, transactions
 *      and media.
 *   2. The "platform-scoped" RealTimeGitHubDB interface (get / insert /
 *      update / delete by platform + collection) used by
 *      `src/lib/platform-db.ts` for school / masjid / charity / travels
 *      data.
 *
 * Platform-scoped collections are stored as `${platform}_${collection}` so
 * that data isolation is preserved without needing a separate project per
 * platform.
 *
 * Field mapping (Lightbase <-> app):
 *   Lightbase `id`            -> app `id` AND `uid` (uid = id)
 *   Lightbase `_created_at`   -> app `createdAt`
 *   Lightbase `_updated_at`   -> app `updatedAt`
 *   Lightbase `_revision`     -> used for optimistic concurrency (If-Match)
 */

const DEFAULT_LIMIT = 1000;

export interface LightbaseConfig {
  baseUrl: string;
  apiKey: string;
  projectId: string;
}

export interface LightbaseDocument {
  id: string;
  uid: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface LightbaseQueryResponse<T> {
  data: T[];
  nextCursor?: { limit: number; offset: number } | null;
  total?: number;
  hasMore?: boolean;
  count?: number;
}

interface LightbaseInsertResponse<T> {
  document: T & {
    id: string;
    _created_at: string;
    _updated_at: string;
    _revision: number;
    _deleted: boolean;
    _checksum: string;
  };
}

interface LightbaseCollectionInfo {
  name: string;
  fields?: any[];
}

interface LightbaseCollectionsResponse {
  collections: LightbaseCollectionInfo[];
}

interface LightbaseRealtimeMessage {
  event: string;
  collection?: string;
  docId?: string;
  document?: any;
  revision?: number;
}

/**
 * Convert a Lightbase raw document into the app's canonical shape.
 */
function normalizeDocument<T = any>(raw: any): LightbaseDocument & T {
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
    uid: rest.uid || id, // uid mirrors Lightbase id for backward compat
    createdAt: rest.createdAt || _created_at || new Date().toISOString(),
    updatedAt: rest.updatedAt || _updated_at || _created_at || new Date().toISOString(),
  } as LightbaseDocument & T;
}

/**
 * Strip app-managed fields before sending to Lightbase so we never
 * accidentally overwrite reserved fields.
 */
function sanitizePayload(payload: any): any {
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

export class LightbaseSDK {
  private baseUrl: string;
  private apiKey: string;
  private projectId: string;
  private cache: Map<string, any[]> = new Map();
  private subscribers: Map<string, Set<(data: any[]) => void>> = new Map();
  private pollingIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private ensuredCollections: Set<string> = new Set();

  constructor(config: LightbaseConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.apiKey = config.apiKey;
    this.projectId = config.projectId;
  }

  private get headers(): Record<string, string> {
    return {
      apikey: this.apiKey,
      'x-lightbase-project': this.projectId,
      'Content-Type': 'application/json',
    };
  }

  private collectionUrl(collection: string): string {
    return `${this.baseUrl}/api/v1/projects/${this.projectId}/collections/${encodeURIComponent(collection)}`;
  }

  private docsUrl(collection: string): string {
    return `${this.collectionUrl(collection)}/docs`;
  }

  /**
   * Ensure a collection exists. Creates it with a permissive schema if missing.
   * Safe to call repeatedly; caches the result.
   */
  async ensureCollection(collection: string): Promise<void> {
    if (this.ensuredCollections.has(collection)) return;
    try {
      const res = await fetch(this.collectionUrl(collection), {
        method: 'GET',
        headers: this.headers,
      });
      if (res.ok) {
        this.ensuredCollections.add(collection);
        return;
      }
      if (res.status === 404) {
        // Create with a minimal permissive schema (single flexible field).
        const createRes = await fetch(
          `${this.baseUrl}/api/v1/projects/${this.projectId}/collections`,
          {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
              name: collection,
              fields: [
                { name: 'data', type: 'json' },
                { name: 'platform', type: 'string', indexed: true },
              ],
            }),
          }
        );
        if (createRes.ok || createRes.status === 409) {
          this.ensuredCollections.add(collection);
          return;
        }
        const text = await createRes.text().catch(() => '');
        throw new Error(`Failed to create collection ${collection}: ${createRes.status} ${text}`);
      }
      const text = await res.text().catch(() => '');
      throw new Error(`Failed to check collection ${collection}: ${res.status} ${text}`);
    } catch (err) {
      // Network or other error - log and continue; the call will retry on next op
      console.warn(`[LightbaseSDK] ensureCollection(${collection}) warning:`, err);
    }
  }

  // ---------------------------------------------------------------------------
  // GLOBAL COLLECTION OPERATIONS (UniversalSDK-compatible interface)
  // Used by src/lib/db.ts for users / otps / transactions / media / etc.
  // ---------------------------------------------------------------------------

  async init(): Promise<this> {
    // No-op: collections are ensured lazily on first write.
    // Kept for interface parity with UniversalSDK.
    return this;
  }

  async get<T = any>(collection: string): Promise<T[]> {
    await this.ensureCollection(collection);
    try {
      // Fetch up to DEFAULT_LIMIT docs. For larger sets, callers should
      // use queryBuilder / paginated queries.
      const url = `${this.docsUrl(collection)}?limit=${DEFAULT_LIMIT}`;
      const res = await fetch(url, { method: 'GET', headers: this.headers });
      if (!res.ok) {
        if (res.status === 404) return [];
        const text = await res.text().catch(() => '');
        throw new Error(`Lightbase get(${collection}) failed: ${res.status} ${text}`);
      }
      const json: LightbaseQueryResponse<any> = await res.json();
      const data = (json.data || []).map(normalizeDocument<T>);
      this.cache.set(collection, data);
      return data;
    } catch (err) {
      console.error(`[LightbaseSDK] get(${collection}) error:`, err);
      return this.cache.get(collection) || [];
    }
  }

  async getItem<T = any>(collection: string, id: string): Promise<T | null> {
    await this.ensureCollection(collection);
    try {
      const res = await fetch(`${this.collectionUrl(collection)}/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: this.headers,
      });
      if (res.status === 404) return null;
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Lightbase getItem(${collection},${id}) failed: ${res.status} ${text}`);
      }
      const json = await res.json();
      const raw = json.document || json;
      return normalizeDocument<T>(raw);
    } catch (err) {
      console.error(`[LightbaseSDK] getItem(${collection},${id}) error:`, err);
      return null;
    }
  }

  async insert<T = any>(collection: string, item: Partial<T>): Promise<T & LightbaseDocument> {
    await this.ensureCollection(collection);
    const payload = sanitizePayload(item);
    const res = await fetch(this.collectionUrl(collection), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Lightbase insert(${collection}) failed: ${res.status} ${text}`);
    }
    const json: LightbaseInsertResponse<any> = await res.json();
    const doc = normalizeDocument<T>(json.document);
    // Update cache
    const cached = this.cache.get(collection) || [];
    this.cache.set(collection, [...cached, doc]);
    this.notifySubscribers(collection);
    return doc;
  }

  async update<T = any>(collection: string, id: string, updates: Partial<T>): Promise<T & LightbaseDocument> {
    await this.ensureCollection(collection);
    const payload = sanitizePayload(updates);
    const res = await fetch(`${this.collectionUrl(collection)}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Lightbase update(${collection},${id}) failed: ${res.status} ${text}`);
    }
    const json = await res.json();
    const doc = normalizeDocument<T>(json.document || json);
    // Update cache
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
    await this.ensureCollection(collection);
    const res = await fetch(`${this.collectionUrl(collection)}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: this.headers,
    });
    if (!res.ok && res.status !== 404) {
      const text = await res.text().catch(() => '');
      throw new Error(`Lightbase delete(${collection},${id}) failed: ${res.status} ${text}`);
    }
    // Update cache
    const cached = this.cache.get(collection) || [];
    this.cache.set(collection, cached.filter((d) => d.id !== id && d.uid !== id));
    this.notifySubscribers(collection);
  }

  async find<T = any>(collection: string, query: Partial<T>): Promise<T[]> {
    const all = await this.get<T>(collection);
    return all.filter((item: any) => {
      return Object.entries(query).every(([key, value]) => item[key] === value);
    });
  }

  subscribe<T = any>(collection: string, callback: (data: T[]) => void): () => void {
    const key = collection;
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key)!.add(callback);
    // Initial data push
    this.get<T>(collection).then(callback).catch(() => {});
    return () => {
      this.subscribers.get(key)?.delete(callback);
    };
  }

  unsubscribe(collection: string, callback: Function): void {
    this.subscribers.get(collection)?.delete(callback as any);
  }

  private notifySubscribers(collection: string): void {
    const subs = this.subscribers.get(collection);
    if (!subs || subs.size === 0) return;
    const data = this.cache.get(collection) || [];
    subs.forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        console.warn(`[LightbaseSDK] subscriber callback error for ${collection}:`, err);
      }
    });
  }

  /**
   * Query builder matching the UniversalSDK.queryBuilder() shape.
   * Returns a chainable builder that exec()s against Lightbase.
   */
  queryBuilder<T = any>(collection: string): LightbaseQueryBuilder<T> {
    return new LightbaseQueryBuilder<T>(this, collection);
  }

  // ---------------------------------------------------------------------------
  // PLATFORM-SCOPED OPERATIONS (RealTimeGitHubDB-compatible interface)
  // Used by src/lib/platform-db.ts for school / masjid / charity / travels.
  // ---------------------------------------------------------------------------

  /**
   * Compose the physical collection name for a platform-scoped collection.
   * We prefix with the platform so that e.g. school.courses and
   * masjid.courses live in separate Lightbase collections.
   */
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
  ): Promise<T & LightbaseDocument> {
    const doc = await this.insert<T>(
      this.platformCollection(platform, collection),
      { ...item, platform }
    );
    return doc;
  }

  async updatePlatform<T = any>(
    platform: string,
    collection: string,
    id: string,
    updates: Partial<T>
  ): Promise<T & LightbaseDocument> {
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
    const collections = this.getPlatformCollections(platform);
    await Promise.all(
      collections.map((c) => this.ensureCollection(this.platformCollection(platform, c)))
    );
  }

  async initializeAllPlatforms(): Promise<void> {
    await Promise.all(
      ['school', 'masjid', 'charity', 'travels'].map((p) => this.initializePlatform(p))
    );
    // Ensure global collections too
    await Promise.all(
      ['users', 'otps', 'transactions', 'media', 'email_logs'].map((c) =>
        this.ensureCollection(c)
      )
    );
  }

  private getPlatformCollections(platform: string): string[] {
    const baseCollections = ['blog_posts', 'pages', 'media', 'settings', 'events'];

    switch (platform) {
      case 'school':
        return [
          ...baseCollections,
          'students', 'courses', 'classes', 'programs', 'admissions',
          'assignments', 'exams', 'grades', 'staff', 'announcements',
          'library', 'shop_products', 'shop_orders', 'payments',
          'lms_courses', 'lms_lessons', 'lms_assignments',
        ];
      case 'masjid':
        return [
          ...baseCollections,
          'prayer_times', 'audio_library', 'donations', 'announcements',
          'quran_recitations', 'islamic_calendar', 'volunteers', 'programs',
        ];
      case 'charity':
        return [
          ...baseCollections,
          'campaigns', 'projects', 'donations', 'volunteers', 'beneficiaries',
          'testimonials', 'impact_reports', 'fundraisers',
        ];
      case 'travels':
        return [
          ...baseCollections,
          'packages', 'bookings', 'customers', 'reviews', 'itineraries',
          'travel_guides', 'visa_info', 'payments',
        ];
      default:
        return baseCollections;
    }
  }
}

/**
 * Chainable query builder matching UniversalSDK.queryBuilder() shape.
 */
class LightbaseQueryBuilder<T = any> {
  private sdk: LightbaseSDK;
  private collection: string;
  private filters: ((item: any) => boolean)[] = [];
  private sortField?: string;
  private sortDir: 'asc' | 'desc' = 'asc';
  private projectedFields?: string[];

  constructor(sdk: LightbaseSDK, collection: string) {
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

export default LightbaseSDK;
