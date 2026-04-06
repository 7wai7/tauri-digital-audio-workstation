import { useStore } from "../../store";
import "./ClipView.css"

export default function ClipView({ id }: { id: string }) {
    const clip = useStore(s => s.clips[id]);
    const zoom = useStore(s => s.zoom);

    return (
        <div
            className="clip"
            style={{
                position: "absolute",
                left: clip.start * zoom,
                width: clip.duration * zoom,
            }}
        />
    );
}