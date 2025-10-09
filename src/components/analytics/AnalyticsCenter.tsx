import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOperatorStore } from '../../store';
import { formatPercentage } from '../../utils/formatters';
import { demoInteractionService } from '../../services/demo/demoInteractionService';
import type { OperatorState } from '../../types';

export const AnalyticsCenter = () => {
  const selectAnalyticsState = useCallback(
    (state: OperatorState) => ({
      trustMetrics: state.trustMetrics,
      benchmarks: state.benchmarks,
      fraudPatterns: state.fraudPatterns,
    }),
    [],
  );
  const { trustMetrics, benchmarks, fraudPatterns } = useOperatorStore(selectAnalyticsState);
  const panelRef = useRef<HTMLElement | null>(null);
  const [spotlight, setSpotlight] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const clearSpotlight = useCallback(() => {
    if (timeoutRef.current !== null) {
      if (typeof window !== 'undefined') {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = null;
    }
  }, []);

  const projected = useMemo(
    () =>
      trustMetrics.map((metric) => ({
        label: metric.label,
        nextHour: metric.projection[0]?.value ?? metric.score,
        trend: metric.trend.slice(-4).map((entry) => entry.value),
      })),
    [trustMetrics],
  );

  useEffect(
    () =>
      demoInteractionService.on('analytics.scrollToIntelligence', () => {
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setSpotlight(true);
        clearSpotlight();
        if (typeof window !== 'undefined') {
          timeoutRef.current = window.setTimeout(() => {
            setSpotlight(false);
            clearSpotlight();
          }, 2000);
        }
      }),
    [clearSpotlight],
  );

  useEffect(
    () => () => {
      clearSpotlight();
    },
    [clearSpotlight],
  );

  return (
    <section
      ref={panelRef}
      className={`panel analytics-panel${spotlight ? ' analytics-panel--spotlight' : ''}`}
    >
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
