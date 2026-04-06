import { create } from "zustand";
import { storeMock } from "./data/__mock__";

type Store = {
    tracks: Record<string, Track>;
    clips: Record<string, Clip>;
    trackOrder: string[];

    zoom: number;

    moveClip: (clipId: string, toTrackId: string, start: number) => void;
};

export const useStore = create<Store>((set) => ({
    tracks: storeMock.tracks,
    clips: storeMock.clips,
    trackOrder: storeMock.trackOrder,

    zoom: 10,

    moveClip: (clipId, toTrackId, start) =>
        set((state) => {
            const clip = state.clips[clipId];
            if (!clip) return state;

            const fromTrackId = clip.trackId;

            if (fromTrackId === toTrackId && clip.start === start) {
                return state;
            }

            const nextTracks = { ...state.tracks };

            if (fromTrackId !== toTrackId) {
                const fromTrack = nextTracks[fromTrackId];
                nextTracks[fromTrackId] = {
                    ...fromTrack,
                    clipIds: fromTrack.clipIds.filter(id => id !== clipId),
                };

                // 2. додати в новий трек
                const toTrack = nextTracks[toTrackId];
                nextTracks[toTrackId] = {
                    ...toTrack,
                    clipIds: [...toTrack.clipIds, clipId],
                };
            }

            const nextClips = {
                ...state.clips,
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
        }),
}));