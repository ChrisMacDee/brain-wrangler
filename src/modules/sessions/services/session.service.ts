/**
 * Session Service
 * Manages focus sessions and interruptions
 */

import { db } from '../../../core/db';
import { Session, Interruption, InterruptionCategory } from '../../../core/types';

export class SessionService {
  async startSession(
    taskId: number | undefined,
    type: 'focus' | 'break',
    plannedDuration: number
  ): Promise<number> {
    const session: Session = {
      taskId,
      type,
      plannedDuration,
      startedAt: new Date(),
      interruptionCount: 0
    };

    return await db.sessions.add(session);
  }

  async endSession(sessionId: number, actualDuration: number): Promise<void> {
    await db.sessions.update(sessionId, {
      actualDuration,
      endedAt: new Date()
    });
  }

  async addInterruption(
    sessionId: number,
    category: InterruptionCategory,
    note?: string
  ): Promise<void> {
    const interruption: Interruption = {
      sessionId,
      category,
      note,
      timestamp: new Date()
    };

    await db.interruptions.add(interruption);

    const session = await db.sessions.get(sessionId);
    if (session) {
      await db.sessions.update(sessionId, {
        interruptionCount: session.interruptionCount + 1
      });
    }
  }

  async getSessionInterruptions(sessionId: number): Promise<Interruption[]> {
    return await db.interruptions
      .where('sessionId')
      .equals(sessionId)
      .toArray();
  }

  async getRecentSessions(limit: number = 10): Promise<Session[]> {
    return await db.sessions
      .orderBy('startedAt')
      .reverse()
      .limit(limit)
      .toArray();
  }

  async getTaskSessions(taskId: number): Promise<Session[]> {
    return await db.sessions
      .where('taskId')
      .equals(taskId)
      .reverse()
      .toArray();
  }

  async deleteSession(sessionId: number): Promise<void> {
    await db.interruptions.where('sessionId').equals(sessionId).delete();
    await db.sessions.delete(sessionId);
  }
}

export const sessionService = new SessionService();
