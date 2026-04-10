import { create } from "zustand";
import { useGlobalStore } from "./store";
import { TRACK_HEIGHT } from "../constants";

type DragState = {
    clipId: string;
    startX: number;
    startY: number;
    originalStart: number;
    originalTrackIndex: number;
};

type DragPreviewState = {
    previewStart: number;
    previewTrackIndex: number;
}

type Store = {
    drag: DragState | null;
    preview: DragPreviewState | null;

    startDrag: (payload: DragState) => void;
    updateDrag: (clientX: number, clientY: number, timelineRect: DOMRect, scrollTop: number) => void;
    endDrag: () => void;
};



export const useClipDragStore = create<Store>((set) => ({
    drag: null,
    preview: null,

    startDrag: (payload) =>
        set({
            drag: payload,
            preview: {
                previewStart: payload.originalStart,
                previewTrackIndex: payload.originalTrackIndex,
            },
        }),

    updateDrag: (clientX, clientY, rect, scrollTop) =>
        set((state) => {
            if (!state.drag) return {};

            const global = useGlobalStore.getState();

            const { startX, originalStart } = state.drag;

            const deltaPxX = clientX - startX;
            const deltaTime = deltaPxX / global.zoom;

            const y = clientY - rect.top + scrollTop - 20;

            const nextTrackIndex = Math.max(
                0,
                Math.min(
                    global.trackOrder.length - 1,
                    Math.floor(y / TRACK_HEIGHT)
                )
            );

            return {
                preview: {
                    previewStart: originalStart + deltaTime,
                    previewTrackIndex: nextTrackIndex,
                },
            };
        }),

    endDrag: () =>
        set((state) => {
            if (!state.drag || !state.preview) return {};

            const global = useGlobalStore.getState();

            const { clipId } = state.drag;
            const { previewStart, previewTrackIndex } = state.preview;

            const trackId = global.trackOrder[previewTrackIndex];

            global.moveClip(clipId, trackId, previewStart);

            return { drag: null, preview: null };
        }),
}));