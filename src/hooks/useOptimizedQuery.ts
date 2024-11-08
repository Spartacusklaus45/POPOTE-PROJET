import { useQuery, QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { cachedFetch } from '../utils/performance';

export function useOptimizedQuery<T>(
  key: QueryKey,
  url: string,
  options?: UseQueryOptions<T>
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => cachedFetch(url),
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    ...options
  });
}