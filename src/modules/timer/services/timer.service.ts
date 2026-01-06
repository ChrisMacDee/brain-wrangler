/**
 * Timer Service
 * Manages timer presets and configurations
 */

import { TimerPreset } from '../../../core/types';

export const TIMER_PRESETS: TimerPreset[] = [
  {
    id: 'short-sprint',
    name: 'Short Sprint',
    focusDuration: 10,
    breakDuration: 2,
    description: 'Quick 10-minute focus session'
  },
  {
    id: 'classic',
    name: 'Classic',
    focusDuration: 25,
    breakDuration: 5,
    description: 'Traditional Pomodoro (25/5)'
  },
  {
    id: 'long',
    name: 'Long',
    focusDuration: 50,
    breakDuration: 10,
    description: 'Extended focus (50/10)'
  },
  {
    id: 'deep',
    name: 'Deep Work',
    focusDuration: 90,
    breakDuration: 15,
    description: 'Deep focus session (90/15)'
  }
];

export class TimerService {
  getPresets(): TimerPreset[] {
    return TIMER_PRESETS;
  }

  getPreset(id: string): TimerPreset | undefined {
    return TIMER_PRESETS.find(preset => preset.id === id);
  }

  getDefaultPreset(): TimerPreset {
    return TIMER_PRESETS[1]; // Classic
  }
}

export const timerService = new TimerService();
