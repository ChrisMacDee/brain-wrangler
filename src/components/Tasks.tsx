import React, { useEffect, useMemo, useState } from "react";
import { liveQuery } from "dexie";
import { db } from "../db";
import type { Task } from "../types";
import { useLiveQuery } from "../hooks/useLiveQuery";

export function Tasks({
  nowTaskId,
  setNowTaskId
}: {
  nowTaskId?: number;
  setNowTaskId: (id?: number) => void;
}) {
  const tasks = useLiveQuery<Task[]>(
    (set) =>
      liveQuery(() => db.tasks.orderBy("updatedAt").reverse().toArray()).subscribe({
        next: set
      }),
    []
  );

  const inbox = useMemo(() => tasks.filter((t) => t.status === "inbox"), [tasks]);
  const today = useMemo(() => tasks.filter((t) => t.status === "today" || t.status === "doing"), [tasks]);
  const done = useMemo(() => tasks.filter((t) => t.status === "done"), [tasks]);

  const [tab, setTab] = useState<"inbox" | "today" | "done">("today");
  const [newTitle, setNewTitle] = useState("");

  const nowTask = useMemo(() => tasks.find((t) => t.id === nowTaskId), [tasks, nowTaskId]);

  useEffect(() => {
    if (nowTaskId && !nowTask) setNowTaskId(undefined);
  }, [nowTaskId, nowTask, setNowTaskId]);

  async function addTask(status: Task["status"]) {
    const title = newTitle.trim();
    if (!title) return;
    const now = Date.now();
    const id = await db.tasks.add({
      title,
      status,
      createdAt: now,
      updatedAt: now
    });
    setNewTitle("");
    if (status === "today") setNowTaskId(id);
  }

  async function move(id: number, status: Task["status"]) {
    await db.tasks.update(id, { status, updatedAt: Date.now() });
    if (status === "doing") setNowTaskId(id);
    if (status === "done" && nowTaskId === id) setNowTaskId(undefined);
  }

  async function quickSplit(id: number) {
    const t = await db.tasks.get(id);
    if (!t) return;
    const now = Date.now();
    const parts = [`Start: ${t.title}`, `Continue: ${t.title}`, `Finish: ${t.title}`];

    await db.transaction("rw", db.tasks, async () => {
      await db.tasks.update(id, { status: "done", updatedAt: now, title: `${t.title} (split)` });
      for (const p of parts) {
        await db.tasks.add({ title: p, status: "today", createdAt: now, updatedAt: now });
      }
    });
  }

  const list = tab === "inbox" ? inbox : tab === "today" ? today : done;

  return (
    <div className="card">
      <div className="row space">
        <h2>Tasks</h2>
        <div className="row gap wrap">
          <button className={tab === "today" ? "pill active" : "pill"} onClick={() => setTab("today")}>
            Today
          </button>
          <button className={tab === "inbox" ? "pill active" : "pill"} onClick={() => setTab("inbox")}>
            Inbox
          </button>
          <button className={tab === "done" ? "pill active" : "pill"} onClick={() => setTab("done")}>
            Done
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="muted">Now</div>
        <div className="row space">
          <strong>{nowTask?.title ?? "Pick one task. Any task."}</strong>
          {nowTaskId && <button onClick={() => setNowTaskId(undefined)}>Clear</button>}
        </div>
      </div>

      <div className="row gap wrap">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Quick add (brain dump welcome)"
        />
        <button onClick={() => addTask("inbox")}>To Inbox</button>
        <button className="primary" onClick={() => addTask("today")}>
          To Today
        </button>
      </div>

      <div className="list">
        {list.map((t) => (
          <div key={t.id} className="item">
            <div className="row space">
              <div>
                <div className="title">{t.title}</div>
                <div className="muted small">{t.status}</div>
              </div>
              <div className="row gap wrap">
                {t.status !== "done" && <button onClick={() => move(t.id!, "doing")}>Now</button>}
                {t.status === "inbox" && <button onClick={() => move(t.id!, "today")}>Today</button>}
                {t.status !== "done" && <button onClick={() => move(t.id!, "done")}>Done</button>}
                {t.status !== "done" && <button onClick={() => quickSplit(t.id!)}>Split</button>}
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="muted">Nothing here. Suspiciously peaceful.</p>}
      </div>
    </div>
  );
}
