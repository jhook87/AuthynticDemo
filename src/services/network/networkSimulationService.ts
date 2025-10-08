import type { NetworkNode } from '../../types';
import { NETWORK_REGIONS } from '../../constants';
import { randomFloat, randomId, randomInt, randomItem } from '../../utils/random';

const roles: NetworkNode['role'][] = ['ingest', 'validator', 'curator', 'edge', 'storage'];
const createNode = (index: number): NetworkNode => ({
  id: randomId('node'),
  label: `Node ${index + 1}`,
  role: roles[index % roles.length],
  status: 'online',
  latencyMs: randomFloat(20, 120),
  reputation: randomFloat(0.6, 0.99),
  incidents: randomInt(0, 3),
  region: randomItem(NETWORK_REGIONS),
  connections: [],
  consensusWeight: randomFloat(0.5, 1.5),
});

export const bootstrapNetwork = (size = 12): NetworkNode[] => {
  const nodes = Array.from({ length: size }, (_, index) => createNode(index));
  nodes.forEach((node) => {
    const peers = randomInt(2, Math.min(5, nodes.length - 1));
    const connections = new Set<string>();
    while (connections.size < peers) {
      const candidate = randomItem(nodes);
      if (candidate.id !== node.id) {
        connections.add(candidate.id);
      }
    }
    node.connections = Array.from(connections);
  });
  return nodes;
};

export const simulateLatencyShift = (nodes: NetworkNode[]): NetworkNode[] =>
  nodes.map((node) => ({
    ...node,
    latencyMs: Math.max(5, node.latencyMs + randomFloat(-15, 15)),
  }));

export const simulateStatusChanges = (nodes: NetworkNode[]): NetworkNode[] =>
  nodes.map((node) => {
    const roll = Math.random();
    let status = node.status;
    if (roll < 0.05) status = 'offline';
    else if (roll < 0.15) status = 'degraded';
    else if (roll > 0.85) status = 'online';
    return {
      ...node,
      status,
      reputation: Math.min(1, Math.max(0, node.reputation + randomFloat(-0.05, 0.03))),
    };
  });

export const simulatePartition = (nodes: NetworkNode[]): NetworkNode[][] => {
  const shuffled = [...nodes].sort(() => Math.random() - 0.5);
  const splitIndex = Math.floor(shuffled.length / 2);
  return [shuffled.slice(0, splitIndex), shuffled.slice(splitIndex)];
};

export const recoverPartition = (segments: NetworkNode[][]): NetworkNode[] =>
  segments.flat().map((node) => ({
    ...node,
    latencyMs: node.latencyMs * randomFloat(0.9, 1.1),
    status: 'online',
  }));
