import type { ConsensusSnapshot, NetworkNode } from '../../types';
import { CONSENSUS_ALGORITHMS } from '../../constants';
import { randomFloat, randomInt } from '../../utils/random';

export const initialConsensus = (nodes: NetworkNode[]): ConsensusSnapshot => ({
  height: randomInt(10_000, 30_000),
  algorithm: 'PBFT',
  leader: nodes[0]?.label ?? 'Unknown',
  commitRate: randomFloat(0.9, 0.99),
  finalitySeconds: randomFloat(1.5, 3.5),
  disagreementRatio: randomFloat(0.01, 0.05),
});

export const simulateConsensus = (snapshot: ConsensusSnapshot, nodes: NetworkNode[]): ConsensusSnapshot => {
  const nextAlgorithm = CONSENSUS_ALGORITHMS[(CONSENSUS_ALGORITHMS.indexOf(snapshot.algorithm) + 1) % CONSENSUS_ALGORITHMS.length];
  const healthyNodes = nodes.filter((node) => node.status === 'online');
  return {
    height: snapshot.height + randomInt(5, 25),
    algorithm: nextAlgorithm,
    leader: healthyNodes[randomInt(0, Math.max(healthyNodes.length - 1, 0))]?.label ?? snapshot.leader,
    commitRate: Math.min(0.999, Math.max(0.75, snapshot.commitRate + randomFloat(-0.05, 0.05))),
    finalitySeconds: Math.max(0.5, snapshot.finalitySeconds + randomFloat(-0.2, 0.3)),
    disagreementRatio: Math.max(0, snapshot.disagreementRatio + randomFloat(-0.02, 0.02)),
  };
};
