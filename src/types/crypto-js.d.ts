declare module 'crypto-js' {
  export interface WordArray {
    sigBytes: number;
    words: number[];
  }

  export const lib: {
    WordArray: {
      create: (words?: number[], sigBytes?: number) => WordArray;
    };
  };

  export const enc: {
    Hex: {
      stringify: (wordArray: WordArray) => string;
    };
  };

  export function SHA256(message: string | WordArray): WordArray;
  export function SHA3(message: string | WordArray, options?: { outputLength?: number }): WordArray;

  const CryptoJS: {
    SHA256: typeof SHA256;
    SHA3: typeof SHA3;
    lib: typeof lib;
    enc: typeof enc;
  };

  export default CryptoJS;
}
