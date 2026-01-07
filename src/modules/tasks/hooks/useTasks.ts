/**
 * useTasks Hook
 * Reactive hook for task management
 */

import { useLiveQuery } from '../../../shared/hooks';
import { db } from '../../../core/db';
import { Task, TaskStatus } from '../../../core/types';
import { taskService } from '../services';

export function useTasks(status?: TaskStatus) {
  const tasks = useLiveQuery<Task[]>(
    () => {
      if (status) {
        return db.tasks.where('status').equals(status).reverse().toArray();
      }
      return db.tasks.reverse().toArray();
    },
    [status]
  );

  return {
    tasks: tasks || [],
    service: taskService
  };
}
