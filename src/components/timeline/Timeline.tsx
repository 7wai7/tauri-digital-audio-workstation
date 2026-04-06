import { useRef } from "react";
import Tracks from "../Tracks"
import Playhead from "./Playhead"
import "./Timeline.css"
import TimeRuler from "./TimeRuler"

export default function Timeline() {
    const timelineRef = useRef<HTMLDivElement>(null);

    return (
        <section
            ref={timelineRef}
            className="timeline"
        >
            <TimeRuler timelineRef={timelineRef}/>
            <div className="timeline-body">
                <Playhead timelineRef={timelineRef}/>
                <Tracks />
            </div>
        </section>
    )
}