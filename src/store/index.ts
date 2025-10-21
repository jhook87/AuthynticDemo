import { useSyncExternalStore } from 'react';
import type {
  ActivityRecord,
  AlertEvent,
  AuditLogEntry,
  ConsensusSnapshot,
  MediaAsset,
  NetworkIncident,
  NetworkNode,
  OperatorState,
  PerformanceBenchmark,
  RegistrationRecord,
  ScenarioMoment,
  ScriptedScenario,
  ScenarioPlayerState,
  SystemHealthMetric,
  TrustMetric,
  UserSummary,
} from '../types';
import { createStore } from './createStore';
import { bootstrapNetwork } from '../services/network/networkSimulationService';
import { initialConsensus } from '../services/network/consensusService';
import { generateIncidents } from '../services/api/incidentService';
import { buildTrustMetrics, buildPerformanceBenchmarks } from '../services/api/reportingService';
import { buildAuditTrail } from '../services/storage/auditLogService';
import { minutesAgo, hoursFromNow } from '../utils/time';
import { randomId } from '../utils/random';
import { SCENARIO_LIBRARY } from '../constants/scenarios';

const initialNodes = bootstrapNetwork();

const buildInitialUserSummary = (): UserSummary => ({
  total: 128,
  active: 117,
  admin: 24,
  suspended: 6,
  biometricEnabled: 42,
});

const scenarioMeta: Record<string, { icon: string; description: string }> = {
  'onboarding-surge': {
    icon: 'users',
    description: 'Coordinated rollout of new operator credentials.',
  },
  'role-hardening': {
    icon: 'shield',
    description: 'Privilege updates for admin cohort.',
  },
  'biometric-pilot': {
    icon: 'fingerprint',
    description: 'FIDO2 activation and attestation checks.',
  },
  'suspension-review': {
    icon: 'alert',
    description: 'Trust team sweeps inactive or risky accounts.',
  },
  'threat-detection': {
    icon: 'radar',
    description: 'Simulated detection of coordinated authenticity attacks.',
  },
  'network-partition-recovery': {
    icon: 'network',
    description: 'Automated recovery after a synthetic partition.',
  },
  'multi-factor-auth-flow': {
    icon: 'lock',
    description: 'Adaptive multi-factor authentication walkthrough.',
  },
  'trust-score-evolution': {
    icon: 'pulse',
    description: 'Trust scoring projections under shifting signals.',
  },
};

const initialScenarios: ScriptedScenario[] = SCENARIO_LIBRARY.map((scenario) => ({
  id: scenario.id,
  title: scenario.name,
  description: scenarioMeta[scenario.id]?.description ?? scenario.expectedOutcomes[0],
  status: 'pending',
  icon: scenarioMeta[scenario.id]?.icon ?? 'pulse',
}));

const initialScenarioPlayer: ScenarioPlayerState = {
  activeScenarioId: undefined,
  status: 'idle',
  speed: 1,
  elapsedMs: 0,
  durationMs: 0,
  checkpoints: [],
  highlightedEventId: undefined,
  scrubberMs: 0,
  dispatchedEvents: [],
};

const initialState: OperatorState = {
  loading: true,
  initializedAt: undefined,
  networkNodes: initialNodes,
  consensus: initialConsensus(initialNodes),
  incidents: generateIncidents(initialNodes.map((node) => node.id)),
  mediaAssets: [],
  trustMetrics: buildTrustMetrics(),
  alerts: [],
  userSummary: buildInitialUserSummary(),
  registrations: [],
  activityFeed: [],
  scenarios: initialScenarios,
  scenarioMoments: [],
  scenarioPlayer: initialScenarioPlayer,
  auditLog: buildAuditTrail(),
  tasks: [
    {
      id: randomId('task'),
      title: 'Review flagged authenticity case',
      status: 'in-progress',
      slaMinutes: 45,
      createdAt: minutesAgo(25),
      updatedAt: minutesAgo(5),
    },
    {
      id: randomId('task'),
      title: 'Approve new consortium node',
      status: 'pending',
      slaMinutes: 120,
      createdAt: minutesAgo(60),
      updatedAt: minutesAgo(60),
    },
  ],
  training: [
    {
      id: randomId('scenario'),
      name: 'Deepfake disinformation wave',
      description: 'Operators coordinate to quarantine malicious assets across regions.',
      attackVector: 'Coordinated deepfake campaign',
      mitigationSteps: ['Alert node operators', 'Throttle distribution', 'Provide fact-check context'],
      completed: false,
    },
  ],
  webhooks: [
    {
      id: randomId('webhook'),
      targetUrl: 'https://hooks.authyntic.internal/alerts',
      events: ['alert.triggered', 'consensus.finalized'],
      lastInvocation: minutesAgo(4),
      healthy: true,
    },
  ],
  integrations: [
    {
      id: randomId('integration'),
      name: 'SSO / Auth0',
      type: 'sso',
      enabled: true,
      lastSync: minutesAgo(10),
    },
  ],
  disasterPlans: [
    {
      id: randomId('dr'),
      name: 'Primary region outage',
      lastTested: minutesAgo(480),
      rtoMinutes: 30,
      rpoMinutes: 5,
      status: 'ready',
    },
  ],
  upgrades: [
    {
      id: randomId('upgrade'),
      component: 'Consensus engine',
      scheduledFor: hoursFromNow(12),
      durationMinutes: 45,
      impactLevel: 'medium',
    },
  ],
  systemHealth: [
    {
      id: 'uptime',
      label: 'Global uptime',
      value: 99.95,
      unit: '%',
      threshold: 99.5,
      status: 'good',
    },
    {
      id: 'latency',
      label: 'Median latency',
      value: 1.8,
      unit: 's',
      threshold: 3,
      status: 'good',
    },
  ],
  benchmarks: buildPerformanceBenchmarks(),
  fraudPatterns: [
    {
      id: randomId('fraud'),
      description: 'Rapid asset reposting signature',
      confidence: 0.72,
      impactedAssets: [],
    },
  ],
  tutorial: {
    steps: [
      {
        id: 'overview',
        title: 'Welcome to the operator console',
        description: 'Review health, trust, and consensus at a glance.',
      },
      {
        id: 'media',
        title: 'Inspect media authenticity',
        description: 'Dive deep into hashing, watermarking, and moderation signals.',
      },
      {
        id: 'network',
        title: 'Monitor network topology',
        description: 'Simulate consensus, partitions, and recovery events.',
      },
    ],
    activeStep: 0,
    visible: true,
  },
};

