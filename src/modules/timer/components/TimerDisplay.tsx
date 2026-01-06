/**
 * TimerDisplay Component
 * Displays the current timer state
 */

import React from 'react';
import { formatTime } from '../../../shared/utils';
import './TimerDisplay.css';

interface TimerDisplayProps {
  remainingTime: number;
  totalTime: number;
  timerType: 'focus' | 'break';
  state: string;
}

export function TimerDisplay({
  remainingTime,
  totalTime,
  timerType,
  state
}: TimerDisplayProps) {
  const progress = totalTime > 0 ? ((totalTime - remainingTime) / totalTime) * 100 : 0;

  return (
    <div className={`timer-display timer-display-${timerType}`}>
      <div className="timer-type-badge">
        {timerType === 'focus' ? '🎯 Focus' : '☕ Break'}
      </div>

      <div className="timer-time">
        {formatTime(remainingTime)}
      </div>

      <div className="timer-progress-bar">
        <div
          className="timer-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="timer-state">
        {state === 'running' && 'Running...'}
        {state === 'paused' && 'Paused'}
        {state === 'completed' && 'Completed!'}
        {state === 'idle' && 'Ready'}
      </div>
    </div>
  );
}
