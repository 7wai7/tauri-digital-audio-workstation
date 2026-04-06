import { useStore } from "../../store";

export default function Playhead() {
    const zoom = useStore(s => s.zoom);
    const currentTime = useStore(s => s.currentTime);

    return (
        <div
            className="playhead"
            style={{
                left: currentTime * zoom,
            }}
        />
    );
}