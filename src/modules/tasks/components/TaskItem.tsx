/**
 * TaskItem Component
 * Displays a single task with actions
 */

import React from 'react';
import { Task } from '../../../core/types';
import { Button } from '../../../shared/components';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  isNowTask?: boolean;
  onSetNowTask?: (taskId: number) => void;
  onMoveToToday?: (taskId: number) => void;
  onMoveToDoing?: (taskId: number) => void;
  onMarkDone?: (taskId: number) => void;
  onSplit?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
}

export function TaskItem({
  task,
  isNowTask = false,
  onSetNowTask,
  onMoveToToday,
  onMoveToDoing,
  onMarkDone,
  onSplit,
  onDelete
}: TaskItemProps) {
  return (
    <div className={`task-item ${isNowTask ? 'task-item-now' : ''}`}>
      <div className="task-item-header">
        <h3 className="task-item-title">{task.title}</h3>
        {task.effort && (
          <span className={`task-effort task-effort-${task.effort}`}>
            {task.effort}
          </span>
        )}
      </div>

      {task.notes && <p className="task-item-notes">{task.notes}</p>}

      {task.estimatedPomodoros && (
        <div className="task-item-meta">
          <span>🍅 {task.estimatedPomodoros} pomodoros</span>
        </div>
      )}

      <div className="task-item-actions">
        {task.status === 'inbox' && onMoveToToday && (
          <Button
            size="small"
            variant="ghost"
            onClick={() => onMoveToToday(task.id!)}
          >
            → Today
          </Button>
        )}

        {task.status === 'today' && onMoveToDoing && (
          <Button
            size="small"
            variant="ghost"
            onClick={() => onMoveToDoing(task.id!)}
          >
            → Doing
          </Button>
        )}

        {task.status !== 'done' && onSetNowTask && !isNowTask && (
          <Button
            size="small"
            variant="primary"
            onClick={() => onSetNowTask(task.id!)}
          >
            Set as Now
          </Button>
        )}

        {task.status !== 'done' && onMarkDone && (
          <Button
            size="small"
            variant="secondary"
            onClick={() => onMarkDone(task.id!)}
          >
            Done
          </Button>
        )}

        {task.status !== 'done' && onSplit && (
          <Button
            size="small"
            variant="ghost"
            onClick={() => onSplit(task.id!)}
          >
            Split
          </Button>
        )}

        {onDelete && (
          <Button
            size="small"
            variant="danger"
            onClick={() => onDelete(task.id!)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
