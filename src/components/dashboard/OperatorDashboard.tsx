import { MetricCard } from '../shared/MetricCard';
import { useOperatorStore } from '../../store';
import { AUTHENTICITY_THRESHOLDS } from '../../constants';
import { ScenarioPlayer } from '../scenario/ScenarioPlayer';
import { MetricsVisualizer } from '../scenario/MetricsVisualizer';
import { NetworkSimulator } from '../scenario/NetworkSimulator';
import { ActivityMonitor } from '../scenario/ActivityMonitor';

export const OperatorDashboard = () => {
  const { consensus, trustMetrics, systemHealth, userSummary } = useOperatorStore((state) => ({
    consensus: state.consensus,
    trustMetrics: state.trustMetrics.slice(0, 3),
    systemHealth: state.systemHealth,
    userSummary: state.userSummary,
  }));

  return (
    <section className="strategic-dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Simulation overview</p>
          <h2>Strategic control demo</h2>
          <span>
            A stylised preview of the production console showing scripted telemetry, onboarding signals, and
            authenticity posture.
          </span>
        </div>
        <div className="dashboard-meta">
          <div>
            <span>Consensus lead (simulated)</span>
            <strong>{consensus.leader}</strong>
            <small>{consensus.algorithm} • Height {consensus.height.toLocaleString()}</small>
          </div>
          <div>
            <span>Demo finality</span>
            <strong>{consensus.finalitySeconds.toFixed(1)}s</strong>
            <small>{(consensus.commitRate * 100).toFixed(1)}% commit rate</small>
          </div>
        </div>
      </header>

      <div className="summary-grid">
        <MetricCard title="Total users" value={userSummary.total.toLocaleString()} footer="Registered accounts" accent="blue" />
        <MetricCard title="Active users" value={userSummary.active.toLocaleString()} footer="Currently active sessions" accent="green" />
        <MetricCard title="Admin accounts" value={userSummary.admin.toLocaleString()} footer="Delegated permissions" accent="amber" />
        <MetricCard title="Suspended users" value={userSummary.suspended.toLocaleString()} footer="Temporarily disabled" accent="rose" />
        <MetricCard
          title="Biometric enabled"
          value={userSummary.biometricEnabled.toLocaleString()}
          footer="Using passkey + biometric"
          accent="green"
        />
      </div>

      <ScenarioPlayer />

      <div className="scenario-visualization-grid">
        <NetworkSimulator />
        <MetricsVisualizer />
        <ActivityMonitor />
      </div>

      <section className="panel trust-health">
        <div className="panel-header">
          <div>
            <h3>Trust posture</h3>
            <p>Signal-driven overview of authenticity metrics.</p>
          </div>
        </div>
        <div className="trust-metrics">
          {trustMetrics.map((metric) => (
            <MetricCard
              key={metric.label}
              title={metric.label}
              value={`${metric.score.toFixed(0)}/100`}
              footer={`Trend ${(metric.trend[metric.trend.length - 1]?.value ?? metric.score).toFixed(0)}/100`}
              accent={metric.score > AUTHENTICITY_THRESHOLDS.trusted ? 'green' : 'amber'}
            />
          ))}
        </div>
        <div className="health-grid">
          {systemHealth.map((metric) => (
            <MetricCard
              key={metric.id}
              title={metric.label}
              value={`${metric.value}${metric.unit}`}
              footer={`Threshold ${metric.threshold}${metric.unit}`}
              accent={metric.status === 'good' ? 'green' : metric.status === 'warning' ? 'amber' : 'rose'}
            />
          ))}
        </div>
      </section>
    </section>
  );
};
