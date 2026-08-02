/**
 * DB Provider Abstraction
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Single source of truth for which database backend the application uses.
 *
 * Three providers, switchable via `VITE_DB_PROVIDER`:
 *
 *   `api` (default, production-recommended)
 *     - Talks to the Astro backend (/api/db/*) which proxies to Lightbase.
 *     - The Lightbase API key lives server-side and NEVER reaches the
 *       browser. Use this in production.
 *
 *   `lightbase`
 *     - Talks to Lightbase /api/v1 directly from the browser.
 *     - The API key is in the client bundle. Use only for local dev /
 *       debugging when the Astro backend is not running.
 *
 *   `github`
 *     - Legacy GitHub-repo-as-database (UniversalSDK + RealTimeGitHubDB).
 *     - Kept as a fallback. The GitHub implementation is fully intact so
 *       operators can manually switch back by changing one env var. There
 *       is NO automatic fallback, by design, so every part of the app
 *       always reads and writes through the same provider.
 */

import config from './config';
import { ApiProxySDK } from './api-proxy-sdk';

// LightbaseSDK is lazily imported only when provider=lightbase, so the
// Lightbase URL/key config is NEVER read (and therefore NEVER inlined
// into the client bundle) when provider=api (the production default).
let LightbaseSDKCtor: any = null;
async function getLightbaseSDKCtor(): Promise<any> {
  if (!LightbaseSDKCtor) {
    const mod = await import('./lightbase-sdk');
    LightbaseSDKCtor = mod.LightbaseSDK;
  }
  return LightbaseSDKCtor;
}

// ---------------------------------------------------------------------------
// Provider selection
// ---------------------------------------------------------------------------

export type DbProvider = 'api' | 'lightbase' | 'github';

export const DB_PROVIDER: DbProvider = config.db.provider;
export const IS_API = DB_PROVIDER === 'api';
export const IS_LIGHTBASE = DB_PROVIDER === 'lightbase';
export const IS_GITHUB = DB_PROVIDER === 'github';

// ---------------------------------------------------------------------------
// Global DB instance (for users / otps / transactions / media / etc.)
// ---------------------------------------------------------------------------

/**
 * `globalDb` exposes the UniversalSDK-compatible interface used by
 * `src/lib/db.ts`: get / getItem / insert / update / delete / find /
 * subscribe / queryBuilder / init.
 *
 * - When provider=lightbase: a LightbaseSDK instance.
 * - When provider=github: the existing UniversalSDK from github-db-sdk.ts.
 */
let _globalDb: any = null;

export async function getGlobalDb(): Promise<any> {
  if (_globalDb) return _globalDb;
  if (IS_API) {
    _globalDb = new ApiProxySDK({ baseUrl: config.app.apiUrl });
    await _globalDb.init();
  } else if (IS_LIGHTBASE) {
    const LightbaseSDK = await getLightbaseSDKCtor();
    _globalDb = new LightbaseSDK({
      baseUrl: config.lightbase.baseUrl,
      apiKey: config.lightbase.apiKey,
      projectId: config.lightbase.projectId,
    });
    await _globalDb.init();
  } else {
    // Lazy-load the legacy SDK so it is never instantiated when the
    // operator has chosen api/lightbase (keeps the bundle lean and
    // avoids requiring GitHub creds for non-github deployments).
    const UniversalSDK = (await import('./github-db-sdk')).default;
    const schemas = (await import('./db-schemas')).default;
    _globalDb = new UniversalSDK({
      owner: config.github.user,
      repo: config.github.repo,
      token: config.github.token,
      branch: config.github.branch,
      basePath: 'data',
      mediaPath: 'media',
      schemas,
    });
    await _globalDb.init();
  }
  return _globalDb;
}

/**
 * Synchronous accessor for the global DB. Returns the cached instance if
 * already initialized, otherwise returns a lightweight proxy that queues
 * calls until the real instance is ready. For simplicity in this
 * codebase (which already uses async get/insert/update/delete), callers
 * should prefer `await getGlobalDb()` - but `globalDb` is provided for
 * compatibility with `db.ts` which exports a sync default.
 */
