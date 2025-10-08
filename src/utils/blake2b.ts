const IV = [
  0x6a09e667f3bcc908n,
  0xbb67ae8584caa73bn,
  0x3c6ef372fe94f82bn,
  0xa54ff53a5f1d36f1n,
  0x510e527fade682d1n,
  0x9b05688c2b3e6c1fn,
  0x1f83d9abfb41bd6bn,
  0x5be0cd19137e2179n,
];

const SIGMA = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
  [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4],
  [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8],
  [9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13],
  [2, 12, 6, 10, 4, 7, 15, 14, 1, 13, 8, 5, 9, 0, 3, 11],
  [12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11],
  [13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10],
  [6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5],
  [10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
];

const ROTATIONS = [32n, 24n, 16n, 63n];

const RIGHT_ROTATE = (x: bigint, n: bigint): bigint => ((x >> n) | (x << (64n - n))) & 0xffffffffffffffffn;

const toUint8Array = (input: string | Uint8Array): Uint8Array => {
  if (input instanceof Uint8Array) {
    return input;
  }
  return new TextEncoder().encode(input);
};

const readUint64 = (bytes: Uint8Array, offset: number): bigint => {
  let result = 0n;
  for (let i = 0; i < 8; i += 1) {
    result |= BigInt(bytes[offset + i]) << (BigInt(i) * 8n);
  }
  return result;
};

const writeUint64 = (value: bigint): Uint8Array => {
  const out = new Uint8Array(8);
  for (let i = 0; i < 8; i += 1) {
    out[i] = Number((value >> BigInt(i * 8)) & 0xffn);
  }
  return out;
};

const compress = (
  state: bigint[],
  block: Uint8Array,
  offset: number,
  count: bigint,
  isLast: boolean,
) => {
  const m = new Array<bigint>(16);
  for (let i = 0; i < 16; i += 1) {
    m[i] = readUint64(block, offset + i * 8);
  }

  const v = [...state, ...IV];
  v[12] ^= count & 0xffffffffffffffffn;
  v[13] ^= (count >> 64n) & 0xffffffffffffffffn;

  if (isLast) {
    v[14] = ~v[14] & 0xffffffffffffffffn;
  }

  for (let round = 0; round < 12; round += 1) {
    const s = SIGMA[round];

    const mix = (a: number, b: number, c: number, d: number, x: bigint, y: bigint) => {
      v[a] = (v[a] + v[b] + x) & 0xffffffffffffffffn;
      v[d] = RIGHT_ROTATE(v[d] ^ v[a], ROTATIONS[0]);
      v[c] = (v[c] + v[d]) & 0xffffffffffffffffn;
      v[b] = RIGHT_ROTATE(v[b] ^ v[c], ROTATIONS[1]);
      v[a] = (v[a] + v[b] + y) & 0xffffffffffffffffn;
      v[d] = RIGHT_ROTATE(v[d] ^ v[a], ROTATIONS[2]);
      v[c] = (v[c] + v[d]) & 0xffffffffffffffffn;
      v[b] = RIGHT_ROTATE(v[b] ^ v[c], ROTATIONS[3]);
    };

    mix(0, 4, 8, 12, m[s[0]], m[s[1]]);
    mix(1, 5, 9, 13, m[s[2]], m[s[3]]);
    mix(2, 6, 10, 14, m[s[4]], m[s[5]]);
    mix(3, 7, 11, 15, m[s[6]], m[s[7]]);
    mix(0, 5, 10, 15, m[s[8]], m[s[9]]);
    mix(1, 6, 11, 12, m[s[10]], m[s[11]]);
    mix(2, 7, 8, 13, m[s[12]], m[s[13]]);
    mix(3, 4, 9, 14, m[s[14]], m[s[15]]);
  }

  for (let i = 0; i < 8; i += 1) {
    state[i] = state[i] ^ v[i] ^ v[i + 8];
  }
};

export const blake2b = (input: string | Uint8Array, outLength = 64, key?: Uint8Array): Uint8Array => {
  if (outLength <= 0 || outLength > 64) {
    throw new Error('Invalid BLAKE2b output length');
  }

  const data = toUint8Array(input);
  const blockSize = 128;
  const state = [...IV];

  let offset = 0;
  let totalCount = 0n;

  if (key) {
    state[0] ^= 0x01010000n ^ (BigInt(key.length) << 8n) ^ BigInt(outLength);
    const padded = new Uint8Array(blockSize);
    padded.set(key);
    totalCount = BigInt(blockSize);
    compress(state, padded, 0, totalCount, false);
  } else {
    state[0] ^= 0x01010000n ^ BigInt(outLength);
  }

  while (offset + blockSize <= data.length) {
    totalCount += BigInt(blockSize);
    compress(state, data, offset, totalCount, false);
    offset += blockSize;
  }

  const lastBlock = new Uint8Array(blockSize);
  lastBlock.set(data.slice(offset));
  const remaining = data.length - offset;
  totalCount += BigInt(remaining);
  compress(state, lastBlock, 0, totalCount, true);

  const out = new Uint8Array(outLength);
  const full = new Uint8Array(64);
  for (let i = 0; i < state.length; i += 1) {
    full.set(writeUint64(state[i]), i * 8);
  }

  out.set(full.slice(0, outLength));
  return out;
};

export const blake2bHex = (input: string | Uint8Array, outLength = 64): string =>
  Array.from(blake2b(input, outLength))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
