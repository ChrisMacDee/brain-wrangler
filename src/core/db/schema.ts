/**
 * Database Schema
 * Defines the structure of IndexedDB tables using Dexie
 */

import Dexie, { Table } from 'dexie';
import { Task, Session, Interruption } from '../types';

export class BrainWranglerDatabase extends Dexie {
  tasks!: Table<Task, number>;
  sessions!: Table<Session, number>;
  interruptions!: Table<Interruption, number>;

  constructor() {
    super('BrainWranglerDB');

    this.version(1).stores({
      tasks: '++id, status, createdAt, completedAt',
      sessions: '++id, taskId, type, startedAt, endedAt',
      interruptions: '++id, sessionId, category, timestamp'
    });
  }
}

export const db = new BrainWranglerDatabase();
