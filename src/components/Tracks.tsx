import { useGlobalStore } from "../stores/store";
import AudioTrack from "./audio-track/AudioTrack";

export default function Tracks() {
    const trackIds = useGlobalStore(s => s.trackOrder);

    return (
        <>
            {trackIds.map(id => <AudioTrack key={id} id={id} />)}
        </>
    )
}