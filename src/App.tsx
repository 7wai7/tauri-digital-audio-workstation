import "./App.css";
import AudioTrack from "./components/audio-track/AudioTrack";
import NavPanel from "./components/nav-panel/NavPanel";
import { useStore } from "./store";

function App() {
  const trackIds = useStore(s => s.trackOrder);

  return (
    <>
      <NavPanel />
      <main className="audio-tracks-container">
        {trackIds.map(id => <AudioTrack key={id} id={id}/>)}
      </main>
    </>
  );
}

export default App;
