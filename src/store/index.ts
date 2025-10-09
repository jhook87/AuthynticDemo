import { useEffect, useRef, useState } from 'react';
import type {
  AlertEvent,
  AuditLogEntry,
  ConsensusSnapshot,
  MediaAsset,
  NetworkIncident,
  NetworkNode,
  OperatorState,
  PerformanceBenchmark,
  SystemHealthMetric,
  TrustMetric,
  TutorialProgressState,
} from '../types';
import { createStore } from './createStore';
import { bootstrapNetwork } from '../services/network/networkSimulationService';
import { initialConsensus } from '../services/network/consensusService';
import { generateIncidents } from '../services/api/incidentService';
import { buildTrustMetrics, buildPerformanceBenchmarks } from '../services/api/reportingService';
import { buildAuditTrail } from '../services/storage/auditLogService';
import { minutesAgo, hoursFromNow } from '../utils/time';
import { randomId } from '../utils/random';
import { demoInteractionService } from '../services/demo/demoInteractionService';

const initialNodes = bootstrapNetwork();

const createInitialTutorialProgress = (): TutorialProgressState => ({
  activeStep: 0,
  completedStepIds: [],
  visible: true,
  wasDismissed: false,
});

const tutorialSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Authyntic Operator',
    description: 'This guided tour highlights the most impressive parts of the demo console.',
    target: '.app-nav',
    helperText: 'Use the global navigation to jump between live demo workspaces.',
  },
  {
    id: 'dashboard-overview',
    title: 'Monitor the live consensus posture',
    description: 'The dashboard summarizes consensus, trust and incident activity for quick situational awareness.',
    target: '.dashboard-grid',
  },
  {
    id: 'media-upload',
    title: 'Upload media for verification',
    description: 'Trigger the simulated authenticity pipeline to see hashing, watermarking and moderation in action.',
    target: '.media-upload',
    helperText: 'Press the Simulate upload button inside the media panel to watch the pipeline animate.',
    demoAction: () => demoInteractionService.trigger('media.simulateUpload'),
  },
  {
    id: 'hash-visualizer',
    title: 'Animated cryptographic pipeline',
    description: 'Watch our dramatized hashing workflow complete with staged progress updates for the demo.',
    target: '.crypto-progress',
    demoAction: () => demoInteractionService.trigger('media.focusHashPanel'),
  },
  {
    id: 'network-operations',
    title: 'Consortium network awareness',
    description: 'Follow consensus leaders, latencies and topology shifts from the animated network view.',
    target: '.network-visualization',
    demoAction: () => demoInteractionService.trigger('network.highlightConsensus'),
  },
  {
    id: 'analytics-intelligence',
    title: 'Predictive analytics',
    description: 'Dive into projections, benchmarks and fraud pattern discovery inside analytics.',
    target: '.analytics-panel',
    demoAction: () => demoInteractionService.trigger('analytics.scrollToIntelligence'),
  },
  {
    id: 'demo-complete',
    title: 'You are ready to explore',
    description: 'Experiment freely across the workspaces and reopen the tour helper whenever you need a refresher.',
    target: '.app-nav__brand',
    ctaLabel: 'Finish tour',
  },
] as const;

const initialState: OperatorState = {
  loading: true,
  initializedAt: undefined,
  networkNodes: initialNodes,
  consensus: initialConsensus(initialNodes),
  incidents: generateIncidents(initialNodes.map((node) => node.id)),
  mediaAssets: [],
  trustMetrics: buildTrustMetrics(),
  alerts: [],
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
    steps: [...tutorialSteps],
    progress: createInitialTutorialProgress(),
  },
};

const store = createStore(initialState);

export const operatorStore = store;

const shallowEqual = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) {
    return true;
  }
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    for (let index = 0; index < a.length; index += 1) {
      if (!Object.is(a[index], b[index])) {
        return false;
      }
    }
    return true;
  }
  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false;
    }
    if (!Object.is((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
      return false;
    }
  }
  return true;
};

const defaultEquality = <Value,>(a: Value, b: Value) => shallowEqual(a, b);

