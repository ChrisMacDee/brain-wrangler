/**
 * PomodoroTimer Component
 * Main timer interface combining all timer components
 */

import React, { useState } from 'react';
import { Card } from '../../../shared/components';
import { TimerPreset } from '../../../core/types';
import { useTimer } from '../hooks';
import { TIMER_PRESETS } from '../services';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { PresetSelector } from './PresetSelector';
import './PomodoroTimer.css';

interface PomodoroTimerProps {
  nowTaskId?: number | null;
  nowTaskTitle?: string;
  onSessionStart?: (taskId: number, duration: number, type: 'focus' | 'break') => Promise<number>;
  onSessionEnd?: (sessionId: number, actualDuration: number) => Promise<void>;
}

export function PomodoroTimer({
  nowTaskId,
  nowTaskTitle,
  onSessionStart,
  onSessionEnd
}: PomodoroTimerProps) {
  const [selectedPreset, setSelectedPreset] = useState<TimerPreset>(TIMER_PRESETS[1]);

  const {
    state,
    remainingTime,
    totalTime,
    timerType,
    sessionId,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    extendTimer
  } = useTimer({
    onComplete: async () => {
      if (sessionId && onSessionEnd) {
        const actualDuration = totalTime;
        await onSessionEnd(sessionId, actualDuration);
      }
    }
  });

  const handleStart = async () => {
    const duration = timerType === 'focus'
      ? selectedPreset.focusDuration
      : selectedPreset.breakDuration;

    let newSessionId: number | undefined;

    if (timerType === 'focus' && nowTaskId && onSessionStart) {
      newSessionId = await onSessionStart(nowTaskId, duration, 'focus');
    } else if (timerType === 'break' && onSessionStart) {
      newSessionId = await onSessionStart(nowTaskId || 0, duration, 'break');
    }

    startTimer(duration, timerType, newSessionId);
  };

  const handleStop = async () => {
    if (sessionId && onSessionEnd) {
      const actualDuration = totalTime - remainingTime;
      await onSessionEnd(sessionId, actualDuration);
    }
    stopTimer();
  };

  const canStartFocus = !!nowTaskId;

  return (
    <Card>
      <div className="pomodoro-timer">
        <h2 className="pomodoro-timer-title">Pomodoro Timer</h2>

        {nowTaskTitle && (
          <div className="pomodoro-now-task">
            <span className="pomodoro-now-task-label">Now:</span>
            <span className="pomodoro-now-task-title">{nowTaskTitle}</span>
          </div>
        )}

        {!canStartFocus && state === 'idle' && (
          <div className="pomodoro-warning">
            ⚠️ Please set a "Now" task before starting a focus session
          </div>
        )}

        <PresetSelector
          presets={TIMER_PRESETS}
          selectedPreset={selectedPreset}
          onSelectPreset={setSelectedPreset}
          disabled={state !== 'idle'}
        />

        <TimerDisplay
          remainingTime={remainingTime}
          totalTime={totalTime}
          timerType={timerType}
          state={state}
        />

        <TimerControls
          state={state}
          timerType={timerType}
          canStartFocus={canStartFocus}
          onStart={handleStart}
          onPause={pauseTimer}
          onResume={resumeTimer}
          onStop={handleStop}
          onExtend={extendTimer}
        />
      </div>
    </Card>
  );
}
