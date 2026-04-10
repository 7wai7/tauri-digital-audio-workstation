import { TIMELINE_OFFSET, TRACK_HEIGHT } from "../../constants";
import { useClipDragStore } from "../../stores/clipDragStore";
import { useGlobalStore } from "../../stores/store";

export default function ClipDragOverlay() {
    const drag = useClipDragStore(s => s.drag);
    const preview = useClipDragStore(s => s.preview);
    const zoom = useGlobalStore(s => s.zoom);
    const clips = useGlobalStore(s => s.clips);

    if (!drag || !preview) return null;

    return (
        <>
            {preview.map(item => {
                const clip = clips[item.clipId];

                return (
                    <div
                        key={item.clipId}
                        className="clip ghost"
                        style={{
                            position: "absolute",
                            width: clip.duration * zoom,
                            height: TRACK_HEIGHT,
                            transform: `translate(${(TIMELINE_OFFSET + item.start) * zoom}px, ${item.trackIndex * TRACK_HEIGHT}px)`
                        }}
                    />
                );
            })}
        </>
    );
}