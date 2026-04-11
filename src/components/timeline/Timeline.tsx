import { useRef } from "react";
import Tracks from "../Tracks"
import Playhead from "./Playhead"
import "./Timeline.css"
import TimeRuler from "./TimeRuler"
import { useGlobalStore } from "../../stores/store";
import { TIMELINE_OFFSET } from "../../constants";
import { useClipDragStore } from "../../stores/clipDragStore";
import ClipDragOverlay from "../clip-view/ClipDragOverlay";

export default function Timeline() {
    const duration = useGlobalStore(s => s.duration);
    const zoom = useGlobalStore(s => s.zoom);
    const timelineRef = useRef<HTMLDivElement>(null);
    const updateDrag = useClipDragStore(s => s.updateDrag);
    const endDrag = useClipDragStore(s => s.endDrag);

    return (
        <div
            className="timeline-wrapper"
            onPointerDown={(e) => {
                if (!(e.target as HTMLElement).closest(".clip")) {
                    useGlobalStore.getState().clearSelectedClips();
                }
            }}
            onPointerMove={(e) => {
                if (!timelineRef.current) return;

                const drag = useClipDragStore.getState().drag;
                if (!drag) return;

                const dx = e.clientX - drag.startX;
                const dy = e.clientY - drag.startY;

                if (Math.hypot(dx, dy) < 5) return;

                updateDrag(
                    e.clientX,
                    e.clientY,
                    timelineRef.current.getBoundingClientRect(),
                    timelineRef.current.scrollTop
                );
            }}
            onPointerUp={() => endDrag()}
        >
            <div className="timeline-scroll">
                <div
                    className="timeline-content"
                    ref={timelineRef}
                    style={{
                        minWidth: `${(duration + TIMELINE_OFFSET * 2) * zoom}px`
                    }}
                >
                    <TimeRuler timelineRef={timelineRef} />
                    <Playhead timelineRef={timelineRef} />
                    <ClipDragOverlay />
                    <Tracks />
                </div>
            </div>
        </div>
    )
}