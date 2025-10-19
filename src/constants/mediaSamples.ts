
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
const SAMPLE_AUDIO_BASE64 =
  [
    'UklGRkQDAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YSADAAAAAAENeRgNIbcl7SWmIWQZIg40ASP0eOiV34fa6NnK3bflwPCX/bYKkRbCHzElOia+IiYb',
    'WRCdA3T2a+rw4CHbrtnD3APkku4w+2AIkxRXHoQkYSazI80cfxIBBs/4dexq4uDbmtng22ridezP+AEGfxLNHLMjYSaEJFcekxRgCDD7ku4D5MPcrtkh2/Dga+p09p0D',
    'WRAmG74iOiYxJcIfkRa2Cpf9wPC35crd6NmH2pXfeOgj9DQBIg5kGaYh7SW3JQ0heRgBDQAA//KH5/PeSdoT2lrenObe8cz+3QuIF2sgeSUYJjYiSRpAD2kCSvVv6T7g',
    'z9rG2ULd2uSn72P8jAmVFRAf3yRSJj0j/RtuEdAEoPdt66nhfNuf2U3cM+OB7f/5MQeLE5YdICRmJiAklh2LEzEH//mB7TPjTdyf2XzbqeFt66D30ARuEf0bPSNSJt8k',
    'EB+VFYwJY/yn79rkQt3G2c/aPuBv6Ur1aQJAD0kaNiIYJnklayCIF90LzP7e8ZzmWt4T2kna896H5//yAAABDXkYDSG3Je0lpiFkGSIONAEj9Hjold+H2ujZyt235cDw',
    'l/22CpEWwh8xJTomviImG1kQnQN09mvq8OAh267Zw9wD5JLuMPtgCJMUVx6EJGEmsyPNHH8SAQbP+HXsauLg25rZ4Ntq4nXsz/gBBn8SzRyzI2EmhCRXHpMUYAgw+5Lu',
    'A+TD3K7ZIdvw4GvqdPadA1kQJhu+IjomMSXCH5EWtgqX/cDwt+XK3ejZh9qV33joI/Q0ASIOZBmmIe0ltyUNIXkYAQ0AAP/yh+fz3knaE9pa3pzm3vHM/t0LiBdrIHkl',
    'GCY2IkkaQA9pAkr1b+k+4M/axtlC3drkp+9j/IwJlRUQH98kUiY9I/0bbhHQBKD3beup4Xzbn9lN3DPjge3/+TEHixOWHSAkZiYgJJYdixMxB//5ge0z403cn9l826nh',
    'beug99AEbhH9Gz0jUibfJBAflRWMCWP8p+/a5ELdxtnP2j7gb+lK9WkCQA9JGjYiGCZ5JWsgiBfdC8z+3vGc5lreE9pJ2vPeh+f/8g==',
  ].join('');
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
