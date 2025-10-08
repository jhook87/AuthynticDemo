import { useEffect } from 'react';
import {
  operatorStore,
  updateNetworkNodes,
  updateConsensus,
  pushAlert,
  updateIncidents,
  updateBenchmarks,
  updateTrustMetrics,
} from '../store';
import { simulateLatencyShift, simulateStatusChanges, simulatePartition, recoverPartition } from '../services/network/networkSimulationService';
import { simulateConsensus } from '../services/network/consensusService';
import { adjustReputation } from '../services/network/reputationService';
import { buildTrustMetrics, buildPerformanceBenchmarks } from '../services/api/reportingService';
import { generateIncidents } from '../services/api/incidentService';
import { randomId } from '../utils/random';

export const useRealtimeSimulation = () => {
  useEffect(() => {
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

    return () => {
      window.clearInterval(latencyInterval);
      window.clearInterval(consensusInterval);
      window.clearInterval(trustInterval);
      window.clearInterval(incidentInterval);
      window.clearTimeout(partitionTimeout);
    };
  }, []);
};
