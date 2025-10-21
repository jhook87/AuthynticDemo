import { useMemo } from 'react';
import { useOperatorStore } from '../../store';

const toPercent = (value: number, total: number) => {
  if (!total) return '0%';
  return `${Math.min(100, Math.max(0, (value / total) * 100)).toFixed(1)}%`;
};

export const MetricsVisualizer = () => {
  const { userSummary, trustMetrics, benchmarks, scenarioPlayer } = useOperatorStore((state) => ({
    userSummary: state.userSummary,
    trustMetrics: state.trustMetrics,
    benchmarks: state.benchmarks,
    scenarioPlayer: state.scenarioPlayer,
  }));

  const adoption = useMemo(
    () => toPercent(userSummary.biometricEnabled, userSummary.total || 1),
    [userSummary],
  );

  return (
    <section className="metrics-visualizer">
      <header>
        <h3>Metrics dashboard</h3>
        <span>Realtime indicators update as scripted events execute.</span>
      </header>
      <div className="metrics-visualizer__grid">
        <div className="metric-panel" title="Total registered demo accounts">
          <header>
            <span>Total users</span>
            <strong>{userSummary.total.toLocaleString()}</strong>
          </header>
          <footer>
            <span>{userSummary.active.toLocaleString()} active</span>
            <span>{userSummary.admin.toLocaleString()} admins</span>
          </footer>
        </div>
        <div className="metric-panel" title="Biometric enrollments across the cohort">
          <header>
            <span>Biometric adoption</span>
            <strong>{adoption}</strong>
          </header>
          <footer>
            <span>{userSummary.biometricEnabled.toLocaleString()} enrolled</span>
            <span>{userSummary.total.toLocaleString()} total</span>
          </footer>
        </div>
        <div className="metric-panel" title="Suspended accounts awaiting review">
          <header>
            <span>Suspension states</span>
            <strong>{userSummary.suspended.toLocaleString()}</strong>
          </header>
          <footer>
            <span>Auto remediation when scenarios reinstate users.</span>
          </footer>
        </div>
        <div className="metric-panel" title="Playback progress for the active scenario">
          <header>
            <span>Scenario progress</span>
            <strong>
              {scenarioPlayer.durationMs
                ? `${Math.min(100, ((scenarioPlayer.elapsedMs / scenarioPlayer.durationMs) * 100) || 0).toFixed(0)}%`
                : 'Idle'}
            </strong>
          </header>
          <footer>
            <span>{scenarioPlayer.status}</span>
            <span>{scenarioPlayer.speed.toFixed(1)}x speed</span>
          </footer>
        </div>
      </div>

      <div className="metrics-visualizer__trust">
        <h4>Trust posture</h4>
        <ul>
          {trustMetrics.slice(0, 3).map((metric) => {
            const latest = metric.trend[metric.trend.length - 1]?.value ?? metric.score;
            const projected = metric.projection[metric.projection.length - 1]?.value ?? metric.score;
            return (
              <li key={metric.label} title={`Current ${metric.score.toFixed(1)} / 100`}>
                <div className="trust-label">
                  <span>{metric.label}</span>
                  <strong>{metric.score.toFixed(0)}</strong>
                </div>
                <div className="trust-bar">
                  <span style={{ width: `${Math.min(100, metric.score)}%` }} />
                  <em style={{ left: `${Math.min(100, projected)}%` }} title={`Projected ${projected.toFixed(0)}`} />
                </div>
                <small>{`Trend ${latest.toFixed(0)} · Forecast ${projected.toFixed(0)}`}</small>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="metrics-visualizer__benchmarks">
        <h4>Performance benchmarks</h4>
        <table>
          <thead>
            <tr>
              <th scope="col">Metric</th>
              <th scope="col">Current</th>
              <th scope="col">Target</th>
              <th scope="col">Baseline</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.slice(0, 4).map((benchmark) => (
              <tr key={benchmark.id}>
                <th scope="row">{benchmark.metric}</th>
                <td title="Current benchmark reading">{`${benchmark.current}${benchmark.unit}`}</td>
                <td title="Target objective">{`${benchmark.target}${benchmark.unit}`}</td>
                <td title="Historical baseline">{`${benchmark.baseline}${benchmark.unit}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MetricsVisualizer;

