import { TIMELINE_OFFSET } from "../constants";

export function generateMarks(duration: number, step: number) {
    const result = [];

    for (let t = -TIMELINE_OFFSET; t <= duration + TIMELINE_OFFSET; t += step) {
        result.push(t);
    }

    return result;
}

export function clamp(min: number, max: number, value: number) {
    return Math.max(min, Math.min(value, max));
}