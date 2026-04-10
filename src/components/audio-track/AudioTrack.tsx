import React from "react";
import ClipView from "../clip-view/ClipView";
import "./AudioTrack.css"
import { useGlobalStore } from "../../stores/store";
import { TRACK_HEIGHT } from "../../constants";

interface Props {
    id: string
}

export default React.memo(function AudioTrack({ id }: Props) {
    const track = useGlobalStore(s => s.tracks[id]);
    const zoom = useGlobalStore(s => s.zoom);

    return (
        <div
            className="audio-track"
            style={{
                backgroundSize: `${zoom}px 100%`,
                height: TRACK_HEIGHT,
                minHeight: TRACK_HEIGHT,
                maxHeight: TRACK_HEIGHT
            }}
        >
            {track.clipIds.map(cid => (
                <ClipView key={cid} id={cid} />
            ))}
        </div>
    )
})