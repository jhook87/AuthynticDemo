import { DUMMY_MEDIA_STREAMS, DUMMY_MERKLE_PROOFS } from './dummyData';
import { MediaStream, MerkleProof } from '../types/authyntic';
import CryptoJS from 'crypto-js';

// Simulate network latency for streaming operations
const simulateLatency = (min = 100, max = 500) => {
  return new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));
};

export async function getMediaStreams(): Promise<MediaStream[]> {
  await simulateLatency();
  // Return deep copy to avoid mutation side effects
  return JSON.parse(JSON.stringify(DUMMY_MEDIA_STREAMS));
}

export async function generateProofForStream(streamId: string): Promise<MerkleProof> {
  await simulateLatency();
  // Find stream and compute a pseudo hash based on the current time and ID
  const stream = DUMMY_MEDIA_STREAMS.find((s) => s.id === streamId);
  const timestamp = new Date().toISOString();
  const mediaHash = CryptoJS.SHA256(streamId + timestamp).toString();
  const proof = [
    CryptoJS.SHA256(mediaHash + '1').toString().slice(0, 16),
    CryptoJS.SHA256(mediaHash + '2').toString().slice(0, 16),
    CryptoJS.SHA256(mediaHash + '3').toString().slice(0, 16),
  ];
  const newProof: MerkleProof = {
    timestamp,
    mediaHash,
    proof,
    verified: Math.random() > 0.1, // randomly mark as verified/unverified
  };
  // Insert into dummy proofs list for demonstration (mutate for persist)
  DUMMY_MERKLE_PROOFS.push(newProof);
  return newProof;
}