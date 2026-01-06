/**
 * PresetSelector Component
 * Allows selection of timer presets
 */

import React from 'react';
import { TimerPreset } from '../../../core/types';
import './PresetSelector.css';

interface PresetSelectorProps {
  presets: TimerPreset[];
  selectedPreset: TimerPreset;
  onSelectPreset: (preset: TimerPreset) => void;
  disabled?: boolean;
}

export function PresetSelector({
  presets,
  selectedPreset,
  onSelectPreset,
  disabled = false
}: PresetSelectorProps) {
  return (
    <div className="preset-selector">
      <label className="preset-selector-label">Timer Preset</label>
      <div className="preset-selector-grid">
        {presets.map((preset) => (
          <button
            key={preset.id}
            className={`preset-button ${
              preset.id === selectedPreset.id ? 'preset-button-active' : ''
            }`}
            onClick={() => onSelectPreset(preset)}
            disabled={disabled}
          >
            <div className="preset-button-name">{preset.name}</div>
            <div className="preset-button-duration">
              {preset.focusDuration}/{preset.breakDuration}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
