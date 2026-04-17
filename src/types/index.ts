type Track = {
  id: string;
  clipIds: string[];
};

type Clip = {
  id: string;
  trackId: string;
  filePath: string;
  start: number;
  duration: number;
};

type ClipRuntime = {
  buffer: AudioBuffer;
  start: number;
  duration: number;
  // filePath: string;
};