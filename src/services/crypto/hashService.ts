import CryptoJS from 'crypto-js';
import { blake2bHex } from '../../utils/blake2b';
import type { HashAlgorithm, HashComputation } from '../../types';

const encoder = new TextEncoder();

const toWordArray = (bytes: Uint8Array) => {
  const words: number[] = [];
  for (let i = 0; i < bytes.length; i += 1) {
    words[(i / 4) | 0] = (words[(i / 4) | 0] ?? 0) | (bytes[i] << ((3 - (i % 4)) * 8));
  }
  return CryptoJS.lib.WordArray.create(words, bytes.length);
};

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => bytes.slice().buffer;

const webDigest = async (algorithm: AlgorithmIdentifier, data: Uint8Array) => {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const digest = await window.crypto.subtle.digest(algorithm, toArrayBuffer(data));
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }
  try {
    const { createHash } = await import('crypto');
    const nodeAlgorithm = typeof algorithm === 'string' ? algorithm.toLowerCase().replace('-', '') : 'sha256';
    return createHash(nodeAlgorithm)
      .update(data)
      .digest('hex');
  } catch (error) {
    throw new Error('Crypto digest not available in this environment');
  }
};

const computeSha256 = async (input: string | Uint8Array): Promise<string> => {
  const data = typeof input === 'string' ? encoder.encode(input) : input;
  try {
    return await webDigest('SHA-256', data);
  } catch (error) {
    const wordArray = typeof input === 'string' ? input : toWordArray(input);
    return CryptoJS.SHA256(wordArray).toString();
  }
};

const computeSha3 = (input: string | Uint8Array): string => {
  const wordArray = typeof input === 'string' ? input : toWordArray(input);
  return CryptoJS.SHA3(wordArray, { outputLength: 512 }).toString();
};

const computeBlake2b = async (input: string | Uint8Array): Promise<string> => {
  if (typeof window === 'undefined') {
    try {
      const { createHash } = await import('crypto');
      const data = typeof input === 'string' ? encoder.encode(input) : input;
      return createHash('blake2b512')
        .update(data)
        .digest('hex');
    } catch (error) {
      return blake2bHex(input);
    }
  }
  return blake2bHex(input);
};

export const computeHash = async (algorithm: HashAlgorithm, input: string | Uint8Array): Promise<HashComputation> => {
  let digest: string;
  if (algorithm === 'sha-256') {
    digest = await computeSha256(input);
  } else if (algorithm === 'sha-3') {
    digest = computeSha3(input);
  } else {
    digest = await computeBlake2b(input);
  }
  return {
    algorithm,
    digest,
    timestamp: Date.now(),
  };
};

export const computeMultipleHashes = async (input: string | Uint8Array, algorithms: HashAlgorithm[]): Promise<HashComputation[]> => {
  const results: HashComputation[] = [];
  for (const algorithm of algorithms) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await computeHash(algorithm, input));
  }
  return results;
};

export const verifyHash = async (algorithm: HashAlgorithm, input: string | Uint8Array, expected: string): Promise<boolean> => {
  const computation = await computeHash(algorithm, input);
  return computation.digest === expected;
};
