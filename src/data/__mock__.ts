const createClip = (
  id: string,
  trackId: string,
  start: number,
  duration: number,
  filePath = "/audio/sample.mp3"
): Clip => ({
  id,
  trackId,
  filePath,
  start,
  duration,
});

export const storeMock = {
  tracks: {
    track_1: {
      id: "track_1",
      clipIds: ["c1", "c2", "c3"],
    },
    track_2: {
      id: "track_2",
      clipIds: ["c4", "c5", "c6"],
    },
    track_3: {
      id: "track_3",
      clipIds: ["c7", "c8", "c9", "c10"],
    },
    track_4: {
      id: "track_4",
      clipIds: ["c11", "c12", "c13"],
    },
    track_5: {
      id: "track_5",
      clipIds: ["c14", "c15", "c16", "c17", "c18"],
    },
    track_6: {
      id: "track_6",
      clipIds: [],
    },
    track_7: {
      id: "track_7",
      clipIds: [],
    },
    track_8: {
      id: "track_8",
      clipIds: [],
    },
    track_9: {
      id: "track_9",
      clipIds: [],
    },
  },

  trackOrder: [
    "track_1",
    "track_2",
    "track_3",
    "track_4",
    "track_5",
    "track_6",
    "track_7",
    "track_8",
    "track_9",
  ],

  clips: {
    c1: createClip("c1", "track_1", 0, 4),
    c2: createClip("c2", "track_1", 6, 3),
    c3: createClip("c3", "track_1", 12, 5),

    c4: createClip("c4", "track_2", 2, 2),
    c5: createClip("c5", "track_2", 5, 6),
    c6: createClip("c6", "track_2", 13, 3),

    c7: createClip("c7", "track_3", 0, 3.5),
    c8: createClip("c8", "track_3", 4, 2),
    c9: createClip("c9", "track_3", 8, 4),
    c10: createClip("c10", "track_3", 15, 2),

    c11: createClip("c11", "track_4", 1, 5),
    c12: createClip("c12", "track_4", 7, 2.5),
    c13: createClip("c13", "track_4", 11, 6),

    c14: createClip("c14", "track_5", 0, 2),
    c15: createClip("c15", "track_5", 3, 2),
    c16: createClip("c16", "track_5", 6, 2),
    c17: createClip("c17", "track_5", 9, 2),
    c18: createClip("c18", "track_5", 12, 2.7),
  },
};