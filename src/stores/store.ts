import { create } from "zustand";
import { storeMock } from "../data/__mock__";
import { TIMELINE_OFFSET } from "../constants";
import { clamp } from "../utils";
import { audioEngine } from "../services/AudioEngine";
import { projectService } from "../services/ProjectService";

type Store = {
    tracks: Record<string, Track>;
    clips: Record<string, Clip>;
    trackOrder: string[];

    isPlaying: boolean;
    play: () => void;
    stop: () => void;
    togglePlaying: () => void;

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
    clips: {},
    trackOrder: storeMock.trackOrder,

    isPlaying: false,
    play: async () => {
        if (get().isPlaying) return;
        await audioEngine.play(Object.values(get().clips), get().currentTime);
        set({ isPlaying: true })
    },

    stop: () => {
        if (!get().isPlaying) return;
        audioEngine.stop()
        set({ isPlaying: false })
    },

    togglePlaying: () => {
        const { isPlaying, play, stop } = get();
        if (isPlaying) stop();
        else play()
    },

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
        set((state) => ({ duration: projectService.calculateDuration(state.clips) })),

    currentTime: 0,
    setCurrentTime: (value) => set({ currentTime: clamp(-TIMELINE_OFFSET, get().duration + TIMELINE_OFFSET, value) }),

    moveClip: (clipId, toTrackId, start) => {
        set((state) => projectService.moveClip(state.tracks, state.clips, toTrackId, clipId, start));
        get().calculateDuration();
    },

    clipboard: [],
    copySelectedClips: () => {
        const state = get();
        const clipboard = projectService.copy(state.clips, state.selectedClipsIds);
        set({ clipboard });
    },

    pasteClips: () => {
        const state = get();
        if (state.clipboard.length === 0) return;

        const result = projectService.paste(
            state.clips,
            state.tracks,
            state.clipboard
        );

        set(result);

        const duration = projectService.calculateDuration(get().clips);
        set({ duration });
    }
}));