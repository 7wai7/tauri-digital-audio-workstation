import { create } from "zustand";
import { useGlobalStore } from "./store";
import { DRAG_THRESHOLD, TRACK_HEIGHT } from "../constants";

type DragState = {
    anchorClipId: string;
    startX: number;
    startY: number;
    items: DragItem[];
};

type DragItem = {
    clipId: string;
    originalStart: number;
    originalTrackIndex: number;
};

type PreviewItem = {
    clipId: string;
    start: number;
    trackIndex: number;
};

type Store = {
    drag: DragState | null;
    preview: PreviewItem[] | null;

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
        }),

    updateDrag: (clientX, clientY, rect, scrollTop) =>
        set((state) => {
            if (!state.drag) return {};

            const global = useGlobalStore.getState();
            const { startX, startY, items, anchorClipId } = state.drag;

            const dx = clientX - startX;
            const dy = clientY - startY;

            if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return {};

            const deltaTime = dx / global.zoom;

            const anchor = items.find(i => i.clipId === anchorClipId);
            if (!anchor) return {};

            const y = clientY - rect.top + scrollTop - 20;
            const nextTrackIndex = Math.max(
                0,
                Math.min(global.trackOrder.length - 1, Math.floor(y / TRACK_HEIGHT))
            );

            const trackDelta = nextTrackIndex - anchor.originalTrackIndex;

            return {
                preview: items.map(item => ({
                    clipId: item.clipId,
                    start: item.originalStart + deltaTime,
                    trackIndex: Math.max(
                        0,
                        Math.min(global.trackOrder.length - 1, item.originalTrackIndex + trackDelta)
                    ),
                })),
            };
        }),

    endDrag: () =>
        set((state) => {
            if (!state.drag) return {};

            if (!state.preview) {
                return { drag: null, preview: null };
            }

            const global = useGlobalStore.getState();

            for (const p of state.preview) {
                const trackId = global.trackOrder[p.trackIndex];
                global.moveClip(p.clipId, trackId, p.start);
            }

            return { drag: null, preview: null };
        }),
}));