import React, { useEffect, useMemo, useRef, useState } from "react";
import { db } from "../db";
import type { Interruption } from "../types";

type Mode = "focus" | "break";

const PRESETS = [
  { label: "Short Sprint 10/2", focus: 10, brk: 2 },
  { label: "Classic 25/5", focus: 25, brk: 5 },
  { label: "Long 50/10", focus: 50, brk: 10 },
  { label: "Deep 90/15", focus: 90, brk: 15 }
];

function fmt(sec: number) {
  const s = Math.max(0, sec);
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${ss.toString().padStart(2, "0")}`;
}

export function Timer({
  nowTaskId,
  onNeedPickNow
}: {
  nowTaskId?: number;
  onNeedPickNow: () => void;
}) {
  const [presetIdx, setPresetIdx] = useState(1);
  const preset = PRESETS[presetIdx];

  const [mode, setMode] = useState<Mode>("focus");
  const [isRunning, setIsRunning] = useState(false);

  const [targetSec, setTargetSec] = useState(preset.focus * 60);
  const [remainingSec, setRemainingSec] = useState(preset.focus * 60);

  const [activeSessionId, setActiveSessionId] = useState<number | undefined>();
  const [interruptions, setInterruptions] = useState(0);

  const tickRef = useRef<number | null>(null);
  const lastTickAt = useRef<number>(Date.now());

  const isFocus = mode === "focus";

  useEffect(() => {
    const next = mode === "focus" ? preset.focus * 60 : preset.brk * 60;
    setTargetSec(next);
    setRemainingSec(next);
    setIsRunning(false);
    setActiveSessionId(undefined);
    setInterruptions(0);
  }, [presetIdx, mode]);

  const title = useMemo(() => (isFocus ? "Focus" : "Break"), [isFocus]);

  async function start() {
    if (isFocus && !nowTaskId) {
      onNeedPickNow();
      return;
    }
    const plannedMin = isFocus ? preset.focus : preset.brk;
    const startedAt = Date.now();
    const id = await db.sessions.add({
      taskId: isFocus ? nowTaskId : undefined,
      type: isFocus ? "focus" : "break",
      plannedMin,
      actualMin: 0,
      startedAt,
      endedAt: startedAt,
      interruptions: 0
    });

    setActiveSessionId(id);
    setInterruptions(0);
    setIsRunning(true);
    lastTickAt.current = Date.now();
  }

  async function stopAndSave(endedAt: number, completed: boolean) {
    if (!activeSessionId) return;
    const session = await db.sessions.get(activeSessionId);
    if (!session) return;

    const actualMin = Math.max(0, Math.round((endedAt - session.startedAt) / 60000));
    await db.sessions.update(activeSessionId, {
      endedAt,
      actualMin,
      interruptions
    });

    setIsRunning(false);
    setActiveSessionId(undefined);
    setInterruptions(0);

    if (completed) {
      setMode((m) => (m === "focus" ? "break" : "focus"));
    }
  }

  function pause() {
    setIsRunning(false);
  }

  async function endSession() {
    await stopAndSave(Date.now(), false);
    setRemainingSec(targetSec);
  }

  async function completeAndSwitch() {
    await stopAndSave(Date.now(), true);
  }

  function extend(minutes: number) {
    setRemainingSec((r) => r + minutes * 60);
    setTargetSec((t) => t + minutes * 60);
    setIsRunning(true);
  }

  async function logInterruption(category: Interruption["category"], note?: string) {
    if (!activeSessionId) return;
    await db.interruptions.add({
      sessionId: activeSessionId,
      at: Date.now(),
      category,
      note
    });
    setInterruptions((n) => n + 1);
  }

  useEffect(() => {
    if (!isRunning) {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
      return;
    }

    tickRef.current = window.setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - lastTickAt.current;
      if (elapsedMs < 800) return;
      lastTickAt.current = now;

      setRemainingSec((r) => r - Math.floor(elapsedMs / 1000));
    }, 250);

    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;
    if (remainingSec > 0) return;
    setIsRunning(false);
    setRemainingSec(0);
  }, [remainingSec, isRunning]);

  return (
    <div className="card">
      <div className="row space">
        <h2>{title}</h2>
        <select value={presetIdx} onChange={(e) => setPresetIdx(Number(e.target.value))}>
          {PRESETS.map((p, i) => (
            <option key={p.label} value={i}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="timer">{fmt(remainingSec)}</div>

      <div className="row gap wrap">
        {!isRunning && remainingSec === targetSec && (
          <button className="primary" onClick={start}>Start</button>
        )}
        {isRunning && <button onClick={pause}>Pause</button>}
        {!isRunning && remainingSec !== targetSec && remainingSec > 0 && (
          <button className="primary" onClick={() => setIsRunning(true)}>Resume</button>
        )}
        <button onClick={endSession}>End</button>
      </div>

      {remainingSec === 0 && (
        <div className="panel">
          <div className="row gap wrap">
            <button className="primary" onClick={completeAndSwitch}>
              Switch to {isFocus ? "Break" : "Focus"}
            </button>
            <button onClick={() => extend(5)}>Keep going +5</button>
            <button onClick={() => extend(10)}>Keep going +10</button>
            <button onClick={() => setRemainingSec(targetSec)}>Reset</button>
          </div>
          <p className="muted">No judgment. If you’re in flow, ride it.</p>
        </div>
      )}

      {isRunning && activeSessionId && (
        <div className="panel">
          <div className="row space">
            <strong>Derailments: {interruptions}</strong>
            <div className="row gap wrap">
              <button onClick={() => logInterruption("thought")}>Thought</button>
              <button onClick={() => logInterruption("notification")}>Notif</button>
              <button onClick={() => logInterruption("person")}>Person</button>
              <button onClick={() => logInterruption("urgent")}>Urgent</button>
              <button onClick={() => logInterruption("bored")}>Bored</button>
            </div>
          </div>
          <p className="muted">Tap once, capture it, move on.</p>
        </div>
      )}
    </div>
  );
}
