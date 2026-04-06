import React from "react";
import ClipView from "../clip-view/ClipView";
import "./AudioTrack.css"
import { useStore } from "../../store";

interface Props {
    id: string
}

export default React.memo(function AudioTrack({ id }: Props) {
    const track = useStore(s => s.tracks[id]);
    const zoom = useStore(s => s.zoom);

    return (

        <div
            className="audio-track"
            style={{
                backgroundSize: `${zoom}px 100%`
            }}
        >
            {track.clipIds.map(cid => (
                <ClipView key={cid} id={cid} />
            ))}
        </div>
    )
})