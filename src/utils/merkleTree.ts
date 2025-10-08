import CryptoJS from 'crypto-js';

/**
 * Generate a Merkle tree from an array of leaf hashes. A Merkle tree is
 * represented as an array of levels, where the 0‑th level contains the
 * original leaves and each subsequent level contains the hashes of
 * concatenated pairs from the previous level.
 */
export function buildMerkleTree(leaves: string[]): string[][] {
  if (leaves.length === 0) {
    return [];
  }
  let level: string[] = leaves.map((leaf) => leaf);
  const tree: string[][] = [level];
  while (level.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left;
      const combined = left + right;
      const hash = CryptoJS.SHA256(combined).toString();
      nextLevel.push(hash);
    }
    level = nextLevel;
    tree.push(level);
  }
  return tree;
}

/**
 * Retrieve the Merkle root given a list of leaf hashes. The root is the
 * single hash produced at the top of the Merkle tree.
 */
export function getMerkleRoot(leaves: string[]): string | null {
  const tree = buildMerkleTree(leaves);
  if (tree.length === 0) return null;
  return tree[tree.length - 1][0];
}

/**
 * Generate a Merkle proof for a given leaf index. The proof consists of
 * sibling hashes needed to reconstruct the Merkle root. Returns both the
 * proof array and the final root.
 */
export function generateMerkleProof(leaves: string[], index: number): { proof: string[]; root: string | null } {
  const tree = buildMerkleTree(leaves);
  if (!tree.length) return { proof: [], root: null };
  const proof: string[] = [];
  let idx = index;
  for (let level = 0; level < tree.length - 1; level++) {
    const currentLevel = tree[level];
    const isRightNode = idx % 2 === 1;
    const siblingIndex = isRightNode ? idx - 1 : idx + 1;
    const siblingHash = currentLevel[siblingIndex] ?? currentLevel[idx];
    proof.push(siblingHash);
    idx = Math.floor(idx / 2);
  }
  const root = tree[tree.length - 1][0];
  return { proof, root };
}