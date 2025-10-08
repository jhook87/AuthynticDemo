import { DUMMY_TRUST_NETWORK } from './dummyData';
import { TrustNetwork, TrustNode } from '../types/authyntic';

/**
 * A mock trust service that pretends to communicate with back‑end
 * infrastructure. It exposes asynchronous functions returning dummy
 * data used throughout the demo. Latency is simulated with timeouts.
 */

// Simulate network latency
const simulateLatency = (min = 200, max = 800) => {
  return new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));
};

export async function getTrustNetwork(): Promise<TrustNetwork> {
  await simulateLatency();
  return JSON.parse(JSON.stringify(DUMMY_TRUST_NETWORK));
}

export async function calculateTrustScore(nodeId: string): Promise<number> {
  await simulateLatency();
  const node = DUMMY_TRUST_NETWORK.nodes.find((n) => n.id === nodeId);
  return node ? node.trust_score : 0;
}

export async function adjustTrustScore(nodeId: string, delta: number): Promise<TrustNode | null> {
  await simulateLatency();
  const node = DUMMY_TRUST_NETWORK.nodes.find((n) => n.id === nodeId);
  if (node) {
    node.trust_score = Math.max(0, Math.min(100, node.trust_score + delta));
    return { ...node };
  }
  return null;
}