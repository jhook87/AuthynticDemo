import { useEffect } from 'react';
import {
  operatorStore,
  updateNetworkNodes,
  updateConsensus,
  pushAlert,
  updateIncidents,
  updateBenchmarks,
  updateTrustMetrics,
  pushRegistration,
  pushActivity,
  updateUserSummary,
  pushScenarioMoment,
  updateScenarioElapsed,
  markScenarioEventDispatched,
  reachScenarioCheckpoint,
  setScenarioHighlight,
  completeScenarioRun,
} from '../store';
import { simulateLatencyShift, simulateStatusChanges, simulatePartition, recoverPartition } from '../services/network/networkSimulationService';
import { simulateConsensus } from '../services/network/consensusService';
import { adjustReputation } from '../services/network/reputationService';
import { buildTrustMetrics, buildPerformanceBenchmarks } from '../services/api/reportingService';
import { generateIncidents } from '../services/api/incidentService';
import { randomId } from '../utils/random';
import { getScenarioDefinition, scenarioEventId } from '../constants/scenarios';

const isDocumentVisible = () =>
  typeof document === 'undefined' || document.visibilityState !== 'hidden';

const applyImpactToSummary = (impact: { total?: number; active?: number; admin?: number; suspended?: number; biometricEnabled?: number }) => {
  updateUserSummary((summary) => ({
    ...summary,
    total: summary.total + (impact.total ?? 0),
    active: summary.active + (impact.active ?? 0),
    admin: summary.admin + (impact.admin ?? 0),
    suspended: Math.max(0, summary.suspended + (impact.suspended ?? 0)),
    biometricEnabled: summary.biometricEnabled + (impact.biometricEnabled ?? 0),
  }));
};

export const useRealtimeSimulation = (enabled = true) => {
  useEffect(() => {
    if (!enabled) {
      return () => undefined;
    }

    const latencyInterval = window.setInterval(() => {
      if (!isDocumentVisible()) return;
      const { networkNodes } = operatorStore.getState();
      const shifted = simulateLatencyShift(networkNodes);
      const { nodes: adjusted } = adjustReputation(shifted);
      updateNetworkNodes(simulateStatusChanges(adjusted));
    }, 8_000);

    const consensusInterval = window.setInterval(() => {
      if (!isDocumentVisible()) return;
      const { consensus, networkNodes } = operatorStore.getState();
      updateConsensus(simulateConsensus(consensus, networkNodes));
    }, 10_000);

    const trustInterval = window.setInterval(() => {
      if (!isDocumentVisible()) return;
      updateTrustMetrics(buildTrustMetrics());
      updateBenchmarks(buildPerformanceBenchmarks());
    }, 20_000);

    const incidentInterval = window.setInterval(() => {
      if (!isDocumentVisible()) return;
      const { networkNodes } = operatorStore.getState();
      updateIncidents(generateIncidents(networkNodes.map((node) => node.id)));
      pushAlert({
        id: randomId('alert'),
        title: 'Network drift detected',
        message: 'Validator consensus variance exceeded 5%.',
        level: Math.random() > 0.7 ? 'critical' : 'warning',
        createdAt: Date.now(),
        acknowledged: false,
      });
    }, 30_000);

    const partitionTimeout = window.setTimeout(() => {
      if (!isDocumentVisible()) {
        return;
      }
      const { networkNodes } = operatorStore.getState();
      const [segmentA, segmentB] = simulatePartition(networkNodes);
      pushAlert({
        id: randomId('alert'),
        title: 'Partition simulation',
        message: 'Testing node recovery after partition event.',
        level: 'info',
        createdAt: Date.now(),
        acknowledged: false,
      });
      window.setTimeout(() => {
        if (!isDocumentVisible()) return;
        updateNetworkNodes(recoverPartition([segmentA, segmentB]));
      }, 7_000);
    }, 15_000);

    let rafId = 0;
    let lastTick = 0;

    const processScenarioEvents = (scenarioId: string, elapsedMs: number) => {
      const definition = getScenarioDefinition(scenarioId);
      if (!definition) {
        return;
      }

      definition.events.forEach((event) => {
        if (elapsedMs < event.timing.delayMs) {
          return;
        }

        const { dispatchedEvents } = operatorStore.getState().scenarioPlayer;
        if (dispatchedEvents.includes(event.id)) {
          return;
        }

        markScenarioEventDispatched(event.id);
        const occurredAt = Date.now();
        const momentId = scenarioEventId();

        pushScenarioMoment({
          id: momentId,
          scenarioId,
          headline: event.payload.headline,
          details: event.payload.details,
          impact: event.payload.impact,
          occurredAt,
        });

        setScenarioHighlight(momentId);

        if (event.type === 'registration') {
          pushRegistration({
            id: randomId('registration'),
            name: event.payload.name,
            organization: event.payload.organization,
            role: event.payload.role,
            registeredAt: occurredAt,
          });
          if (event.payload.delta) {
            applyImpactToSummary(event.payload.delta);
          }
          pushActivity({
            id: randomId('activity'),
            summary: event.payload.activity,
            occurredAt,
            channel: 'admin',
          });
        }

        if (event.type === 'activity') {
          pushActivity({
            id: randomId('activity'),
            summary: event.payload.summary,
            occurredAt,
            channel: event.payload.channel,
          });
        }

        if (event.type === 'metrics') {
          applyImpactToSummary(event.payload.delta);
          if (event.payload.activity) {
            pushActivity({
              id: randomId('activity'),
              summary: event.payload.activity.summary,
              occurredAt,
              channel: event.payload.activity.channel,
            });
          }
        }
      });

      definition.checkpoints.forEach((checkpoint) => {
        if (elapsedMs >= checkpoint.offsetMs) {
          reachScenarioCheckpoint(scenarioId, checkpoint.id);
        }
      });

      if (elapsedMs >= definition.durationMs) {
        completeScenarioRun(scenarioId);
      }
    };

    const tick = (timestamp: number) => {
      if (!isDocumentVisible()) {
        lastTick = timestamp;
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      const { scenarioPlayer } = operatorStore.getState();
      if (scenarioPlayer.status === 'running' && scenarioPlayer.activeScenarioId) {
        if (!lastTick) {
          lastTick = timestamp;
        }
        const delta = (timestamp - lastTick) * (scenarioPlayer.speed || 1);
        const nextElapsed = scenarioPlayer.elapsedMs + delta;
        const definition = getScenarioDefinition(scenarioPlayer.activeScenarioId);
        const duration = definition?.durationMs ?? scenarioPlayer.durationMs;
        const clampedElapsed = Math.min(nextElapsed, duration);
        if (clampedElapsed !== scenarioPlayer.elapsedMs) {
          updateScenarioElapsed(clampedElapsed);
          processScenarioEvents(scenarioPlayer.activeScenarioId, clampedElapsed);
        }
        lastTick = timestamp;
      } else {
        lastTick = timestamp;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame((time) => {
      lastTick = time;
      tick(time);
    });

    return () => {
      window.clearInterval(latencyInterval);
      window.clearInterval(consensusInterval);
      window.clearInterval(trustInterval);
      window.clearInterval(incidentInterval);
      window.clearTimeout(partitionTimeout);
      window.cancelAnimationFrame(rafId);
    };
  }, [enabled]);
};
