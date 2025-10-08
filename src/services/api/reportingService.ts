import type { PerformanceBenchmark, TrustMetric } from '../../types';
import { minutesAgo } from '../../utils/time';
import { randomFloat } from '../../utils/random';

export const buildTrustMetrics = (): TrustMetric[] => {
  const labels = ['Global trust', 'Editorial confidence', 'Distribution reliability'];
  return labels.map((label, index) => ({
    label,
    score: randomFloat(70, 96),
    trend: Array.from({ length: 12 }, (_, step) => ({
      timestamp: minutesAgo((12 - step) * 15),
      value: randomFloat(65, 95),
    })),
    projection: Array.from({ length: 6 }, (_, step) => ({
      timestamp: Date.now() + step * 30 * 60_000,
      value: randomFloat(70, 98),
    })),
  }));
};

export const buildPerformanceBenchmarks = (): PerformanceBenchmark[] => [
  {
    id: 'ingest-throughput',
    metric: 'Ingest throughput',
    baseline: 320,
    current: 410,
    target: 450,
    unit: 'assets/min',
  },
  {
    id: 'latency',
    metric: 'Median verification latency',
    baseline: 2.4,
    current: 1.8,
    target: 1.6,
    unit: 'seconds',
  },
];
