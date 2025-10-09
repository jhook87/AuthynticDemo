import type { MediaAsset } from '../types';

import imageAssetUrl from './sample-image.jpg?url';
import audioAssetUrl from './sample-audio.wav?url';
import videoAssetUrl from './sample-video.mp4?url';

export interface SampleMediaDefinition {
  id: string;
  type: MediaAsset['type'];
  fileName: string;
  title: string;
  description: string;
  previewUrl?: string;
  frames?: string[][];
  getData: () => Promise<ArrayBuffer>;
}

const fetchAsset = async (assetUrl: string): Promise<ArrayBuffer> => {
  const response = await fetch(assetUrl);
  return response.arrayBuffer();
};

const videoFrames: string[][] = [
  [
    '▐▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▌',
    '▐  Hashing media asset ▌',
    '▐    ████▒▒▒▒▒▒▒▒▒▒    ▌',
    '▐    Preparing digest   ▌',
    '▐▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▌',
  ],
  [
    '▐▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▌',
    '▐  Watermarking frame  ▌',
    '▐    ███████▒▒▒▒▒▒    ▌',
    '▐   Embedding proof    ▌',
    '▐▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▌',
  ],
  [
    '▐▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▌',
    '▐  Validating network  ▌',
    '▐    ████████████▒    ▌',
    '▐    Broadcasting      ▌',
    '▐▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▌',
  ],
];

export const SAMPLE_MEDIA: ReadonlyArray<SampleMediaDefinition> = [
  {
    id: 'sample-image',
    type: 'image',
    fileName: 'sample-image.jpg',
    title: 'Uplink Observatory Still',
    description: 'High resolution capture with authenticity watermark.',
    previewUrl: imageAssetUrl,
    getData: () => fetchAsset(imageAssetUrl),
  },
  {
    id: 'sample-audio',
    type: 'audio',
    fileName: 'sample-audio.wav',
    title: 'Forensic Voice Sample',
    description: 'Captured audio clip for provenance validation.',
    previewUrl: audioAssetUrl,
    getData: () => fetchAsset(audioAssetUrl),
  },
  {
    id: 'sample-video',
    type: 'video',
    fileName: 'sample-video.mp4',
    title: 'Network Operations Feed',
    description: 'Simulated operations video for demo playback.',
    previewUrl: videoAssetUrl,
    frames: videoFrames,
    getData: () => fetchAsset(videoAssetUrl),
  },
];

