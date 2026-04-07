import { useRef } from "react";
import Tracks from "../Tracks"
import Playhead from "./Playhead"
import "./Timeline.css"
import TimeRuler from "./TimeRuler"
import { useStore } from "../../store";
import { TIMELINE_OFFSET } from "../../constants";

export default function Timeline() {
    const duration = useStore(s => s.duration);
    const zoom = useStore(s => s.zoom);
    const timelineRef = useRef<HTMLDivElement>(null);

    return (
        <section
            ref={timelineRef}
            className="timeline"
            style={{
                minWidth: `${(duration + TIMELINE_OFFSET) * zoom}px`
            }}
        >
            <TimeRuler timelineRef={timelineRef}/>
            <div className="timeline-body">
                <Playhead timelineRef={timelineRef}/>
                <Tracks />
            </div>
        </section>
    )
}