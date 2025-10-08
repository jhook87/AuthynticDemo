import type { NetworkNode } from '../../types';
import { randomFloat } from '../../utils/random';

export interface ReputationAdjustment {
  nodeId: string;
  delta: number;
  reason: string;
}

const reasons = [
  'Latency spike detected',
  'Invalid block proposal',
  'Consistent uptime',
  'Community endorsement',
];

export const adjustReputation = (nodes: NetworkNode[]): { nodes: NetworkNode[]; adjustments: ReputationAdjustment[] } => {
  const adjustments: ReputationAdjustment[] = [];
  const updated = nodes.map((node) => {
    let delta = randomFloat(-0.05, 0.05);
    let reason = reasons[Math.floor(Math.random() * reasons.length)];
    if (node.status === 'offline') {
      delta = -0.1;
      reason = 'Unplanned downtime';
    }
    if (node.incidents > 2) {
      delta -= 0.05;
      reason = 'Incident investigation';
    }
    const reputation = Math.min(1, Math.max(0, node.reputation + delta));
    adjustments.push({ nodeId: node.id, delta, reason });
    return {
      ...node,
      reputation,
    };
  });
  return { nodes: updated, adjustments };
};
