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

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const BASE64_CHARS = BASE64_ALPHABET.slice(0, 64);
const BASE64_PAD = BASE64_ALPHABET.charAt(64);

const encodeBase64 = (data: Uint8Array): string => {
  let output = '';
  for (let index = 0; index < data.length; index += 3) {
    const chunk = (data[index] << 16) | ((data[index + 1] ?? 0) << 8) | (data[index + 2] ?? 0);
    const enc1 = (chunk >> 18) & 63;
    const enc2 = (chunk >> 12) & 63;
    const enc3 = (chunk >> 6) & 63;
    const enc4 = chunk & 63;
    output += BASE64_CHARS[enc1] + BASE64_CHARS[enc2];
    output += index + 1 < data.length ? BASE64_CHARS[enc3] : BASE64_PAD;
    output += index + 2 < data.length ? BASE64_CHARS[enc4] : BASE64_PAD;
  }
  return output;
};

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

const createToneSample = (
  frequency = 440,
  durationMs = 48,
  sampleRate = 16_000,
  amplitude = 0.6,
): Uint8Array => {
  const totalSamples = Math.max(1, Math.round((durationMs / 1_000) * sampleRate));
  const bytesPerSample = 2; // 16-bit mono PCM
  const dataSize = totalSamples * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  let offset = 0;

  const writeString = (value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset, value.charCodeAt(i));
      offset += 1;
    }
  };

  const writeUint32 = (value: number) => {
    view.setUint32(offset, value, true);
    offset += 4;
  };

  const writeUint16 = (value: number) => {
    view.setUint16(offset, value, true);
    offset += 2;
  };

  writeString('RIFF');
  writeUint32(36 + dataSize);
  writeString('WAVE');
  writeString('fmt ');
  writeUint32(16);
  writeUint16(1); // PCM format
  writeUint16(1); // mono
  writeUint32(sampleRate);
  writeUint32(sampleRate * bytesPerSample);
  writeUint16(bytesPerSample);
  writeUint16(8 * bytesPerSample);
  writeString('data');
  writeUint32(dataSize);

  const fadeSamples = Math.max(1, Math.min(Math.floor(totalSamples / 8), 16));
  for (let sampleIndex = 0; sampleIndex < totalSamples; sampleIndex += 1) {
    const time = sampleIndex / sampleRate;
    const envelope = (() => {
      if (sampleIndex < fadeSamples) {
        return sampleIndex / fadeSamples;
      }
      if (sampleIndex >= totalSamples - fadeSamples) {
        return (totalSamples - sampleIndex - 1) / fadeSamples;
      }
      return 1;
    })();
    const sampleValue = Math.sin(2 * Math.PI * frequency * time) * amplitude * envelope;
    view.setInt16(offset, Math.round(sampleValue * 0x7fff), true);
    offset += bytesPerSample;
  }

  return new Uint8Array(buffer);
};

const SAMPLE_AUDIO_BYTES = createToneSample();
const SAMPLE_AUDIO_BASE64 = encodeBase64(SAMPLE_AUDIO_BYTES);
const cloneAudioBuffer = (): ArrayBuffer => SAMPLE_AUDIO_BYTES.slice().buffer;

const SIMULATED_VIDEO_FRAMES: string[][] = [
  [
    '┌────────────┐',
    '│ AUTHENTIC  │',
    '│ SIGNAL FEED│',
    '│ ▓▓▒▒░░░░▒▒ │',
    '└────────────┘',
  ],
  [
    '┌────────────┐',
    '│ AUTHENTIC  │',
    '│ SIGNAL FEED│',
    '│ ░░▒▒▓▓▒▒░░ │',
    '└────────────┘',
  ],
  [
    '┌────────────┐',
    '│ AUTHENTIC  │',
    '│ SIGNAL FEED│',
    '│ ▒▒░░▒▒▓▓▒▒ │',
    '└────────────┘',
  ],
  [
    '┌────────────┐',
    '│ AUTHENTIC  │',
    '│ SIGNAL FEED│',
    '│ ░░░░▒▒▒▒▓▓ │',
    '└────────────┘',
  ],
];

const serializeVideoFrames = () => JSON.stringify({ frames: SIMULATED_VIDEO_FRAMES });

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
    getData: () => Promise.resolve(cloneAudioBuffer()),
  },
  {
    id: 'simulated-video',
    type: 'video',
    title: 'Simulated Operations Feed',
    fileName: 'simulated-video-sequence.json',
    getData: () => Promise.resolve(new TextEncoder().encode(serializeVideoFrames()).buffer),
    frames: SIMULATED_VIDEO_FRAMES,
  },
];
