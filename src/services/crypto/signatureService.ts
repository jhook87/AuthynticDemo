import type { SignatureVerificationResult } from '../../types';

interface SigningBundle {
  publicKey: JsonWebKey;
  privateKey?: JsonWebKey;
  algorithm: 'ECDSA_P256';
}

const encoder = new TextEncoder();

const getSubtle = async () => {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    return window.crypto.subtle;
  }
  try {
    const { webcrypto } = await import('crypto');
    return webcrypto.subtle;
  } catch (error) {
    throw new Error('WebCrypto subtle API not available');
  }
};

const base64Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const chunk = (bytes[i] << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0);
    const enc1 = (chunk >> 18) & 63;
    const enc2 = (chunk >> 12) & 63;
    const enc3 = (chunk >> 6) & 63;
    const enc4 = chunk & 63;
    result += base64Alphabet[enc1] + base64Alphabet[enc2];
    result += i + 1 < bytes.length ? base64Alphabet[enc3] : '=';
    result += i + 2 < bytes.length ? base64Alphabet[enc4] : '=';
  }
  return result;
};

const base64ToUint8Array = (value: string): Uint8Array => {
  const sanitized = value.replace(/[^A-Za-z0-9+/=]/g, '');
  const output: number[] = [];
  for (let i = 0; i < sanitized.length; i += 4) {
    const enc1 = base64Alphabet.indexOf(sanitized[i]);
    const enc2 = base64Alphabet.indexOf(sanitized[i + 1]);
    const enc3 = base64Alphabet.indexOf(sanitized[i + 2]);
    const enc4 = base64Alphabet.indexOf(sanitized[i + 3]);
    const chunk = (enc1 << 18) | (enc2 << 12) | ((enc3 & 63) << 6) | (enc4 & 63);
    output.push((chunk >> 16) & 0xff);
    if (sanitized[i + 2] !== '=') {
      output.push((chunk >> 8) & 0xff);
    }
    if (sanitized[i + 3] !== '=') {
      output.push(chunk & 0xff);
    }
  }
  return Uint8Array.from(output);
};

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => bytes.slice().buffer;

export const generateSigningBundle = async (): Promise<SigningBundle> => {
  const subtle = await getSubtle();
  const { publicKey, privateKey } = await subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['sign', 'verify'],
  );
  const [publicKeyExport, privateKeyExport] = await Promise.all([
    subtle.exportKey('jwk', publicKey),
    subtle.exportKey('jwk', privateKey),
  ]);
  return {
    publicKey: publicKeyExport,
    privateKey: privateKeyExport,
    algorithm: 'ECDSA_P256',
  };
};

export const signMessage = async (bundle: SigningBundle, payload: string | Uint8Array): Promise<string> => {
  if (!bundle.privateKey) {
    throw new Error('Bundle is missing private key');
  }
  const subtle = await getSubtle();
  const privateKey = await subtle.importKey(
    'jwk',
    bundle.privateKey,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign'],
  );
  const data = typeof payload === 'string' ? encoder.encode(payload) : payload;
  const signature = await subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privateKey, toArrayBuffer(data));
  return bufferToBase64(signature);
};

export const verifyMessageSignature = async (
  bundle: SigningBundle,
  payload: string | Uint8Array,
  signature: string,
  signedBy = 'Authyntic Authority',
): Promise<SignatureVerificationResult> => {
  const subtle = await getSubtle();
  const publicKey = await subtle.importKey(
    'jwk',
    bundle.publicKey,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['verify'],
  );
  const data = typeof payload === 'string' ? encoder.encode(payload) : payload;
  const verified = await subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    publicKey,
    toArrayBuffer(base64ToUint8Array(signature)),
    toArrayBuffer(data),
  );
  return {
    valid: verified,
    algorithm: bundle.algorithm,
    signedBy,
    occurredAt: Date.now(),
    reason: verified ? undefined : 'Signature check failed',
  };
};
