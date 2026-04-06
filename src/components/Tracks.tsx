import { useStore } from "../store";
import AudioTrack from "./audio-track/AudioTrack";

export default function Tracks() {
    const trackIds = useStore(s => s.trackOrder);

    return (
        <>
            {trackIds.map(id => <AudioTrack key={id} id={id} />)}
        </>
    )
}