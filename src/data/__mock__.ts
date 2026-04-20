const createClip = (
  id: string,
  trackId: string,
  start: number,
  duration: number,
  filePath: string
): Clip => ({
  id,
  trackId,
  filePath,
  start,
  duration,
});

export const storeMock = {
  tracks: {
    track_1: { id: "track_1", clipIds: ["c1", "c2", "c3", "c4"] },
    track_2: { id: "track_2", clipIds: ["c5", "c6", "c7", "c8"] },
    track_3: { id: "track_3", clipIds: ["c9", "c10", "c11"] },
    track_4: { id: "track_4", clipIds: ["c12", "c13"] },
    track_5: { id: "track_5", clipIds: ["c14", "c15", "c16", "c17", "c18"] },

    ...Object.fromEntries(
      Array.from({ length: 10 }).map((_, i) => {
        const id = `track_${i + 6}`;
        return [id, { id, clipIds: [] }];
      })
    ),
  },

  trackOrder: [] as string[],

  clips: {
    // drums basic loop
    c1: createClip("c1", "track_1", 0, 1, "/audio/kick-drum.mp3"),
    c2: createClip("c2", "track_1", 1, 1, "/audio/snare-drum.mp3"),
    c3: createClip("c3", "track_1", 2, 1, "/audio/kick-drum.mp3"),
    c4: createClip("c4", "track_1", 3, 1, "/audio/snare-drum.mp3"),

    // hi-hats (dense)
    c5: createClip("c5", "track_2", 0, 0.5, "/audio/hi-hat.mp3"),
    c6: createClip("c6", "track_2", 0.5, 0.5, "/audio/hi-hat.mp3"),
    c7: createClip("c7", "track_2", 1, 0.5, "/audio/hi-hat.mp3"),
    c8: createClip("c8", "track_2", 1.5, 0.5, "/audio/hi-hat.mp3"),

    // impacts
    c9: createClip("c9", "track_3", 0, 3, "/audio/cinematic-impact-hit.mp3"),
    c10: createClip("c10", "track_3", 8, 3, "/audio/cinematic-impact-hit.mp3"),
    c11: createClip("c11", "track_3", 16, 3, "/audio/cinematic-impact-hit.mp3"),

    // whooshes
    c12: createClip("c12", "track_4", 3, 2, "/audio/whoosh-end.mp3"),
    c13: createClip("c13", "track_4", 11, 2, "/audio/whoosh-end.mp3"),

    // mixed sequence
    c14: createClip("c14", "track_5", 0, 1, "/audio/kick-drum.mp3"),
    c15: createClip("c15", "track_5", 1, 1, "/audio/hi-hat.mp3"),
    c16: createClip("c16", "track_5", 2, 1, "/audio/snare-drum.mp3"),
    c17: createClip("c17", "track_5", 4, 2, "/audio/whoosh-end.mp3"),
    c18: createClip("c18", "track_5", 8, 3, "/audio/cinematic-impact-hit.mp3"),
  },
};

storeMock.trackOrder = Object.keys(storeMock.tracks);