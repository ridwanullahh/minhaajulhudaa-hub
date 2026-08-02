import { useState, useEffect, useCallback } from 'react';

/**
 * useListData hook
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Standardized data-fetching hook for admin list pages. Returns
 * isLoading / error / data / refetch so pages can use the shared
 * <DataState> component without duplicating fetch logic.
 *
 * Usage:
 *   const { data, isLoading, error, refetch } = useListData(() => schoolDB.get('courses'));
 *   return <DataState isLoading={isLoading} error={error} isEmpty={data.length === 0} onRetry={refetch}>...</DataState>
 */

export function useListData<T = any>(
  fetcher: () => Promise<T[]>,
  deps: any[] = []
): {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export default useListData;
