import { useState } from "react";
import { Timer } from "./components/Timer";
import { Tasks } from "./components/Tasks";

export default function App() {
  const [nowTaskId, setNowTaskId] = useState<number | undefined>();

  return (
    <div className="app">
      <h1>🧠 Brain Wrangler</h1>
      <Timer nowTaskId={nowTaskId} onNeedPickNow={() => alert("Pick a task to wrangle first.")} />
      <Tasks nowTaskId={nowTaskId} setNowTaskId={setNowTaskId} />
    </div>
  );
}