class AsyncInitProxy {
  private _instance: any = null;
  private _initPromise: Promise<any> | null = null;

  ensure(): Promise<any> {
    if (this._instance) return Promise.resolve(this._instance);
    if (!this._initPromise) {
      this._initPromise = getGlobalDb().then((db) => {
        this._instance = db;
        return db;
      });
    }
    return this._initPromise;
  }

  // UniversalSDK-compatible surface
  async get<T = any>(collection: string): Promise<T[]> {
    const db = await this.ensure();
    return db.get<T>(collection);
  }
  async getItem<T = any>(collection: string, key: string): Promise<T | null> {
    const db = await this.ensure();
    return db.getItem<T>(collection, key);
  }
  async insert<T = any>(collection: string, item: Partial<T>): Promise<T & { id: string; uid: string }> {
    const db = await this.ensure();
    return db.insert<T>(collection, item);
  }
  async update<T = any>(collection: string, key: string, updates: Partial<T>): Promise<T> {
    const db = await this.ensure();
    return db.update<T>(collection, key, updates);
  }
  async delete<T = any>(collection: string, key: string): Promise<void> {
    const db = await this.ensure();
    return db.delete<T>(collection, key);
  }
  async find<T = any>(collection: string, query: Partial<T>): Promise<T[]> {
    const db = await this.ensure();
    return db.find<T>(collection, query);
  }
  subscribe<T = any>(collection: string, callback: (data: T[]) => void): () => void {
    // Fire-and-forget: resolve the instance then subscribe. Returns a
    // no-op unsubscribe if the instance hasn't resolved yet; the real
    // subscription is attached on resolution.
    let unsub: (() => void) | null = null;
    this.ensure().then((db) => {
      unsub = db.subscribe<T>(collection, callback);
    });
    return () => {
      if (unsub) unsub();
    };
  }
  unsubscribe(collection: string, callback: Function): void {
    if (this._instance) this._instance.unsubscribe(collection, callback);
  }
  async init(): Promise<any> {
    return this.ensure();
  }
  queryBuilder<T = any>(collection: string): any {
    // Return a lazy builder. For Lightbase we can build synchronously
    // since the SDK doesn't need network for builder construction.
    if (IS_LIGHTBASE && this._instance) {
      return this._instance.queryBuilder<T>(collection);
    }
    // Fallback: return a minimal builder that resolves on exec.
    const self = this;
    return {
      where(fn: (item: T) => boolean) { this._filters.push(fn); return this; },
      _filters: [] as ((item: T) => boolean)[],
      _sort: null as any,
      sort(field: string, dir: 'asc' | 'desc' = 'asc') { this._sort = { field, dir }; return this; },
      _project: null as any,
      project(fields: string[]) { this._project = fields; return this; },
      async exec(): Promise<T[]> {
        const db = await self.ensure();
        const qb = db.queryBuilder<T>(collection);
        for (const f of this._filters) qb.where(f);
        if (this._sort) qb.sort(this._sort.field, this._sort.dir);
        if (this._project) qb.project(this._project);
        return qb.exec();
      },
    };
  }
}

export const globalDb = new AsyncInitProxy();

// ---------------------------------------------------------------------------
// Platform-scoped DB instance (for school / masjid / charity / travels)
// ---------------------------------------------------------------------------

/**
 * `platformDb` exposes the RealTimeGitHubDB-compatible interface used by
 * `src/lib/platform-db.ts`: get / insert / update / delete / find /
 * subscribe / initializePlatform / initializeAllPlatforms - all keyed by
 * (platform, collection).
 *
 * - When provider=lightbase: a LightbaseSDK instance (the same class as
 *   the global DB, since LightbaseSDK implements both interfaces).
 * - When provider=github: the existing RealTimeGitHubDB.
 */
let _platformDb: any = null;

