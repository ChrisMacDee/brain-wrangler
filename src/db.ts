import Dexie, { Table } from "dexie";
import type { Task, Session, Interruption } from "./types";

class AppDB extends Dexie {
  tasks!: Table<Task, number>;
  sessions!: Table<Session, number>;
  interruptions!: Table<Interruption, number>;

  constructor() {
    super("brain_wrangler_db");
    this.version(1).stores({
      tasks: "++id,status,createdAt,updatedAt",
      sessions: "++id,taskId,type,startedAt,endedAt",
      interruptions: "++id,sessionId,at,category"
    });
  }
}

export const db = new AppDB();
