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
  setScenarioStatus,
  pushScenarioMoment,
} from '../store';
import { simulateLatencyShift, simulateStatusChanges, simulatePartition, recoverPartition } from '../services/network/networkSimulationService';
import { simulateConsensus } from '../services/network/consensusService';
import { adjustReputation } from '../services/network/reputationService';
import { buildTrustMetrics, buildPerformanceBenchmarks } from '../services/api/reportingService';
import { generateIncidents } from '../services/api/incidentService';
import { randomId } from '../utils/random';
import { SCENARIO_SCRIPTS, scenarioEventId } from '../constants/scenarios';

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
      const { networkNodes } = operatorStore.getState();
      const shifted = simulateLatencyShift(networkNodes);
      const { nodes: adjusted } = adjustReputation(shifted);
      updateNetworkNodes(simulateStatusChanges(adjusted));
    }, 8_000);

    const consensusInterval = window.setInterval(() => {
      const { consensus, networkNodes } = operatorStore.getState();
      updateConsensus(simulateConsensus(consensus, networkNodes));
    }, 10_000);

    const trustInterval = window.setInterval(() => {
      updateTrustMetrics(buildTrustMetrics());
      updateBenchmarks(buildPerformanceBenchmarks());
    }, 20_000);

    const incidentInterval = window.setInterval(() => {
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
        updateNetworkNodes(recoverPartition([segmentA, segmentB]));
      }, 7_000);
    }, 15_000);

    const scenarioTimers: number[] = [];
    let totalDelay = 0;

    SCENARIO_SCRIPTS.forEach((script) => {
      const scenarioStartDelay = totalDelay + script.delayMs;
      scenarioTimers.push(
        window.setTimeout(() => {
          setScenarioStatus(script.id, 'running');
        }, scenarioStartDelay),
      );

      let eventCursor = scenarioStartDelay;
      script.events.forEach(({ delayMs, payload }) => {
        eventCursor += delayMs;
        scenarioTimers.push(
          window.setTimeout(() => {
            const occurredAt = Date.now();
            pushScenarioMoment({
              id: scenarioEventId(),
              scenarioId: script.id,
              headline: payload.headline,
              details: payload.details,
              impact: payload.impact,
              occurredAt,
            });

            if (payload.type === 'registration') {
              pushRegistration({
                id: randomId('registration'),
                name: payload.name,
                organization: payload.organization,
                role: payload.role,
                registeredAt: occurredAt,
              });
              applyImpactToSummary(payload.delta ?? {});
              pushActivity({
                id: randomId('activity'),
                summary: payload.activity,
                occurredAt,
                channel: 'admin',
              });
            }

            if (payload.type === 'activity') {
              pushActivity({
                id: randomId('activity'),
                summary: payload.summary,
                occurredAt,
                channel: payload.channel,
              });
            }

            if (payload.type === 'metrics') {
              applyImpactToSummary(payload.delta);
              if (payload.activity) {
                pushActivity({
                  id: randomId('activity'),
                  summary: payload.activity.summary,
                  occurredAt,
                  channel: payload.activity.channel,
                });
              }
            }
          }, eventCursor),
        );
      });

      const completionDelay = eventCursor + 1_000;
      scenarioTimers.push(
        window.setTimeout(() => {
          setScenarioStatus(script.id, 'completed');
        }, completionDelay),
      );

      totalDelay = completionDelay + 4_000;
    });

    return () => {
      window.clearInterval(latencyInterval);
      window.clearInterval(consensusInterval);
      window.clearInterval(trustInterval);
      window.clearInterval(incidentInterval);
      window.clearTimeout(partitionTimeout);
      scenarioTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [enabled]);
};
