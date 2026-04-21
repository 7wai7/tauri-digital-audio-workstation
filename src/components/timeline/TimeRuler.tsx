import { useMemo, useState } from "react";
import { useGlobalStore } from "../../stores/store";
import { generateMarks } from "../../utils";
import { TIMELINE_OFFSET } from "../../constants";
import { audioEngine } from "../../services/AudioEngine";

interface Props {
    timelineRef: React.RefObject<HTMLDivElement | null>
}

export default function TimeRuler({ timelineRef }: Props) {
    const zoom = useGlobalStore(s => s.zoom);
    const duration = useGlobalStore(s => s.duration);
    const setCurrentTime = useGlobalStore(s => s.setCurrentTime);

    const [isDragging, setIsDragging] = useState(false);

    const step = zoom < 40 ? 5 : zoom < 80 ? 2 : 1;

    const marks = useMemo(
        () => generateMarks(duration, step),
        [duration, step]
    );

    return (
        <div
            className="time-ruler"
            style={{
                backgroundSize: `${zoom}px 40%, ${zoom * 5}px 70%`,
                backgroundPosition: `0 100%, 0 100%`,
                backgroundRepeat: `repeat-x`
            }}
            onPointerDown={(e) => {
                setIsDragging(true);
                e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
                if (!isDragging || !timelineRef.current) return;

                const rect = timelineRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
                const time = x / zoom - TIMELINE_OFFSET;

                setCurrentTime(time);

                if (useGlobalStore.getState().isPlaying) {
                    audioEngine.seek(
                        Object.values(useGlobalStore.getState().clips),
                        time
                    );
                }
            }}
            onPointerUp={() => setIsDragging(false)}
        >
            {marks.map((t) => (
                <div
                    key={t}
                    className="time-mark"
                    style={{ left: t * zoom + TIMELINE_OFFSET * zoom }}
                >
                    {t}
                </div>
            ))}
        </div>
    );
}
