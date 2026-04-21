class ProjectService {

    copy(clips: Record<string, Clip>, selectedIds: Set<string>): Clip[] {
        return Array.from(selectedIds).map(id => ({
            ...clips[id]
        }));
    }

    paste(
        clips: Record<string, Clip>,
        tracks: Record<string, Track>,
        clipboard: Clip[]
    ): {
        clips: Record<string, Clip>;
        tracks: Record<string, Track>;
        selectedClipsIds: Set<string>;
    } {
        const newClips = { ...clips };
        const newTracks = { ...tracks };
        const selectedClipsIds = new Set<string>();

        for (const clip of clipboard) {
            const id = crypto.randomUUID();

            const newClip: Clip = {
                ...clip,
                id,
                start: clip.start + 1,
            };

            newClips[id] = newClip;
            selectedClipsIds.add(id);

            const track = newTracks[newClip.trackId];

            newTracks[newClip.trackId] = {
                ...track,
                clipIds: [...track.clipIds, id],
            };
        }

        return {
            clips: newClips,
            tracks: newTracks,
            selectedClipsIds
        };
    }

    moveClip(tracks: Record<string, Track>, clips: Record<string, Clip>, toTrackId: string, clipId: string, start: number) {
        const clip = clips[clipId];
        if (!clip) return { tracks, clips };

        const fromTrackId = clip.trackId;

        if (fromTrackId === toTrackId && clip.start === start) {
            return { tracks, clips };
        }

        const nextTracks = { ...tracks };

        if (fromTrackId !== toTrackId) {
            const fromTrack = nextTracks[fromTrackId];
            nextTracks[fromTrackId] = {
                ...fromTrack,
                clipIds: fromTrack.clipIds.filter(id => id !== clipId),
            };

            const toTrack = nextTracks[toTrackId];
            nextTracks[toTrackId] = {
                ...toTrack,
                clipIds: [...toTrack.clipIds, clipId],
            };
        }

        const nextClips = {
            ...clips,
            [clipId]: {
                ...clip,
                start,
                trackId: toTrackId,
            },
        };

        return {
            tracks: nextTracks,
            clips: nextClips,
        };
    }

    calculateDuration(clips: Record<string, Clip>) {
        let max = 0;

        for (const clip of Object.values(clips)) {
            const end = clip.start + clip.duration;
            if (end > max) max = end;
        }

        return max;
    }
}

export const projectService = new ProjectService();