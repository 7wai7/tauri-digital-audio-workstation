import { useEffect } from "react";
import "./App.css";
import NavPanel from "./components/nav-panel/NavPanel";
import Timeline from "./components/timeline/Timeline";
import { useGlobalStore } from "./stores/store";

function App() {

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey;

      if (isCmd && e.key === "c") {
        e.preventDefault();
        useGlobalStore.getState().copySelectedClips();
      }

      if (isCmd && e.key === "v") {
        e.preventDefault();
        useGlobalStore.getState().pasteClips();
      }

      if (e.key === " ") {
        e.preventDefault();
        useGlobalStore.getState().togglePlaying();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="app">
      <NavPanel />
      <Timeline />
    </div>
  );
}

export default App;
