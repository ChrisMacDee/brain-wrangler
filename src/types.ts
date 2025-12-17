export type TaskStatus = "inbox" | "today" | "doing" | "done";

export type Task = {
  id?: number;
  title: string;
  notes?: string;
  status: TaskStatus;
  effort?: "low" | "med" | "high";
  estimatePoms?: number;
  createdAt: number;
  updatedAt: number;
};

export type Session = {
  id?: number;
  taskId?: number;
  type: "focus" | "break";
  plannedMin: number;
  actualMin: number;
  startedAt: number;
  endedAt: number;
  interruptions: number;
};

export type Interruption = {
  id?: number;
  sessionId?: number;
  at: number;
  category: "thought" | "notification" | "person" | "urgent" | "bored";
  note?: string;
};
