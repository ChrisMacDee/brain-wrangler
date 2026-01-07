/**
 * Task Service
 * Business logic for task management
 * Decoupled from UI - can be used in any context
 */

import { db } from '../../../core/db';
import { Task, TaskStatus, TaskFormData } from '../../../core/types';

export class TaskService {
  async createTask(data: TaskFormData, status: TaskStatus = 'inbox'): Promise<number> {
    const task: Task = {
      ...data,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await db.tasks.add(task);
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<void> {
    await db.tasks.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  }

  async deleteTask(id: number): Promise<void> {
    await db.tasks.delete(id);
  }

  async changeTaskStatus(id: number, status: TaskStatus): Promise<void> {
    const updates: Partial<Task> = {
      status,
      updatedAt: new Date()
    };

    if (status === 'done') {
      updates.completedAt = new Date();
    }

    await db.tasks.update(id, updates);
  }

  async moveTaskToToday(id: number): Promise<void> {
    await this.changeTaskStatus(id, 'today');
  }

  async moveTaskToDoing(id: number): Promise<void> {
    await this.changeTaskStatus(id, 'doing');
  }

  async markTaskDone(id: number): Promise<void> {
    await this.changeTaskStatus(id, 'done');
  }

  async splitTask(id: number): Promise<number[]> {
    const task = await db.tasks.get(id);
    if (!task) throw new Error('Task not found');

    const subtaskIds: number[] = [];

    const subtasks = [
      { title: `Start: ${task.title}`, notes: 'Initial steps and setup' },
      { title: `Continue: ${task.title}`, notes: 'Main work and progress' },
      { title: `Finish: ${task.title}`, notes: 'Final touches and completion' }
    ];

    for (const subtask of subtasks) {
      const id = await this.createTask(
        {
          ...subtask,
          effort: task.effort,
          estimatedPomodoros: task.estimatedPomodoros
            ? Math.ceil(task.estimatedPomodoros / 3)
            : undefined
        },
        task.status
      );
      subtaskIds.push(id);
    }

    await this.deleteTask(id);
    return subtaskIds;
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    return await db.tasks.where('status').equals(status).reverse().toArray();
  }

  async getAllTasks(): Promise<Task[]> {
    return await db.tasks.reverse().toArray();
  }

  async getTask(id: number): Promise<Task | undefined> {
    return await db.tasks.get(id);
  }
}

export const taskService = new TaskService();
