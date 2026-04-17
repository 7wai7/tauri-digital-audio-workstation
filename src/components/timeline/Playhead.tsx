import { useEffect, useState } from "react";
import { useGlobalStore } from "../../stores/store";
import { TIMELINE_OFFSET } from "../../constants";
import { audioService } from "../../services/AudioService";

interface Props {
    timelineRef: React.RefObject<HTMLDivElement | null>
}

export default function Playhead({ timelineRef }: Props) {
    const zoom = useGlobalStore(s => s.zoom);
    const currentTime = useGlobalStore(s => s.currentTime);
    const setCurrentTime = useGlobalStore(s => s.setCurrentTime);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        let r: number;

        function tick() {
            if (useGlobalStore.getState().isPlaying) {
                const time = audioService.getCurrentTime();
                setCurrentTime(time);
            }

            r = requestAnimationFrame(tick);
        }

        tick();

        return () => {
            cancelAnimationFrame(r)
        }
    }, [])

    return (
        <div
            ref={timelineRef}
            className="playhead"
            style={{
                transform: `translateX(calc(${(currentTime + TIMELINE_OFFSET) * zoom}px - 50%))`
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
                    audioService.seek(
                        Object.values(useGlobalStore.getState().clips),
                        time
                    );
                }
            }}
            onPointerUp={() => setIsDragging(false)}
        >
            <div className="playhead-visible" />
        </div>
    );
}