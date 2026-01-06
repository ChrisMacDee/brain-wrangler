/**
 * useNowTask Hook
 * Manages the current "now" task (task being actively worked on)
 */

import { useState, useEffect } from 'react';
import { useLiveQuery } from '../../../shared/hooks';
import { db } from '../../../core/db';
import { Task } from '../../../core/types';
import { getStorageItem, setStorageItem, removeStorageItem } from '../../../shared/utils';

const NOW_TASK_STORAGE_KEY = 'brain-wrangler-now-task-id';

export function useNowTask() {
  const [nowTaskId, setNowTaskId] = useState<number | null>(() => {
    return getStorageItem<number>(NOW_TASK_STORAGE_KEY);
  });

  const nowTask = useLiveQuery<Task | undefined>(
    () => nowTaskId ? db.tasks.get(nowTaskId) : undefined,
    [nowTaskId]
  );

  useEffect(() => {
    if (nowTaskId !== null) {
      setStorageItem(NOW_TASK_STORAGE_KEY, nowTaskId);
    } else {
      removeStorageItem(NOW_TASK_STORAGE_KEY);
    }
  }, [nowTaskId]);

  const setNowTask = (taskId: number | null) => {
    setNowTaskId(taskId);
  };

  const clearNowTask = () => {
    setNowTaskId(null);
  };

  return {
    nowTaskId,
    nowTask,
    setNowTask,
    clearNowTask
  };
}
