/**
 * InterruptionLogger Component
 * Interface for logging interruptions during a session
 */

import React, { useState } from 'react';
import { InterruptionCategory } from '../../../core/types';
import { Button } from '../../../shared/components';
import './InterruptionLogger.css';

interface InterruptionLoggerProps {
  sessionId: number;
  onLogInterruption: (category: InterruptionCategory, note?: string) => void;
}

const INTERRUPTION_TYPES: { category: InterruptionCategory; label: string; icon: string }[] = [
  { category: 'thought', label: 'Thought', icon: '💭' },
  { category: 'notification', label: 'Notification', icon: '🔔' },
  { category: 'person', label: 'Person', icon: '👤' },
  { category: 'urgent', label: 'Urgent', icon: '🚨' },
  { category: 'bored', label: 'Bored', icon: '😴' }
];

export function InterruptionLogger({ sessionId, onLogInterruption }: InterruptionLoggerProps) {
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<InterruptionCategory | null>(null);

  const handleQuickLog = (category: InterruptionCategory) => {
    onLogInterruption(category);
  };

  const handleLogWithNote = () => {
    if (selectedCategory) {
      onLogInterruption(selectedCategory, note || undefined);
      setNote('');
      setShowNoteInput(false);
      setSelectedCategory(null);
    }
  };

  return (
    <div className="interruption-logger">
      <h3 className="interruption-logger-title">Log Interruption</h3>

      <div className="interruption-buttons">
        {INTERRUPTION_TYPES.map(({ category, label, icon }) => (
          <button
            key={category}
            className="interruption-button"
            onClick={() => handleQuickLog(category)}
          >
            <span className="interruption-icon">{icon}</span>
            <span className="interruption-label">{label}</span>
          </button>
        ))}
      </div>

      {!showNoteInput && (
        <Button
          variant="ghost"
          size="small"
          fullWidth
          onClick={() => setShowNoteInput(true)}
        >
          + Add note
        </Button>
      )}

      {showNoteInput && (
        <div className="interruption-note-input">
          <select
            className="interruption-select"
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value as InterruptionCategory)}
          >
            <option value="">Select type...</option>
            {INTERRUPTION_TYPES.map(({ category, label }) => (
              <option key={category} value={category}>
                {label}
              </option>
            ))}
          </select>

          <textarea
            className="interruption-textarea"
            placeholder="What happened?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />

          <div className="interruption-note-actions">
            <Button
              size="small"
              onClick={handleLogWithNote}
              disabled={!selectedCategory}
            >
              Log
            </Button>
            <Button
              size="small"
              variant="ghost"
              onClick={() => {
                setShowNoteInput(false);
                setNote('');
                setSelectedCategory(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