const store = createStore(initialState);

export const operatorStore = store;

export const useOperatorStore = <T>(selector: (state: OperatorState) => T): T =>
  useSyncExternalStore(store.subscribe, () => selector(store.getState()));

export const initializeStore = (state: Partial<OperatorState>) => {
  store.setState({ ...state, loading: false, initializedAt: Date.now() } as Partial<OperatorState>);
};

export const updateNetworkNodes = (nodes: NetworkNode[]) => {
  store.setState({ networkNodes: nodes });
};

export const pushAlert = (alert: AlertEvent) => {
  store.setState(({ alerts }) => ({ alerts: [alert, ...alerts].slice(0, 10) }));
};

export const acknowledgeAlert = (alertId: string) => {
  store.setState(({ alerts }) => ({
    alerts: alerts.map((alert) =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert,
    ),
  }));
};

export const updateUserSummary = (updater: (summary: UserSummary) => UserSummary) => {
  store.setState(({ userSummary }) => ({ userSummary: updater(userSummary) }));
};

export const pushRegistration = (record: RegistrationRecord) => {
  store.setState(({ registrations }) => ({ registrations: [record, ...registrations].slice(0, 6) }));
};

export const pushActivity = (record: ActivityRecord) => {
  store.setState(({ activityFeed }) => ({ activityFeed: [record, ...activityFeed].slice(0, 8) }));
};

export const setScenarioStatus = (scenarioId: string, status: ScriptedScenario['status']) => {
  store.setState(({ scenarios }) => ({
    scenarios: scenarios.map((scenario) =>
      scenario.id === scenarioId ? { ...scenario, status, lastUpdated: Date.now() } : scenario,
    ),
  }));
};

export const startScenario = (scenarioId: string) => {
  const definition = SCENARIO_LIBRARY.find((scenario) => scenario.id === scenarioId);
  if (!definition) {
    return;
  }

  store.setState(({ scenarios, scenarioPlayer }) => ({
    scenarios: scenarios.map((scenario) =>
      scenario.id === scenarioId
        ? { ...scenario, status: 'running', lastUpdated: Date.now() }
        : scenario.status === 'running'
        ? { ...scenario, status: 'pending' }
        : scenario,
    ),
    scenarioPlayer: {
      ...scenarioPlayer,
      activeScenarioId: scenarioId,
      status: 'running',
      speed: scenarioPlayer.speed || 1,
      elapsedMs: 0,
      durationMs: definition.durationMs,
      checkpoints: definition.checkpoints.map((checkpoint) => ({
        ...checkpoint,
        reached: false,
        reachedAt: undefined,
      })),
      highlightedEventId: undefined,
      scrubberMs: 0,
      dispatchedEvents: [],
    },
  }));
};

export const pauseScenario = () => {
  store.setState(({ scenarioPlayer }) => ({
    scenarioPlayer: !scenarioPlayer.activeScenarioId
      ? scenarioPlayer
      : { ...scenarioPlayer, status: 'paused' },
  }));
};

export const resumeScenario = () => {
  store.setState(({ scenarioPlayer }) => ({
    scenarioPlayer:
      scenarioPlayer.activeScenarioId && scenarioPlayer.status !== 'running'
        ? { ...scenarioPlayer, status: 'running' }
        : scenarioPlayer,
  }));
};

