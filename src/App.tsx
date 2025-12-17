import { useEffect, useState } from "react";
import { Timer } from "./components/Timer";
import { Tasks } from "./components/Tasks";
import "./styles.css";

const NOW_KEY = "bw_now_task_id";

export default function App() {
  const [nowTaskId, setNowTaskIdState] = useState<number | undefined>(() => {
    const raw = localStorage.getItem(NOW_KEY);
    return raw ? Number(raw) : undefined;
  });

  function setNowTaskId(id?: number) {
    setNowTaskIdState(id);
    if (id) localStorage.setItem(NOW_KEY, String(id));
    else localStorage.removeItem(NOW_KEY);
  }

  useEffect(() => {
    document.title = "Brain Wrangler";
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>🧠 Brain Wrangler</h1>
        <span className="muted">Pomodoro + tasks, designed to forgive you.</span>
      </header>

      <main className="grid">
        <Timer nowTaskId={nowTaskId} onNeedPickNow={() => alert("Pick a ‘Now’ task first (2 taps max, promise).")} />
        <Tasks nowTaskId={nowTaskId} setNowTaskId={setNowTaskId} />
      </main>

      <footer className="footer muted">
        iPhone: Safari → Share → <strong>Add to Home Screen</strong>.
      </footer>
    </div>
  );
}
