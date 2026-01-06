/**
 * TimerControls Component
 * Control buttons for the timer
 */

import React from 'react';
import { Button } from '../../../shared/components';
import './TimerControls.css';

interface TimerControlsProps {
  state: string;
  timerType: 'focus' | 'break';
  canStartFocus: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onExtend?: (minutes: number) => void;
}

export function TimerControls({
  state,
  timerType,
  canStartFocus,
  onStart,
  onPause,
  onResume,
  onStop,
  onExtend
}: TimerControlsProps) {
  return (
    <div className="timer-controls">
      {state === 'idle' && (
        <Button
          size="large"
          fullWidth
          onClick={onStart}
          disabled={!canStartFocus && timerType === 'focus'}
        >
          Start {timerType === 'focus' ? 'Focus' : 'Break'}
        </Button>
      )}

      {state === 'running' && (
        <>
          <Button size="large" variant="secondary" onClick={onPause}>
            Pause
          </Button>
          <Button size="large" variant="danger" onClick={onStop}>
            End Session
          </Button>
        </>
      )}

      {state === 'paused' && (
        <>
          <Button size="large" variant="primary" onClick={onResume}>
            Resume
          </Button>
          <Button size="large" variant="danger" onClick={onStop}>
            End Session
          </Button>
        </>
      )}

      {state === 'completed' && (
        <Button size="large" fullWidth onClick={onStop}>
          Continue
        </Button>
      )}

      {(state === 'running' || state === 'paused') && onExtend && (
        <div className="timer-extend-controls">
          <span className="timer-extend-label">Extend:</span>
          <Button size="small" variant="ghost" onClick={() => onExtend(5)}>
            +5 min
          </Button>
          <Button size="small" variant="ghost" onClick={() => onExtend(10)}>
            +10 min
          </Button>
        </div>
      )}
    </div>
  );
}
