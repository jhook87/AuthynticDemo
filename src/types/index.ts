export type HashAlgorithm = 'sha-256' | 'sha-3' | 'blake2b';

export interface HashComputation {
  algorithm: HashAlgorithm;
  digest: string;
  timestamp: number;
}

export interface MerkleLeaf {
  id: string;
  hash: string;
  metadata?: Record<string, unknown>;
}

export interface MerkleProof {
  leaf: MerkleLeaf;
  siblings: string[];
  positions: Array<'left' | 'right'>;
  root: string;
  verified: boolean;
}

export interface BatchMerkleProof {
  leaves: MerkleLeaf[];
  root: string;
  proofs: MerkleProof[];
}

export interface SignatureVerificationResult {
  valid: boolean;
  algorithm: string;
  signedBy: string;
  reason?: string;
  occurredAt: number;
}

export interface TimestampRecord {
  contentId: string;
  issuedAt: number;
  anchorChain: 'ethereum-testnet' | 'polygon-testnet' | 'solana-sim';
  transactionHash: string;
  confirmed: boolean;
}

export interface ZkProofSummary {
  proofId: string;
  statement: string;
  verified: boolean;
  confidence: number;
  generatedAt: number;
}

export interface NetworkNode {
  id: string;
  label: string;
  role: 'ingest' | 'validator' | 'curator' | 'edge' | 'storage';
  status: 'online' | 'offline' | 'degraded';
  latencyMs: number;
  reputation: number;
  incidents: number;
  region: string;
  connections: string[];
  consensusWeight: number;
}

export interface ConsensusSnapshot {
  height: number;
  algorithm: 'PBFT' | 'PoS' | 'HotStuff';
  leader: string;
  commitRate: number;
  finalitySeconds: number;
  disagreementRatio: number;
}

export interface NetworkIncident {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: number;
  resolvedAt?: number;
  impactedNodes: string[];
  remediation: string;
}

export interface MediaAsset {
  id: string;
  type: 'image' | 'audio' | 'video';
  title: string;
  fileName: string;
  hash: string;
  fingerprint: string;
  authenticityScore: number;
  similarityMatches: Array<{ assetId: string; score: number }>;
  moderationFlags: string[];
  lastUpdated: number;
}

export interface WatermarkRecord {
  assetId: string;
  watermarkStrength: number;
  detectionConfidence: number;
  reversible: boolean;
  appliedAt: number;
}

export interface ModerationInsight {
  assetId: string;
  riskLevel: 'low' | 'moderate' | 'high';
  policyViolations: string[];
  reviewer?: string;
  reviewedAt?: number;
}

export interface TrustMetric {
  label: string;
  score: number;
  trend: Array<{ timestamp: number; value: number }>;
  projection: Array<{ timestamp: number; value: number }>;
}

export interface AlertEvent {
  id: string;
  title: string;
  message: string;
  level: 'info' | 'warning' | 'critical';
  createdAt: number;
  acknowledged: boolean;
}

export interface RegistrationRecord {
  id: string;
  name: string;
  organization: string;
  registeredAt: number;
  role: string;
}

export interface ActivityRecord {
  id: string;
  summary: string;
  occurredAt: number;
  channel: 'system' | 'security' | 'comms' | 'admin';
}

export interface UserSummary {
  total: number;
  active: number;
  admin: number;
  suspended: number;
  biometricEnabled: number;
}

export type ScenarioImpact = 'info' | 'success' | 'warning' | 'critical';

export interface ScriptedScenario {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed';
  icon: string;
  lastUpdated?: number;
}

export interface ScenarioMoment {
  id: string;
  scenarioId: string;
  headline: string;
  details: string;
  impact: ScenarioImpact;
  occurredAt: number;
}

export type ScenarioEventType = 'registration' | 'activity' | 'metrics';

export interface ScenarioEventTiming {
  delayMs: number;
  duration: number;
}

