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

type TrackLayout = {
  id: string;
  top: number;
  bottom: number;
};