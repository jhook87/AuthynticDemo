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

const initialNodes = bootstrapNetwork();

const buildInitialUserSummary = (): UserSummary => ({
  total: 128,
  active: 117,
  admin: 24,
  suspended: 6,
  biometricEnabled: 42,
});

const initialScenarios: ScriptedScenario[] = [
  {
    id: 'onboarding-surge',
    title: 'Onboarding Surge',
    description: 'Coordinated rollout of new operator credentials.',
    status: 'pending',
    icon: 'users',
  },
  {
    id: 'role-hardening',
    title: 'Role Hardening',
    description: 'Privilege updates for admin cohort.',
    status: 'pending',
    icon: 'shield',
  },
  {
    id: 'biometric-pilot',
    title: 'Biometric Pilot',
    description: 'FIDO2 activation and attestation checks.',
    status: 'pending',
    icon: 'fingerprint',
  },
  {
    id: 'suspension-review',
    title: 'Suspension Review',
    description: 'Trust team sweeps inactive or risky accounts.',
    status: 'pending',
    icon: 'alert',
  },
];

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
