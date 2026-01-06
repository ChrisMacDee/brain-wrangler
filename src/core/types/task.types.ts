/**
 * Task Module Types
 * Defines all task-related data structures
 */

export type TaskStatus = 'inbox' | 'today' | 'doing' | 'done';
export type TaskEffort = 'low' | 'medium' | 'high';

export interface Task {
  id?: number;
  title: string;
  notes?: string;
  status: TaskStatus;
  effort?: TaskEffort;
  estimatedPomodoros?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface TaskFilters {
  status?: TaskStatus;
  effort?: TaskEffort;
  search?: string;
}

export interface TaskFormData {
  title: string;
  notes?: string;
  effort?: TaskEffort;
  estimatedPomodoros?: number;
}
