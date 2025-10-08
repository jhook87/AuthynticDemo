import { DUMMY_TRUST_NETWORK } from './dummyData';
import { TrustNetwork, TrustNode, TrustConnection } from '../types/authyntic';

// Simulate latency
const simulateLatency = (min = 150, max = 600) => {
  return new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));
};

/**
 * Discover peers on the network. In this mock implementation it simply
 * returns the static list of nodes with minor random updates to status.
 */
export async function discoverPeers(): Promise<TrustNetwork> {
  await simulateLatency();
  // Randomly toggle status of one node to simulate churn
  const idx = Math.floor(Math.random() * DUMMY_TRUST_NETWORK.nodes.length);
  const node = DUMMY_TRUST_NETWORK.nodes[idx];
  node.status = node.status === 'online' ? 'offline' : 'online';
  return JSON.parse(JSON.stringify(DUMMY_TRUST_NETWORK));
}

/**
 * Fetch detailed information about a specific peer.
 */
export async function getPeerDetails(peerId: string): Promise<TrustNode | null> {
  await simulateLatency();
  const node = DUMMY_TRUST_NETWORK.nodes.find((n) => n.id === peerId);
  return node ? { ...node } : null;
}

/**
 * Simulate connection strength updates by introducing slight variations to
 * existing strengths.
 */
export async function updateConnectionStrengths(): Promise<TrustConnection[]> {
  await simulateLatency();
  DUMMY_TRUST_NETWORK.connections.forEach((conn) => {
    const delta = (Math.random() - 0.5) * 0.1;
    conn.strength = Math.max(0, Math.min(1, conn.strength + delta));
  });
  return JSON.parse(JSON.stringify(DUMMY_TRUST_NETWORK.connections));
}