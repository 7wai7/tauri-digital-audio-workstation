import { create } from "zustand";
import { storeMock } from "../data/__mock__";
import { TIMELINE_OFFSET } from "../constants";
import { clamp } from "../utils";

type Store = {
    tracks: Record<string, Track>;
    clips: Record<string, Clip>;
    trackOrder: string[];

    addClip: (clip: Clip) => void;

    selectedClipsIds: Set<string>;
    selectOnlyClip: (id: string) => void;
    clearSelectedClips: () => void;
    selectClip: (id: string) => void;
    deselectClip: (id: string) => void;
    toggleClip: (id: string) => void;

    zoom: number;

    duration: number;
    calculateDuration: () => void;

    currentTime: number;
    setCurrentTime: (value: number) => void;

    moveClip: (clipId: string, toTrackId: string, start: number) => void;

    clipboard: Clip[];
    copySelectedClips: () => void;
    pasteClips: () => void;
};

export const useGlobalStore = create<Store>((set, get) => ({
    tracks: storeMock.tracks,
    clips: storeMock.clips,
    trackOrder: storeMock.trackOrder,

    addClip: (clip) => {
        set((state) => ({
            clips: {
                ...state.clips,
                [clip.id]: clip
            },
            tracks: {
                ...state.tracks,
                [clip.trackId]: {
                    ...state.tracks[clip.trackId],
                    clipIds: [...state.tracks[clip.trackId].clipIds, clip.id]
                }
            }
        }));

        get().calculateDuration();
    },

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
    calculateDuration: () =>
        set((state) => {
            let max = 0;

            for (const clip of Object.values(state.clips)) {
                const end = clip.start + clip.duration;
                if (end > max) max = end;
            }

            return { duration: max };
        }),

    currentTime: 10,
    setCurrentTime: (value) => set({ currentTime: clamp(-TIMELINE_OFFSET, get().duration + TIMELINE_OFFSET, value) }),

    moveClip: (clipId, toTrackId, start) => {
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
        });

        get().calculateDuration();
    },

    clipboard: [],
    copySelectedClips: () =>
        set((state) => {
            const clips = Array.from(state.selectedClipsIds).map(id => ({
                ...state.clips[id]
            }));

            return { clipboard: clips };
        }),

    pasteClips: () =>
        set((state) => {
            if(state.clipboard.length === 0) return {};
            
            const newClips = { ...state.clips };
            const newTracks = { ...state.tracks };
            const selectedClipsIds = new Set<string>();

            for (const clip of state.clipboard) {
                const id = crypto.randomUUID();

                const newClip = {
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
                selectedClipsIds,
            };
        }),
}));