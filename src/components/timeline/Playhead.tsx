import { useState } from "react";
import { useGlobalStore } from "../../stores/store";
import { TIMELINE_OFFSET } from "../../constants";

interface Props {
    timelineRef: React.RefObject<HTMLDivElement | null>
}

export default function Playhead({ timelineRef }: Props) {
    const zoom = useGlobalStore(s => s.zoom);
    const currentTime = useGlobalStore(s => s.currentTime);
    const setCurrentTime = useGlobalStore(s => s.setCurrentTime);
    const [isDragging, setIsDragging] = useState(false);

    console.log(currentTime)

    return (
        <div
            ref={timelineRef}
            className="playhead"
            style={{
                left: (currentTime + TIMELINE_OFFSET) * zoom,
            }}
            onPointerDown={(e) => {
                setIsDragging(true);
                e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
                if (!isDragging || !timelineRef.current) return;

                const rect = timelineRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left + timelineRef.current.scrollLeft;

                setCurrentTime(x / zoom - TIMELINE_OFFSET);
            }}
            onPointerUp={() => setIsDragging(false)}
        >
            <div className="playhead-visible" />
        </div>
    );
}