export type ScenarioEvent =
  | {
      id: string;
      type: 'registration';
      payload: {
        impact: ScenarioImpact;
        headline: string;
        details: string;
        name: string;
        organization: string;
        role: string;
        activity: string;
        delta?: { total?: number; active?: number; admin?: number; suspended?: number; biometricEnabled?: number };
      };
      timing: ScenarioEventTiming;
    }
  | {
      id: string;
      type: 'activity';
      payload: {
        impact: ScenarioImpact;
        headline: string;
        details: string;
        summary: string;
        channel: 'system' | 'security' | 'comms' | 'admin';
      };
      timing: ScenarioEventTiming;
    }
  | {
      id: string;
      type: 'metrics';
      payload: {
        impact: ScenarioImpact;
        headline: string;
        details: string;
        delta: { total?: number; active?: number; admin?: number; suspended?: number; biometricEnabled?: number };
        activity?: { summary: string; channel: 'system' | 'security' | 'comms' | 'admin' };
      };
      timing: ScenarioEventTiming;
    };

export interface ScenarioCheckpoint {
  id: string;
  label: string;
  description: string;
  offsetMs: number;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  durationMs: number;
  complexity: 'Intro' | 'Moderate' | 'Advanced';
  expectedOutcomes: string[];
  preview: string;
  events: ScenarioEvent[];
  checkpoints: ScenarioCheckpoint[];
}

export interface ScenarioCheckpointState extends ScenarioCheckpoint {
  reached: boolean;
  reachedAt?: number;
}

export interface ScenarioPlayerState {
  activeScenarioId?: string;
  status: 'idle' | 'running' | 'paused' | 'completed';
  speed: number;
  elapsedMs: number;
  durationMs: number;
  checkpoints: ScenarioCheckpointState[];
  highlightedEventId?: string;
  scrubberMs: number;
  dispatchedEvents: string[];
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  details: string;
  createdAt: number;
  risk: 'none' | 'low' | 'moderate' | 'high';
}

export interface OperatorTask {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  slaMinutes: number;
  createdAt: number;
  updatedAt: number;
}

export interface TrainingScenario {
  id: string;
  name: string;
  description: string;
  attackVector: string;
  mitigationSteps: string[];
  completed: boolean;
}

export interface ApiWebhook {
  id: string;
  targetUrl: string;
  events: string[];
  lastInvocation?: number;
  healthy: boolean;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'sso' | 'data-import';
  enabled: boolean;
  lastSync?: number;
  issues?: string;
}

export interface DisasterRecoveryPlan {
  id: string;
  name: string;
  lastTested: number;
  rtoMinutes: number;
  rpoMinutes: number;
  status: 'ready' | 'needs-review' | 'outdated';
}

export interface UpgradeWindow {
  id: string;
  component: string;
  scheduledFor: number;
  durationMinutes: number;
  impactLevel: 'low' | 'medium' | 'high';
}

export interface SystemHealthMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
}

export interface PerformanceBenchmark {
  id: string;
  metric: string;
  baseline: number;
  current: number;
  target: number;
  unit: string;
}

export interface FraudPattern {
  id: string;
  description: string;
  confidence: number;
  impactedAssets: string[];
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
}

export interface OperatorState {
  loading: boolean;
  initializedAt?: number;
  networkNodes: NetworkNode[];
  consensus: ConsensusSnapshot;
  incidents: NetworkIncident[];
  mediaAssets: MediaAsset[];
  trustMetrics: TrustMetric[];
  alerts: AlertEvent[];
  userSummary: UserSummary;
  registrations: RegistrationRecord[];
  activityFeed: ActivityRecord[];
  scenarios: ScriptedScenario[];
  scenarioMoments: ScenarioMoment[];
  scenarioPlayer: ScenarioPlayerState;
  auditLog: AuditLogEntry[];
  tasks: OperatorTask[];
  training: TrainingScenario[];
  webhooks: ApiWebhook[];
  integrations: IntegrationStatus[];
  disasterPlans: DisasterRecoveryPlan[];
  upgrades: UpgradeWindow[];
  systemHealth: SystemHealthMetric[];
  benchmarks: PerformanceBenchmark[];
  fraudPatterns: FraudPattern[];
  tutorial: {
    steps: TutorialStep[];
    activeStep: number;
    visible: boolean;
  };
}
