/**
 * useTimer Hook
 * Manages timer state and controls
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerState, TimerPreset } from '../../../core/types';
import { minutesToSeconds } from '../../../shared/utils';

interface UseTimerOptions {
  onComplete?: () => void;
  onTick?: (remainingTime: number) => void;
}

export function useTimer(options: UseTimerOptions = {}) {
  const [state, setState] = useState<TimerState>('idle');
  const [remainingTime, setRemainingTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [timerType, setTimerType] = useState<'focus' | 'break'>('focus');
  const [sessionId, setSessionId] = useState<number | undefined>();

  const intervalRef = useRef<number | null>(null);

  const startTimer = useCallback((
    duration: number,
    type: 'focus' | 'break',
    newSessionId?: number
  ) => {
    const seconds = minutesToSeconds(duration);
    setTotalTime(seconds);
    setRemainingTime(seconds);
    setTimerType(type);
    setSessionId(newSessionId);
    setState('running');
  }, []);

  const pauseTimer = useCallback(() => {
    setState('paused');
  }, []);

  const resumeTimer = useCallback(() => {
    if (state === 'paused') {
      setState('running');
    }
  }, [state]);

  const stopTimer = useCallback(() => {
    setState('idle');
    setRemainingTime(0);
    setTotalTime(0);
    setSessionId(undefined);
  }, []);

  const extendTimer = useCallback((additionalMinutes: number) => {
    const additionalSeconds = minutesToSeconds(additionalMinutes);
    setRemainingTime(prev => prev + additionalSeconds);
    setTotalTime(prev => prev + additionalSeconds);
  }, []);

  const resetTimer = useCallback(() => {
    setRemainingTime(totalTime);
    setState('idle');
  }, [totalTime]);

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = window.setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setState('completed');
            options.onComplete?.();
            return 0;
          }
          const newTime = prev - 1;
          options.onTick?.(newTime);
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state, options]);

  return {
    state,
    remainingTime,
    totalTime,
    timerType,
    sessionId,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    extendTimer,
    resetTimer
  };
}
