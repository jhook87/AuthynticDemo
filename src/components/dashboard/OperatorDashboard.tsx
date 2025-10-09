import { MetricCard } from '../shared/MetricCard';
import { StatusBadge } from '../shared/StatusBadge';
import { useOperatorStore } from '../../store';
import { formatLatency, formatPercentage, formatScore, formatTimestamp } from '../../utils/formatters';
import { AUTHENTICITY_THRESHOLDS } from '../../constants';

export const OperatorDashboard = () => {
  const { consensus, trustMetrics, systemHealth, networkNodes, alerts, incidents } = useOperatorStore((state) => ({
    consensus: state.consensus,
    trustMetrics: state.trustMetrics,
    systemHealth: state.systemHealth,
    networkNodes: state.networkNodes.slice(0, 6),
    alerts: state.alerts.slice(0, 4),
    incidents: state.incidents.slice(0, 4),
  }));

  return (
    <section className="dashboard-grid">
      <header className="panel">
        <div>
          <h2>Consensus</h2>
          <p>Monitoring algorithm rotations and finality health.</p>
        </div>
        <div className="consensus-summary">
          <MetricCard
            title={`Algorithm – ${consensus.algorithm}`}
            value={`${consensus.commitRate.toFixed(2)} commit rate`}
            footer={`Finality ${consensus.finalitySeconds.toFixed(2)} seconds`}
          />
          <MetricCard
            title={`Height ${consensus.height}`}
            value={`Leader ${consensus.leader}`}
            footer={`Disagreement ${formatPercentage(consensus.disagreementRatio * 100)}`}
            accent="amber"
          />
        </div>
      </header>

      <section className="panel trust-panel">
        <h2>Trust posture</h2>
        <div className="trust-metrics">
          {trustMetrics.map((metric) => (
            <MetricCard
              key={metric.label}
              title={metric.label}
              value={formatScore(metric.score)}
              footer={`Trend ${formatScore(metric.trend[metric.trend.length - 1]?.value ?? metric.score)}`}
              accent={metric.score > AUTHENTICITY_THRESHOLDS.trusted ? 'green' : 'rose'}
            />
          ))}
        </div>
      </section>

      <section className="panel network-panel">
        <h2>Active nodes</h2>
        <table>
          <thead>
            <tr>
              <th>Node</th>
              <th>Status</th>
              <th>Latency</th>
              <th>Reputation</th>
            </tr>
          </thead>
          <tbody>
            {networkNodes.map((node) => (
              <tr key={node.id}>
                <td>{node.label}</td>
                <td>
                  <StatusBadge status={node.status} />
                </td>
                <td>{formatLatency(node.latencyMs)}</td>
                <td>{formatPercentage(node.reputation * 100)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel alerts-panel">
        <h2>Alerts</h2>
        <ul>
          {alerts.map((alert) => (
            <li key={alert.id} className={`alert-${alert.level}`}>
              <strong>{alert.title}</strong>
              <span>{formatTimestamp(alert.createdAt)}</span>
              <p>{alert.message}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel incidents-panel">
        <h2>Incident response</h2>
        <ul>
          {incidents.map((incident) => (
            <li key={incident.id}>
              <header>
                <span className={`incident-${incident.severity}`}>{incident.severity}</span>
                <time>{formatTimestamp(incident.detectedAt)}</time>
              </header>
              <p>{incident.description}</p>
              <footer>{incident.remediation}</footer>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel health-panel">
        <h2>System health</h2>
        <div className="health-grid">
          {systemHealth.map((metric) => (
            <MetricCard
              key={metric.id}
              title={metric.label}
              value={`${metric.value} ${metric.unit}`}
              footer={`Threshold ${metric.threshold} ${metric.unit}`}
              accent={metric.status === 'good' ? 'green' : metric.status === 'warning' ? 'amber' : 'rose'}
            />
          ))}
        </div>
      </section>
    </section>
  );
};
