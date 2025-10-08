import { useMemo } from 'react';
import { useOperatorStore } from '../../store';
import { formatPercentage } from '../../utils/formatters';

export const AnalyticsCenter = () => {
  const { trustMetrics, benchmarks, fraudPatterns } = useOperatorStore((state) => ({
    trustMetrics: state.trustMetrics,
    benchmarks: state.benchmarks,
    fraudPatterns: state.fraudPatterns,
  }));

  const projected = useMemo(
    () =>
      trustMetrics.map((metric) => ({
        label: metric.label,
        nextHour: metric.projection[0]?.value ?? metric.score,
        trend: metric.trend.slice(-4).map((entry) => entry.value),
      })),
    [trustMetrics],
  );

  return (
    <section className="panel analytics-panel">
      <header>
        <h2>Advanced analytics</h2>
        <p>Trend forecasting and anomaly detection across the Authyntic network.</p>
      </header>
      <div className="analytics-grid">
        <section>
          <h3>Trust projections</h3>
          <ul>
            {projected.map((projection) => (
              <li key={projection.label}>
                <strong>{projection.label}</strong>
                <span>Next hour {projection.nextHour.toFixed(1)}</span>
                <span>Recent trend {projection.trend.map((value) => value.toFixed(0)).join(' → ')}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Performance benchmarks</h3>
          <ul>
            {benchmarks.map((benchmark) => (
              <li key={benchmark.id}>
                <strong>{benchmark.metric}</strong>
                <span>Current {benchmark.current} {benchmark.unit}</span>
                <span>Target {benchmark.target} {benchmark.unit}</span>
                <span>Δ {(benchmark.current - benchmark.baseline).toFixed(2)} {benchmark.unit}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Fraud patterns</h3>
          <ul>
            {fraudPatterns.map((pattern) => (
              <li key={pattern.id}>
                <strong>{pattern.description}</strong>
                <span>Confidence {formatPercentage(pattern.confidence * 100)}</span>
                <span>Impacted assets {pattern.impactedAssets.length}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
};
