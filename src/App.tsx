/**
 * App Component
 * Main application container
 * Orchestrates all feature modules
 */

import React from 'react';
import { useNowTask } from './modules/tasks';
import { TaskManager } from './modules/tasks';
import { PomodoroTimer } from './modules/timer';
import { InterruptionLogger } from './modules/sessions';
import { sessionService } from './modules/sessions';
import { minutesToSeconds } from './shared/utils';
import './App.css';

function App() {
  const { nowTaskId, nowTask, setNowTask } = useNowTask();
  const [activeSessionId, setActiveSessionId] = React.useState<number | null>(null);

  const handleSessionStart = async (
    taskId: number,
    duration: number,
    type: 'focus' | 'break'
  ): Promise<number> => {
    const durationInSeconds = minutesToSeconds(duration);
    const sessionId = await sessionService.startSession(
      taskId || undefined,
      type,
      durationInSeconds
    );
    setActiveSessionId(sessionId);
    return sessionId;
  };

  const handleSessionEnd = async (
    sessionId: number,
    actualDuration: number
  ): Promise<void> => {
    await sessionService.endSession(sessionId, actualDuration);
    setActiveSessionId(null);
  };

  const handleLogInterruption = async (
    category: any,
    note?: string
  ): Promise<void> => {
    if (activeSessionId) {
      await sessionService.addInterruption(activeSessionId, category, note);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🧠 Brain Wrangler</h1>
        <p className="app-subtitle">ADHD-Friendly Pomodoro & Task Manager</p>
      </header>

      <main className="app-main">
        <div className="app-grid">
          <div className="app-section">
            <PomodoroTimer
              nowTaskId={nowTaskId}
              nowTaskTitle={nowTask?.title}
              onSessionStart={handleSessionStart}
              onSessionEnd={handleSessionEnd}
            />

            {activeSessionId && (
              <InterruptionLogger
                sessionId={activeSessionId}
                onLogInterruption={handleLogInterruption}
              />
            )}
          </div>

          <div className="app-section">
            <TaskManager
              nowTaskId={nowTaskId}
              onSetNowTask={setNowTask}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Built for focus, designed with compassion</p>
      </footer>
    </div>
  );
}

export default App;
