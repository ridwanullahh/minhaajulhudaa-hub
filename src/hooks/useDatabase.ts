
import { useState, useEffect } from 'react';
import db from '@/lib/db';

export const useDatabase = <T = any>(collection: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = db.subscribe<T>(collection, (newData) => {
      setData(newData);
      setLoading(false);
    });

    return unsubscribe;
  }, [collection]);

  const insert = async (item: Partial<T>) => {
    try {
      setError(null);
      return await db.insert(collection, item);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const update = async (id: string, updates: Partial<T>) => {
    try {
      setError(null);
      return await db.update(collection, id, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      setError(null);
      await db.delete(collection, id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const getItem = async (id: string) => {
    try {
      setError(null);
      return await db.getItem<T>(collection, id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const query = () => db.queryBuilder<T>(collection);

  return {
    data,
    loading,
    error,
    insert,
    update,
    remove,
    getItem,
    query
  };
};
