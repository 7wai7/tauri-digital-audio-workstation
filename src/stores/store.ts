import { create } from "zustand";
import { storeMock } from "../data/__mock__";
import { TIMELINE_OFFSET } from "../constants";
import { clamp } from "../utils";

type Store = {
    tracks: Record<string, Track>;
    clips: Record<string, Clip>;
    trackOrder: string[];

    selectedClipsIds: Set<string>,
    selectOnlyClip: (id: string) => void,
    clearSelectedClips: () => void,
    selectClip: (id: string) => void,
    deselectClip: (id: string) => void,
    toggleClip: (id: string) => void,

    zoom: number;
    duration: number;
    currentTime: number;
    setCurrentTime: (value: number) => void;

    moveClip: (clipId: string, toTrackId: string, start: number) => void;
};

export const useGlobalStore = create<Store>((set, get) => ({
    tracks: storeMock.tracks,
    clips: storeMock.clips,
    trackOrder: storeMock.trackOrder,

    selectedClipsIds: new Set,
    selectOnlyClip: (id: string) =>
        set({ selectedClipsIds: new Set([id]) }),

    toggleClip: (id: string) =>
        set((state) => {
            const next = new Set(state.selectedClipsIds);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return { selectedClipsIds: next };
        }),

    clearSelectedClips: () =>
        set({ selectedClipsIds: new Set() }),

    selectClip: (id) =>
        set((state) => {
            const next = new Set(state.selectedClipsIds);
            next.add(id);

            return { selectedClipsIds: next };
        }),

    deselectClip: (id) =>
        set((state) => {
            const next = new Set(state.selectedClipsIds);
            next.delete(id);

            return { selectedClipsIds: next };
        }),

    zoom: 10,
    duration: 100,
    currentTime: 10,
    setCurrentTime: (value) => set({ currentTime: clamp(-TIMELINE_OFFSET, get().duration + TIMELINE_OFFSET, value) }),

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