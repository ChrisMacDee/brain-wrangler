/**
 * TaskForm Component
 * Form for creating new tasks
 */

import React, { useState } from 'react';
import { TaskFormData, TaskEffort } from '../../../core/types';
import { Button } from '../../../shared/components';
import './TaskForm.css';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  placeholder?: string;
}

export function TaskForm({ onSubmit, placeholder = 'Add a task...' }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [effort, setEffort] = useState<TaskEffort | ''>('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      notes: notes.trim() || undefined,
      effort: effort || undefined,
      estimatedPomodoros: estimatedPomodoros ? parseInt(estimatedPomodoros) : undefined
    });

    setTitle('');
    setNotes('');
    setEffort('');
    setEstimatedPomodoros('');
    setShowDetails(false);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-main">
        <input
          type="text"
          className="task-form-input"
          placeholder={placeholder}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit" disabled={!title.trim()}>
          Add
        </Button>
      </div>

      {!showDetails && title && (
        <Button
          type="button"
          variant="ghost"
          size="small"
          onClick={() => setShowDetails(true)}
        >
          + Add details
        </Button>
      )}

      {showDetails && (
        <div className="task-form-details">
          <textarea
            className="task-form-textarea"
            placeholder="Notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />

          <div className="task-form-row">
            <div className="task-form-field">
              <label className="task-form-label">Effort</label>
              <select
                className="task-form-select"
                value={effort}
                onChange={(e) => setEffort(e.target.value as TaskEffort | '')}
              >
                <option value="">Select...</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="task-form-field">
              <label className="task-form-label">Pomodoros</label>
              <input
                type="number"
                className="task-form-input-small"
                placeholder="0"
                value={estimatedPomodoros}
                onChange={(e) => setEstimatedPomodoros(e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