export async function getPlatformDb(): Promise<any> {
  if (_platformDb) return _platformDb;
  if (IS_API) {
    _platformDb = new ApiProxySDK({ baseUrl: config.app.apiUrl });
  } else if (IS_LIGHTBASE) {
    const LightbaseSDK = await getLightbaseSDKCtor();
    _platformDb = new LightbaseSDK({
      baseUrl: config.lightbase.baseUrl,
      apiKey: config.lightbase.apiKey,
      projectId: config.lightbase.projectId,
    });
  } else {
    const RealTimeGitHubDB = (await import('./real-time-github-db')).default;
    _platformDb = new RealTimeGitHubDB({
      owner: config.github.user,
      repo: config.github.repo,
      token: config.github.token,
      branch: config.github.branch,
    });
  }
  return _platformDb;
}

/**
 * Synchronous accessor for the platform-scoped DB. Same lazy-proxy
 * pattern as `globalDb`.
 */
class PlatformDbProxy {
  private _instance: any = null;
  private _initPromise: Promise<any> | null = null;

  ensure(): Promise<any> {
    if (this._instance) return Promise.resolve(this._instance);
    if (!this._initPromise) {
      this._initPromise = getPlatformDb().then((db) => {
        this._instance = db;
        return db;
      });
    }
    return this._initPromise;
  }

  async get<T = any>(platform: string, collection: string): Promise<T[]> {
    const db = await this.ensure();
    if (IS_API || IS_LIGHTBASE) return db.getPlatform<T>(platform, collection);
    return db.get<T>(platform, collection);
  }
  async insert<T = any>(platform: string, collection: string, item: Partial<T>): Promise<T & { id: string; createdAt: string; updatedAt: string }> {
    const db = await this.ensure();
    if (IS_API || IS_LIGHTBASE) return db.insertPlatform<T>(platform, collection, item);
    return db.insert<T>(platform, collection, item);
  }
  async update<T = any>(platform: string, collection: string, id: string, updates: Partial<T>): Promise<T & { id: string; createdAt: string; updatedAt: string }> {
    const db = await this.ensure();
    if (IS_API || IS_LIGHTBASE) return db.updatePlatform<T>(platform, collection, id, updates);
    return db.update<T>(platform, collection, id, updates);
  }
  async delete(platform: string, collection: string, id: string): Promise<boolean> {
    const db = await this.ensure();
    if (IS_API || IS_LIGHTBASE) return db.deletePlatform(platform, collection, id);
    return db.delete(platform, collection, id);
  }
  async find<T = any>(platform: string, collection: string, query: Partial<T>): Promise<T[]> {
    const db = await this.ensure();
    if (IS_API || IS_LIGHTBASE) return db.findPlatform<T>(platform, collection, query);
    return db.find<T>(platform, collection, query);
  }
  subscribe<T = any>(platform: string, collection: string, callback: (data: T[]) => void): () => void {
    let unsub: (() => void) | null = null;
    this.ensure().then((db) => {
      if (IS_API || IS_LIGHTBASE) {
        unsub = db.subscribePlatform<T>(platform, collection, callback);
      } else {
        unsub = db.subscribe<T>(platform, collection, callback);
      }
    });
    return () => {
      if (unsub) unsub();
    };
  }
  async initializePlatform(platform: string): Promise<void> {
    const db = await this.ensure();
    await db.initializePlatform(platform);
  }
  async initializeAllPlatforms(): Promise<void> {
    const db = await this.ensure();
    await db.initializeAllPlatforms();
  }
  async seedPlatformData(platform: string): Promise<void> {
    const db = await this.ensure();
    if (typeof db.seedPlatformData === 'function') {
      await db.seedPlatformData(platform);
    }
    // Lightbase has no built-in seedPlatformData; seeding is handled by
    // the standalone seed script (scripts/seed-lightbase.mjs).
  }
}

export const platformDb = new PlatformDbProxy();

export default { globalDb, platformDb, IS_API, IS_LIGHTBASE, IS_GITHUB, DB_PROVIDER };
