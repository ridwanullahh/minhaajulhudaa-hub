/**
 * Platform-scoped database accessor
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Wraps the active platform DB (LightbaseSDK when VITE_DB_PROVIDER=
 * lightbase, RealTimeGitHubDB when VITE_DB_PROVIDER=github) and exposes
 * the PlatformDB interface that all admin / public pages already use:
 *   schoolDB.get('courses')
 *   masjidDB.insert('events', {...})
 *   charityDB.update('campaigns', id, {...})
 *   travelsDB.delete('bookings', id)
 *
 * Data isolation: platform-scoped collections are stored in separate
 * physical collections. Lightbase uses `${platform}_${collection}`
 * (e.g. `school_courses`, `masjid_events`). The GitHub path uses
 * `data/${platform}/${collection}.json`. Either way the caller code is
 * identical.
 */

import { platformDb } from './db-provider';

class PlatformDB {
  private platform: string;

  constructor(platform: string) {
    this.platform = platform;
  }

  async get<T = any>(collection: string): Promise<T[]> {
    return platformDb.get<T>(this.platform, collection);
  }

  async insert<T = any>(
    collection: string,
    item: Partial<T>
  ): Promise<T & { id: string; createdAt: string; updatedAt: string }> {
    return platformDb.insert<T>(this.platform, collection, {
      ...item,
      platform: this.platform,
    });
  }

  async update<T = any>(
    collection: string,
    id: string,
    updates: Partial<T>
  ): Promise<T & { id: string; createdAt: string; updatedAt: string }> {
    return platformDb.update<T>(this.platform, collection, id, updates);
  }

  async delete(collection: string, id: string): Promise<boolean> {
    return platformDb.delete(this.platform, collection, id);
  }

  async find<T = any>(collection: string, query: Partial<T>): Promise<T[]> {
    return platformDb.find<T>(this.platform, collection, query);
  }

  subscribe<T = any>(collection: string, callback: (data: T[]) => void): () => void {
    return platformDb.subscribe<T>(this.platform, collection, callback);
  }

  async initializePlatform(): Promise<void> {
    await platformDb.initializePlatform(this.platform);
  }
}

export const schoolDB = new PlatformDB('school');
export const masjidDB = new PlatformDB('masjid');
export const charityDB = new PlatformDB('charity');
export const travelsDB = new PlatformDB('travels');

export const initializeAllPlatforms = async () => {
  await platformDb.initializeAllPlatforms();
};

export const getPlatformDB = (platform: string): PlatformDB => {
  switch (platform) {
    case 'school':
      return schoolDB;
    case 'masjid':
      return masjidDB;
    case 'charity':
      return charityDB;
    case 'travels':
      return travelsDB;
    default:
      throw new Error(`Unknown platform: ${platform}`);
  }
};

export { PlatformDB };
