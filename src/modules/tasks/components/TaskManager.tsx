/**
 * TaskManager Component
 * Main task management interface with tabs
 */

import React, { useState } from 'react';
import { TaskStatus } from '../../../core/types';
import { Card, Button } from '../../../shared/components';
import { useTasks } from '../hooks';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';
import './TaskManager.css';

interface TaskManagerProps {
  nowTaskId?: number | null;
  onSetNowTask?: (taskId: number) => void;
}

type TabType = 'inbox' | 'today' | 'doing' | 'done';

export function TaskManager({ nowTaskId, onSetNowTask }: TaskManagerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('today');

  const inbox = useTasks('inbox');
  const today = useTasks('today');
  const doing = useTasks('doing');
  const done = useTasks('done');

  const getCurrentTasks = () => {
    switch (activeTab) {
      case 'inbox':
        return inbox;
      case 'today':
        return today;
      case 'doing':
        return doing;
      case 'done':
        return done;
    }
  };

  const { tasks, service } = getCurrentTasks();

  const handleAddTask = async (data: any) => {
    const status: TaskStatus = activeTab === 'done' ? 'inbox' : activeTab;
    await service.createTask(data, status);
  };

  const handleSplit = async (taskId: number) => {
    if (confirm('Split this task into 3 subtasks: Start, Continue, Finish?')) {
      await service.splitTask(taskId);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (confirm('Delete this task?')) {
      await service.deleteTask(taskId);
    }
  };

  return (
    <Card>
      <div className="task-manager">
        <div className="task-manager-header">
          <h2 className="task-manager-title">Tasks</h2>
          <div className="task-manager-tabs">
            <button
              className={`task-tab ${activeTab === 'inbox' ? 'task-tab-active' : ''}`}
              onClick={() => setActiveTab('inbox')}
            >
              Inbox ({inbox.tasks.length})
            </button>
            <button
              className={`task-tab ${activeTab === 'today' ? 'task-tab-active' : ''}`}
              onClick={() => setActiveTab('today')}
            >
              Today ({today.tasks.length})
            </button>
            <button
              className={`task-tab ${activeTab === 'doing' ? 'task-tab-active' : ''}`}
              onClick={() => setActiveTab('doing')}
            >
              Doing ({doing.tasks.length})
            </button>
            <button
              className={`task-tab ${activeTab === 'done' ? 'task-tab-active' : ''}`}
              onClick={() => setActiveTab('done')}
            >
              Done ({done.tasks.length})
            </button>
          </div>
        </div>

        {activeTab !== 'done' && (
          <TaskForm
            onSubmit={handleAddTask}
            placeholder={`Add to ${activeTab}...`}
          />
        )}

        <TaskList
          tasks={tasks}
          nowTaskId={nowTaskId}
          emptyMessage={`No ${activeTab} tasks`}
          onSetNowTask={onSetNowTask}
          onMoveToToday={activeTab === 'inbox' ? service.moveTaskToToday : undefined}
          onMoveToDoing={activeTab === 'today' ? service.moveTaskToDoing : undefined}
          onMarkDone={activeTab !== 'done' ? service.markTaskDone : undefined}
          onSplit={activeTab !== 'done' ? handleSplit : undefined}
          onDelete={handleDelete}
        />
      </div>
    </Card>
  );
}
