/**
 * TaskList Component
 * Displays a list of tasks
 */

import React from 'react';
import { Task } from '../../../core/types';
import { TaskItem } from './TaskItem';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  nowTaskId?: number | null;
  emptyMessage?: string;
  onSetNowTask?: (taskId: number) => void;
  onMoveToToday?: (taskId: number) => void;
  onMoveToDoing?: (taskId: number) => void;
  onMarkDone?: (taskId: number) => void;
  onSplit?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
}

export function TaskList({
  tasks,
  nowTaskId,
  emptyMessage = 'No tasks yet',
  onSetNowTask,
  onMoveToToday,
  onMoveToDoing,
  onMarkDone,
  onSplit,
  onDelete
}: TaskListProps) {
  if (tasks.length === 0) {
    return <div className="task-list-empty">{emptyMessage}</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isNowTask={task.id === nowTaskId}
          onSetNowTask={onSetNowTask}
          onMoveToToday={onMoveToToday}
          onMoveToDoing={onMoveToDoing}
          onMarkDone={onMarkDone}
          onSplit={onSplit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
