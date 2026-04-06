import Tracks from "../Tracks"
import Playhead from "./Playhead"
import "./Timeline.css"
import TimeRuler from "./TimeRuler"

export default function Timeline() {
    return (
        <section className="timeline">
            <TimeRuler />
            <div className="timeline-body">
                <Playhead />
                <Tracks />
            </div>
        </section>
    )
}