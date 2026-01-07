/**
 * Session Module Types
 * Defines session and interruption data structures
 */

export type SessionType = 'focus' | 'break';
export type InterruptionCategory = 'thought' | 'notification' | 'person' | 'urgent' | 'bored';

export interface Session {
  id?: number;
  taskId?: number;
  type: SessionType;
  plannedDuration: number;
  actualDuration?: number;
  startedAt: Date;
  endedAt?: Date;
  interruptionCount: number;
}

export interface Interruption {
  id?: number;
  sessionId: number;
  category: InterruptionCategory;
  note?: string;
  timestamp: Date;
}

export interface SessionSummary {
  totalFocusTime: number;
  totalBreakTime: number;
  completedSessions: number;
  totalInterruptions: number;
  averageFocusTime: number;
}
