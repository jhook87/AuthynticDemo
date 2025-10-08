declare module 'crypto' {
  interface Hash {
    update(data: ArrayBufferView | string): Hash;
    digest(encoding: 'hex'): string;
  }

  export function createHash(algorithm: string): Hash;

  export const webcrypto: {
    subtle: SubtleCrypto;
  };
}
