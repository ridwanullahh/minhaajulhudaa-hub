import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { schoolDB, masjidDB, charityDB, travelsDB } from '@/lib/platform-db';

/**
 * React Query hooks for data caching
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Wraps the platform DB operations with TanStack Query for automatic
 * caching, background refetching, and stale-time management. This
 * means navigating between pages that show the same data (e.g.
 * blog posts on the home page and the blog list page) will use the
 * cached result instead of re-fetching.
 *
 * Stale time: 30 seconds (data is considered fresh for 30s)
 * Cache time: 5 minutes (cached data is kept for 5 min before GC)
 *
 * Usage:
 *   const { data, isLoading, error } = useCollection('school', 'blog_posts');
 *   const { mutate } = useInsertDoc('school', 'blog_posts');
 */

const STALE_TIME = 30 * 1000; // 30 seconds
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

function getDB(platform: string) {
  switch (platform) {
    case 'school': return schoolDB;
    case 'masjid': return masjidDB;
    case 'charity': return charityDB;
    case 'travels': return travelsDB;
    default: throw new Error(`Unknown platform: ${platform}`);
  }
}

/**
 * Fetch a collection with caching.
 * Cache key: [platform, collection]
 */
export function useCollection<T = any>(platform: string, collection: string) {
  return useQuery({
    queryKey: [platform, collection],
    queryFn: async () => {
      const db = getDB(platform);
      return db.get<T>(collection);
    },
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
  });
}

/**
 * Insert a document and invalidate the collection cache.
 */
export function useInsertDoc(platform: string, collection: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (doc: any) => {
      const db = getDB(platform);
      return db.insert(collection, doc);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [platform, collection] });
    },
  });
}

/**
 * Update a document and invalidate the cache.
 */
export function useUpdateDoc(platform: string, collection: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const db = getDB(platform);
      return db.update(collection, id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [platform, collection] });
    },
  });
}

/**
 * Delete a document and invalidate the cache.
 */
export function useDeleteDoc(platform: string, collection: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const db = getDB(platform);
      return db.delete(collection, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [platform, collection] });
    },
  });
}

/**
 * Global collection (not platform-scoped) with caching.
 * Used for users, transactions, media, etc.
 */
export function useGlobalCollection<T = any>(collection: string) {
  return useQuery({
    queryKey: ['global', collection],
    queryFn: async () => {
      const { globalDb } = await import('@/lib/db-provider');
      return globalDb.get<T>(collection);
    },
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
  });
}

export default { useCollection, useInsertDoc, useUpdateDoc, useDeleteDoc, useGlobalCollection };
