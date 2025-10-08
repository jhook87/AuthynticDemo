
// Generated sample media constants to avoid shipping binary assets in the repository.
// The image and audio samples are stored as base64 strings while the video feed is a
// lightweight ASCII animation rendered at runtime.

export interface SampleMediaDefinition {
  id: string;
  type: 'image' | 'audio' | 'video';
  fileName: string;
  title: string;
  getData: () => Promise<ArrayBuffer>;
  previewUrl?: string;
  frames?: string[][];
}

const SAMPLE_IMAGE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
const SAMPLE_AUDIO_BASE64 = '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';
const SIMULATED_VIDEO_FRAMES: string[][] = [
  [
    "┌────────────┐",
    "│ AUTHENTIC  │",
    "│ SIGNAL FEED│",
    "│ ▓▓▒▒░░░░▒▒ │",
    "└────────────┘"
  ],
  [
    "┌────────────┐",
    "│ AUTHENTIC  │",
    "│ SIGNAL FEED│",
    "│ ░░▒▒▓▓▒▒░░ │",
    "└────────────┘"
  ],
  [
    "┌────────────┐",
    "│ AUTHENTIC  │",
    "│ SIGNAL FEED│",
    "│ ▒▒░░▒▒▓▓▒▒ │",
    "└────────────┘"
  ],
  [
    "┌────────────┐",
    "│ AUTHENTIC  │",
    "│ SIGNAL FEED│",
    "│ ░░░░▒▒▒▒▓▓ │",
    "└────────────┘"
  ]
];
const SIMULATED_VIDEO_DATA = '{"frames": [["┌────────────┐", "│ AUTHENTIC  │", "│ SIGNAL FEED│", "│ ▓▓▒▒░░░░▒▒ │", "└────────────┘"], ["┌────────────┐", "│ AUTHENTIC  │", "│ SIGNAL FEED│", "│ ░░▒▒▓▓▒▒░░ │", "└────────────┘"], ["┌────────────┐", "│ AUTHENTIC  │", "│ SIGNAL FEED│", "│ ▒▒░░▒▒▓▓▒▒ │", "└────────────┘"], ["┌────────────┐", "│ AUTHENTIC  │", "│ SIGNAL FEED│", "│ ░░░░▒▒▒▒▓▓ │", "└────────────┘"]]}';

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const decodeBase64 = (value: string): ArrayBuffer => {
  const sanitized = value.replace(/[^A-Za-z0-9+/=]/g, '');
  const padding = sanitized.endsWith('==') ? 2 : sanitized.endsWith('=') ? 1 : 0;
  const length = (sanitized.length * 3) / 4 - padding;
  const bytes = new Uint8Array(length);
  let bufferIndex = 0;

  for (let index = 0; index < sanitized.length; index += 4) {
    const encoded1 = BASE64_ALPHABET.indexOf(sanitized.charAt(index));
    const encoded2 = BASE64_ALPHABET.indexOf(sanitized.charAt(index + 1));
    const encoded3 = BASE64_ALPHABET.indexOf(sanitized.charAt(index + 2));
    const encoded4 = BASE64_ALPHABET.indexOf(sanitized.charAt(index + 3));

    const triplet =
      (encoded1 << 18) |
      (encoded2 << 12) |
      ((encoded3 & 63) << 6) |
      (encoded4 & 63);

    if (bufferIndex < length) {
      bytes[bufferIndex] = (triplet >> 16) & 255;
      bufferIndex += 1;
    }
    if (bufferIndex < length) {
      bytes[bufferIndex] = (triplet >> 8) & 255;
      bufferIndex += 1;
    }
    if (bufferIndex < length) {
      bytes[bufferIndex] = triplet & 255;
      bufferIndex += 1;
    }
  }

  return bytes.buffer;
};

export const SAMPLE_MEDIA: SampleMediaDefinition[] = [
  {
    id: 'synthetic-image',
    type: 'image',
    title: 'Synthetic Gradient Image',
    fileName: 'data:image/png;base64,' + SAMPLE_IMAGE_BASE64,
    previewUrl: 'data:image/png;base64,' + SAMPLE_IMAGE_BASE64,
    getData: () => Promise.resolve(decodeBase64(SAMPLE_IMAGE_BASE64)),
  },
  {
    id: 'sine-audio',
    type: 'audio',
    title: '440Hz Reference Tone',
    fileName: 'data:audio/wav;base64,' + SAMPLE_AUDIO_BASE64,
    previewUrl: 'data:audio/wav;base64,' + SAMPLE_AUDIO_BASE64,
    getData: () => Promise.resolve(decodeBase64(SAMPLE_AUDIO_BASE64)),
  },
  {
    id: 'simulated-video',
    type: 'video',
    title: 'Simulated Operations Feed',
    fileName: 'simulated-video-sequence.json',
    getData: () => Promise.resolve(new TextEncoder().encode(SIMULATED_VIDEO_DATA).buffer),
    frames: SIMULATED_VIDEO_FRAMES,
  },
];