export const resetScenarioPlayer = () => {
  store.setState(({ scenarios }) => ({
    scenarios: scenarios.map((scenario) => ({ ...scenario, status: 'pending' })),
    scenarioPlayer: { ...initialScenarioPlayer },
  }));
};

export const setScenarioSpeed = (speed: number) => {
  const clamped = Math.min(4, Math.max(0.5, Number.isFinite(speed) ? speed : 1));
  store.setState(({ scenarioPlayer }) => ({
    scenarioPlayer: { ...scenarioPlayer, speed: clamped },
  }));
};

export const updateScenarioElapsed = (elapsedMs: number) => {
  store.setState(({ scenarioPlayer }) => {
    const bounded = Math.min(Math.max(elapsedMs, 0), scenarioPlayer.durationMs || elapsedMs);
    const shouldSyncScrubber = Math.abs(scenarioPlayer.scrubberMs - scenarioPlayer.elapsedMs) < 80;
    return {
      scenarioPlayer: {
        ...scenarioPlayer,
        elapsedMs: bounded,
        scrubberMs: shouldSyncScrubber ? bounded : scenarioPlayer.scrubberMs,
      },
    };
  });
};

export const setScenarioScrubber = (scrubberMs: number) => {
  store.setState(({ scenarioPlayer }) => ({
    scenarioPlayer: {
      ...scenarioPlayer,
      scrubberMs: Math.min(Math.max(scrubberMs, 0), scenarioPlayer.durationMs || scrubberMs),
    },
  }));
};

export const markScenarioEventDispatched = (eventId: string) => {
  store.setState(({ scenarioPlayer }) => ({
    scenarioPlayer: scenarioPlayer.dispatchedEvents.includes(eventId)
      ? scenarioPlayer
      : { ...scenarioPlayer, dispatchedEvents: [...scenarioPlayer.dispatchedEvents, eventId] },
  }));
};

export const reachScenarioCheckpoint = (scenarioId: string, checkpointId: string) => {
  store.setState(({ scenarioPlayer }) => ({
    scenarioPlayer:
      scenarioPlayer.activeScenarioId !== scenarioId
        ? scenarioPlayer
        : {
            ...scenarioPlayer,
            checkpoints: scenarioPlayer.checkpoints.map((checkpoint) =>
              checkpoint.id === checkpointId && !checkpoint.reached
                ? { ...checkpoint, reached: true, reachedAt: Date.now() }
                : checkpoint,
            ),
          },
  }));
};

export const setScenarioHighlight = (momentId?: string) => {
  store.setState(({ scenarioPlayer }) => ({
    scenarioPlayer: { ...scenarioPlayer, highlightedEventId: momentId },
  }));
};

export const completeScenarioRun = (scenarioId: string) => {
  store.setState(({ scenarios, scenarioPlayer }) => ({
    scenarios: scenarios.map((scenario) =>
      scenario.id === scenarioId
        ? { ...scenario, status: 'completed', lastUpdated: Date.now() }
        : scenario,
    ),
    scenarioPlayer:
      scenarioPlayer.activeScenarioId === scenarioId
        ? {
            ...scenarioPlayer,
            status: 'completed',
            elapsedMs: scenarioPlayer.durationMs,
            scrubberMs: scenarioPlayer.durationMs,
          }
        : scenarioPlayer,
  }));
};

export const pushScenarioMoment = (moment: ScenarioMoment) => {
  store.setState(({ scenarioMoments }) => ({
    scenarioMoments: [moment, ...scenarioMoments].slice(0, 12),
  }));
};

export const resetScenarios = () => {
  store.setState({
    scenarios: initialScenarios.map((scenario) => ({ ...scenario })),
    scenarioMoments: [],
    registrations: [],
    activityFeed: [],
    userSummary: buildInitialUserSummary(),
    scenarioPlayer: { ...initialScenarioPlayer },
  });
};

export const updateIncidents = (incidents: NetworkIncident[]) => {
  store.setState({ incidents });
};

export const updateConsensus = (consensus: ConsensusSnapshot) => {
  store.setState({ consensus });
};

export const upsertMediaAssets = (assets: MediaAsset[]) => {
  store.setState({ mediaAssets: assets });
};

export const updateTrustMetrics = (metrics: TrustMetric[]) => {
  store.setState({ trustMetrics: metrics });
};

export const updateAuditLog = (entries: AuditLogEntry[]) => {
  store.setState({ auditLog: entries });
};

export const updateSystemHealth = (metrics: SystemHealthMetric[]) => {
  store.setState({ systemHealth: metrics });
};

export const updateBenchmarks = (benchmarks: PerformanceBenchmark[]) => {
  store.setState({ benchmarks });
};

export const completeTutorialStep = () => {
  store.setState(({ tutorial }) => ({
    tutorial: {
      ...tutorial,
      activeStep: Math.min(tutorial.steps.length - 1, tutorial.activeStep + 1),
      visible: tutorial.activeStep + 1 < tutorial.steps.length,
    },
  }));
};
