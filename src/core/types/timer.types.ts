/**
 * Timer Module Types
 * Defines timer and preset configurations
 */

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerPreset {
  id: string;
  name: string;
  focusDuration: number;
  breakDuration: number;
  description?: string;
}

export interface TimerConfig {
  duration: number;
  type: 'focus' | 'break';
  taskId?: number;
}

export interface TimerStatus {
  state: TimerState;
  remainingTime: number;
  totalTime: number;
  type: 'focus' | 'break';
  sessionId?: number;
}