export const useOperatorStore = <T>(
  selector: (state: OperatorState) => T,
  equalityFn: (a: T, b: T) => boolean = defaultEquality,
): T => {
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  const equalityRef = useRef(equalityFn);
  equalityRef.current = equalityFn;

  const [selection, setSelection] = useState<T>(() => selector(store.getState()));
  const selectionRef = useRef(selection);
  selectionRef.current = selection;

  useEffect(() => {
    const unsubscribe = store.subscribe((nextState) => {
      const nextSelection = selectorRef.current(nextState);
      setSelection((previous) => {
        if (equalityRef.current(previous, nextSelection)) {
          return previous;
        }
        selectionRef.current = nextSelection;
        return nextSelection;
      });
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const nextSelection = selector(store.getState());
    setSelection((previous) => {
      if (equalityFn(previous, nextSelection)) {
        return previous;
      }
      selectionRef.current = nextSelection;
      return nextSelection;
    });
  }, [selector, equalityFn]);

  return selection;
};

export const initializeStore = (state: Partial<OperatorState>) => {
  store.setState({ ...state, loading: false, initializedAt: Date.now() } as Partial<OperatorState>);
};

export const updateNetworkNodes = (nodes: NetworkNode[]) => {
  store.setState({ networkNodes: nodes });
};

export const pushAlert = (alert: AlertEvent) => {
  store.setState(({ alerts }) => ({ alerts: [alert, ...alerts].slice(0, 10) }));
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
  store.setState(({ tutorial }) => {
    const { steps, progress } = tutorial;
    const currentStep = steps[progress.activeStep];
    const completed = new Set(progress.completedStepIds);
    if (currentStep) {
      completed.add(currentStep.id);
    }
    const isLastStep = progress.activeStep >= steps.length - 1;
    const nextIndex = isLastStep ? progress.activeStep : progress.activeStep + 1;
    return {
      tutorial: {
        steps,
        progress: {
          activeStep: nextIndex,
          completedStepIds: Array.from(completed),
          visible: !isLastStep,
          wasDismissed: isLastStep ? true : progress.wasDismissed,
        },
      },
    };
  });
};

export const dismissTutorial = () => {
  store.setState(({ tutorial }) => ({
    tutorial: {
      steps: tutorial.steps,
      progress: { ...tutorial.progress, visible: false, wasDismissed: true },
    },
  }));
};

export const openTutorial = () => {
  store.setState(({ tutorial }) => ({
    tutorial: {
      steps: tutorial.steps,
      progress: { ...tutorial.progress, visible: true, wasDismissed: false },
    },
  }));
};

export const goToTutorialStep = (stepId: string) => {
  store.setState(({ tutorial }) => {
    const index = tutorial.steps.findIndex((step) => step.id === stepId);
    if (index === -1) {
      return { tutorial };
    }
    return {
      tutorial: {
        steps: tutorial.steps,
        progress: {
          ...tutorial.progress,
          activeStep: index,
          visible: true,
        },
      },
    };
  });
};

export const resetTutorial = () => {
  store.setState(() => ({
    tutorial: {
      steps: [...tutorialSteps],
      progress: createInitialTutorialProgress(),
    },
  }));
};

export const restoreTutorialProgress = (progress: Partial<TutorialProgressState>) => {
  store.setState(({ tutorial }) => {
    const stepIds = new Set(tutorial.steps.map((step) => step.id));
    const sanitizedCompleted = (progress.completedStepIds ?? tutorial.progress.completedStepIds).filter((id) =>
      stepIds.has(id),
    );
    const activeStep = Math.max(
      0,
      Math.min(tutorial.steps.length - 1, progress.activeStep ?? tutorial.progress.activeStep),
    );
    return {
      tutorial: {
        steps: tutorial.steps,
        progress: {
          activeStep,
          completedStepIds: sanitizedCompleted,
          visible: progress.visible ?? tutorial.progress.visible,
          wasDismissed: progress.wasDismissed ?? tutorial.progress.wasDismissed,
        },
      },
    };
  });
};
