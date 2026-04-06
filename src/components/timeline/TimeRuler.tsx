import { useMemo, useState } from "react";
import { useStore } from "../../store";
import { generateMarks } from "../../utils";

export default function TimeRuler() {
    const zoom = useStore(s => s.zoom);
    const duration = useStore(s => s.duration);
    const setCurrentTime = useStore(s => s.setCurrentTime);

    const [isDragging, setIsDragging] = useState(false);

    const step = zoom < 40 ? 5 : zoom < 80 ? 2 : 1;

    const marks = useMemo(
        () => generateMarks(duration, step),
        [duration, step]
    );

    return (
        <div
            className="time-ruler"
            style={{ backgroundSize: `${zoom}px 100%` }}
            onPointerDown={(e) => {
                setIsDragging(true);
                e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
                if (!isDragging) return;

                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left + e.currentTarget.scrollLeft;

                setCurrentTime(x / zoom);
            }}
            onPointerUp={() => setIsDragging(false)}
        >
            {marks.map((t) => (
                <div
                    key={t}
                    className="time-mark"
                    style={{ left: t * zoom }}
                >
                    {t}
                </div>
            ))}
        </div>
    );
}
