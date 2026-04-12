import { useRef } from "react";
import { TIMELINE_OFFSET, TRACK_HEIGHT } from "../../constants";
import { useGlobalStore } from "../../stores/store";
import "./ClipView.css";
import { useClipDragStore } from "../../stores/clipDragStore";

export default function ClipView({ id }: { id: string }) {
    const clip = useGlobalStore(s => s.clips[id]);
    const zoom = useGlobalStore(s => s.zoom);
    const startDrag = useClipDragStore(s => s.startDrag);
    const selectedClipsIds = useGlobalStore(s => s.selectedClipsIds);
    const selectOnlyClip = useGlobalStore(s => s.selectOnlyClip);
    const deselectClip = useGlobalStore(s => s.deselectClip);
    const toggleClip = useGlobalStore(s => s.toggleClip);
    const trackOrder = useGlobalStore(s => s.trackOrder);

    const selected = selectedClipsIds.has(id);
    const pointerInfoRef = useRef<{ shiftKey: boolean }>({ shiftKey: false });

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);

        pointerInfoRef.current.shiftKey = e.shiftKey;

        const store = useGlobalStore.getState();
        const selectedIds = Array.from(store.selectedClipsIds);

        const items = selectedIds.map(clipId => {
            const c = store.clips[clipId];
            return {
                clipId,
                originalStart: c.start,
                originalTrackIndex: trackOrder.indexOf(c.trackId),
            };
        });

        startDrag({
            anchorClipId: id,
            startX: e.clientX,
            startY: e.clientY,
            items,
        });
    };

    const onPointerUp = () => {
        const preview = useClipDragStore.getState().preview;

        if (preview) return;

        if (pointerInfoRef.current.shiftKey) {
            toggleClip(id);
            return;
        }

        if (selected) {
            if (selectedClipsIds.size > 1) selectOnlyClip(id);
            else deselectClip(id);
        } else {
            selectOnlyClip(id);
        }
    };

    return (
        <div
            className={`clip ${selected ? "selected" : ""}`}
            style={{
                position: "absolute",
                left: (TIMELINE_OFFSET + clip.start) * zoom,
                width: clip.duration * zoom,
                height: TRACK_HEIGHT,
            }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
        >
            <div className="clip-content">
                <span className="clip-title">
                    {clip.filePath.split("/").pop()}
                </span>
            </div>
        </div>
    );
}