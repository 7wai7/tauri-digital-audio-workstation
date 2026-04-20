import { readFile } from "@tauri-apps/plugin-fs";

class AudioService {
    private ctx = new AudioContext();
    private playStartTime = 0;
    private sources: AudioBufferSourceNode[] = [];
    private buffers = new Map<string, AudioBuffer>();

    async play(clips: Clip[], currentTime: number) {
        await this.ctx.resume();

        const runtimeClips = await Promise.all(
            clips
                .filter(c => c.start + c.duration > currentTime)
                .map(async c => ({
                    buffer: await this.loadAudio(c.filePath),
                    start: c.start,
                    duration: c.duration
                }))
        )

        runtimeClips
            .sort((a, b) => a.start - b.start);

        this.playStartTime = this.ctx.currentTime - currentTime;

        for (const clip of runtimeClips) {
            const source = this.ctx.createBufferSource();
            source.buffer = clip.buffer;
            source.connect(this.ctx.destination);

            const offset = Math.max(0, currentTime - clip.start);
            const when = this.playStartTime + clip.start;

            source.start(when, offset);
            source.onended = () => {
                this.sources = this.sources.filter(s => s !== source);
            };

            this.sources.push(source);
        }
    }

    stop() {
        this.sources.forEach(s => s.stop());
        this.sources = [];
    }

    seek(clips: Clip[], time: number) {
        this.stop();
        this.play(clips, time);
    }

    getCurrentTime() {
        return this.ctx.currentTime - this.playStartTime;
    }

    async loadAudio(path: string) {
        if (this.buffers.has(path)) {
            return this.buffers.get(path)!;
        }

        const data = await readFile(path);
        const buffer = await this.ctx.decodeAudioData(data.buffer);

        this.buffers.set(path, buffer);
        return buffer;
    }

    async loadAudioFromUrl(url: string) {
        const res = await fetch(url);
        const buffer = await res.arrayBuffer();
        return await this.ctx.decodeAudioData(buffer);
    }
}

export const audioService = new AudioService();