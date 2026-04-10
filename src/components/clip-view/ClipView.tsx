import { TIMELINE_OFFSET, TRACK_HEIGHT } from "../../constants";
import { useGlobalStore } from "../../stores/store";
import "./ClipView.css";
import { useClipDragStore } from "../../stores/clipDragStore";

export default function ClipView({ id }: { id: string }) {
    const clip = useGlobalStore(s => s.clips[id]);
    const zoom = useGlobalStore(s => s.zoom);
    const startDrag = useClipDragStore(s => s.startDrag);
    const trackOrder = useGlobalStore(s => s.trackOrder);

    return (
        <div
            className="clip"
            style={{
                position: "absolute",
                left: (TIMELINE_OFFSET + clip.start) * zoom,
                width: clip.duration * zoom,
                height: TRACK_HEIGHT,
            }}
            onPointerDown={(e) => {
                e.stopPropagation();

                startDrag({
                    clipId: id,
                    startX: e.clientX,
                    startY: e.clientY,
                    originalStart: clip.start,
                    originalTrackIndex: trackOrder.indexOf(clip.trackId),
                });

                e.currentTarget.setPointerCapture(e.pointerId);
            }}
        />
    );
}