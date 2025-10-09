export const NETWORK_REGIONS = ['us-east', 'us-west', 'eu-central', 'ap-south', 'ap-northeast'] as const;

export const ROLE_COLORS: Record<string, string> = {
  ingest: '#4f46e5',
  validator: '#0ea5e9',
  curator: '#14b8a6',
  edge: '#f97316',
  storage: '#facc15',
};

export const STATUS_BADGE_COLORS: Record<'online' | 'offline' | 'degraded', string> = {
  online: '#10b981',
  offline: '#f43f5e',
  degraded: '#facc15',
};

export const ALERT_LEVEL_COLORS: Record<'info' | 'warning' | 'critical', string> = {
  info: '#38bdf8',
  warning: '#facc15',
  critical: '#f43f5e',
};

export const AUTHENTICITY_THRESHOLDS = {
  trusted: 80,
  review: 50,
};

export const HASH_ALGORITHMS = ['sha-256', 'sha-3', 'blake2b'] as const;

export const CONSENSUS_ALGORITHMS = ['PBFT', 'PoS', 'HotStuff'] as const;

export const INCIDENT_SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;

export const TRAINING_ATTACKS = ['Deepfake injection', 'Sybil takeover', 'Checkpoint rewrite'];

export const POLICY_PRESETS = ['Strict provenance', 'Balanced throughput', 'Latency optimized'];

export const WEBHOOK_EVENTS = ['asset.created', 'asset.updated', 'alert.triggered', 'consensus.finalized'];

export const SERVICE_WORKER_CACHE = 'authyntic-offline-cache-v1';
