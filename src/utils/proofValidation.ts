import CryptoJS from 'crypto-js';

/**
 * Verify a Merkle proof for a given leaf. The algorithm concatenates the
 * current hash with each sibling in the proof and hashes the result. If
 * the final hash matches the expected root then the proof is valid.
 *
 * Note: For simplicity this implementation assumes left‑to‑right ordering
 * for all proof steps, which is sufficient for illustrative purposes.
 */
export function verifyMerkleProof(leaf: string, proof: string[], root: string): boolean {
  let computedHash = leaf;
  for (const sibling of proof) {
    const combined = computedHash + sibling;
    computedHash = CryptoJS.SHA256(combined).toString();
  }
  return computedHash === root;
}