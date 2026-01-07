/**
 * useLiveQuery Hook
 * Wrapper around Dexie's liveQuery for React integration
 * Provides reactive database queries that automatically update the UI
 */

import { useEffect, useState } from 'react';
import { liveQuery, Subscription } from 'dexie';

export function useLiveQuery<T>(
  querier: () => Promise<T> | T,
  deps: any[] = []
): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);

  useEffect(() => {
    const observable = liveQuery(querier);
    const subscription: Subscription = observable.subscribe({
      next: (result) => setData(result),
      error: (error) => console.error('useLiveQuery error:', error)
    });

    return () => subscription.unsubscribe();
  }, deps);

  return data;
}
