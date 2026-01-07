/**
 * useInterruptions Hook
 * Reactive hook for interruption management
 */

import { useLiveQuery } from '../../../shared/hooks';
import { db } from '../../../core/db';
import { Interruption } from '../../../core/types';
import { sessionService } from '../services';

export function useInterruptions(sessionId?: number) {
  const interruptions = useLiveQuery<Interruption[]>(
    () => {
      if (sessionId !== undefined) {
        return db.interruptions
          .where('sessionId')
          .equals(sessionId)
          .toArray();
      }
      return db.interruptions.toArray();
    },
    [sessionId]
  );

  return {
    interruptions: interruptions || [],
    service: sessionService
  };
}
