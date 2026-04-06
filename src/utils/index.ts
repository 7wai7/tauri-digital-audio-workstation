export function generateMarks(duration: number, step: number) {
    const result = [];

    for (let t = 0; t <= duration; t += step) {
        result.push(t);
    }

    return result;
}