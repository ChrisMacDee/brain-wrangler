/**
 * useSessions Hook
 * Reactive hook for session management
 */

import { useLiveQuery } from '../../../shared/hooks';
import { db } from '../../../core/db';
import { Session } from '../../../core/types';
import { sessionService } from '../services';

export function useSessions(taskId?: number, limit?: number) {
  const sessions = useLiveQuery<Session[]>(
    () => {
      if (taskId !== undefined) {
        return db.sessions
          .where('taskId')
          .equals(taskId)
          .reverse()
          .toArray();
      }
      const query = db.sessions.orderBy('startedAt').reverse();
      return limit ? query.limit(limit).toArray() : query.toArray();
    },
    [taskId, limit]
  );

  return {
    sessions: sessions || [],
    service: sessionService
  };
}
