import CryptoJS from 'crypto-js';
import { buildMerkleTree, getMerkleRoot, generateMerkleProof } from '../../utils/merkleTree';
import type { BatchMerkleProof, MerkleLeaf, MerkleProof } from '../../types';

const hashLeaf = (leaf: MerkleLeaf): string =>
  leaf.hash;

export const buildTreeFromLeaves = (leaves: MerkleLeaf[]): string[][] =>
  buildMerkleTree(leaves.map(hashLeaf));

export const deriveRoot = (leaves: MerkleLeaf[]): string | null =>
  getMerkleRoot(leaves.map(hashLeaf));

export const createProof = (leaves: MerkleLeaf[], index: number): MerkleProof => {
  const hashedLeaves = leaves.map(hashLeaf);
  const { proof, root } = generateMerkleProof(hashedLeaves, index);
  const positions: Array<'left' | 'right'> = [];
  let currentIndex = index;
  for (let level = 0; level < proof.length; level += 1) {
    positions.push(currentIndex % 2 === 1 ? 'left' : 'right');
    currentIndex = Math.floor(currentIndex / 2);
  }
  return {
    leaf: leaves[index],
    siblings: proof,
    positions,
    root: root ?? '',
    verified: false,
  };
};

const hashPair = (left: string, right: string): string => CryptoJS.SHA256(left + right).toString();

export const verifyProof = (proof: MerkleProof): MerkleProof => {
  let computed = proof.leaf.hash;
  for (let i = 0; i < proof.siblings.length; i += 1) {
    const sibling = proof.siblings[i];
    const position = proof.positions[i] ?? 'right';
    computed = position === 'right' ? hashPair(computed, sibling) : hashPair(sibling, computed);
  }
  return {
    ...proof,
    verified: computed === proof.root,
  };
};

export const createBatchProof = (leaves: MerkleLeaf[], indices: number[]): BatchMerkleProof => {
  const hashed = leaves.map(hashLeaf);
  const root = getMerkleRoot(hashed) ?? '';
  const proofs = indices.map((index) => verifyProof(createProof(leaves, index)));
  return {
    leaves: indices.map((index) => leaves[index]),
    root,
    proofs,
  };
};

export const verifyBatchProof = (batch: BatchMerkleProof): boolean =>
  batch.proofs.every((proof) => verifyProof(proof).verified);
