import { computeHash } from '../crypto/hashService';
import type { HashAlgorithm } from '../../types';

export type DemoProgressListener = (progress: number, message: string) => void;

const DEMO_HASH_ALGORITHM: HashAlgorithm = 'sha-256';

const sleep = (duration: number) => new Promise((resolve) => {
  setTimeout(resolve, duration);
});

const progressTimeline: Array<{ progress: number; message: string }> = [
  { progress: 12, message: 'Initializing secure enclave…' },
  { progress: 28, message: 'Streaming media signatures through AI detectors…' },
  { progress: 47, message: 'Generating multi-algorithm digest ensemble…' },
  { progress: 71, message: 'Anchoring proof hints to demo ledger…' },
  { progress: 88, message: 'Composing zero-knowledge attestations…' },
  { progress: 100, message: 'Finalizing authenticity envelope…' },
];

const emitProgress = async (listener: DemoProgressListener, progress: number, message: string) => {
  listener(progress, message);
  await sleep(320 + Math.random() * 260);
};

export const demoCryptoService = {
  async generateHashWithAnimation(data: string, listener: DemoProgressListener = () => {}) {
    for (const step of progressTimeline) {
      // eslint-disable-next-line no-await-in-loop
      await emitProgress(listener, step.progress, step.message);
    }

    const { digest } = await computeHash(DEMO_HASH_ALGORITHM, data);
    listener(100, 'Hash sealed and ready for review!');
    return digest;
  },
};
