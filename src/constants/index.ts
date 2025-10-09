import type {
  ConsensusSnapshot,
  HashAlgorithm,
  NetworkIncident,
  NetworkNode,
} from '../types';

export const HASH_ALGORITHMS: ReadonlyArray<HashAlgorithm> = ['sha-256', 'sha-3', 'blake2b'];

export const ROLE_COLORS: Record<NetworkNode['role'], string> = {
  ingest: 'rgba(16, 185, 129, 0.85)',
  validator: 'rgba(59, 130, 246, 0.85)',
  curator: 'rgba(249, 115, 22, 0.85)',
  edge: 'rgba(236, 72, 153, 0.85)',
  storage: 'rgba(139, 92, 246, 0.85)',
};

export const STATUS_BADGE_COLORS: Record<NetworkNode['status'], string> = {
  online: 'rgba(34, 197, 94, 0.85)',
  offline: 'rgba(248, 113, 113, 0.85)',
  degraded: 'rgba(250, 204, 21, 0.85)',
};

export const NETWORK_REGIONS: ReadonlyArray<string> = [
  'us-east',
  'us-west',
  'eu-central',
  'ap-southeast',
  'sa-east',
];

export const CONSENSUS_ALGORITHMS: ReadonlyArray<ConsensusSnapshot['algorithm']> = [
  'PBFT',
  'PoS',
  'HotStuff',
];

export const INCIDENT_SEVERITIES: ReadonlyArray<NetworkIncident['severity']> = [
  'low',
  'medium',
  'high',
  'critical',
];

export const AUTHENTICITY_THRESHOLDS = {
  trusted: 85,
  review: 70,
} as const;

