import { MetricCard } from '../shared/MetricCard';
import { useOperatorStore } from '../../store';
import { formatRelativeTime } from '../../utils/formatters';
import { AUTHENTICITY_THRESHOLDS } from '../../constants';

const scenarioIcon: Record<string, string> = {
  users: '👥',
  shield: '🛡️',
  fingerprint: '🔐',
  alert: '⚠️',
};

export const OperatorDashboard = () => {
  const { consensus, trustMetrics, systemHealth, userSummary, registrations, activityFeed, scenarios, scenarioMoments } =
    useOperatorStore((state) => ({
      consensus: state.consensus,
      trustMetrics: state.trustMetrics.slice(0, 3),
      systemHealth: state.systemHealth,
      userSummary: state.userSummary,
      registrations: state.registrations,
      activityFeed: state.activityFeed,
      scenarios: state.scenarios,
      scenarioMoments: state.scenarioMoments,
    }));

  const activeScenario = scenarios.find((scenario) => scenario.status === 'running');

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

      <section className="panel scenario-panel">
        <div className="panel-header">
          <div>
            <h3>Simulation timeline</h3>
            <p>Four looping scenarios animate the account lifecycle and highlight demo-only automation beats.</p>
          </div>
          <div className="scenario-statuses">
            {scenarios.map((scenario) => (
              <span key={scenario.id} className={`scenario-pill scenario-${scenario.status}`}>
                <span className="scenario-icon">{scenarioIcon[scenario.icon] ?? '●'}</span>
                {scenario.title}
              </span>
            ))}
          </div>
        </div>
        <div className="scenario-feed">
          {scenarioMoments.length === 0 ? (
            <p className="scenario-placeholder">Simulation warming up… scripted updates will appear here momentarily.</p>
          ) : (
            <ul>
              {scenarioMoments.map((moment) => (
                <li key={moment.id} className={`scenario-event scenario-${moment.impact}`}>
                  <header>
                    <span>{formatRelativeTime(moment.occurredAt)}</span>
                    <strong>{scenarios.find((scenario) => scenario.id === moment.scenarioId)?.title ?? 'Scenario'}</strong>
                  </header>
                  <h4>{moment.headline}</h4>
                  <p>{moment.details}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <footer className="scenario-footer">
          <span>Active scenario:</span>
          <strong>{activeScenario ? activeScenario.title : 'Waiting for next run'}</strong>
          <span>Scenarios loop for show-and-tell only.</span>
        </footer>
      </section>

      <div className="panel-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Recent registrations</h3>
              <p>Latest accounts created in the platform.</p>
            </div>
          </div>
          <ul className="registration-list">
            {registrations.length === 0 ? (
              <li className="empty">No recent users</li>
            ) : (
              registrations.map((record) => (
                <li key={record.id}>
                  <div>
                    <strong>{record.name}</strong>
                    <span>{record.role}</span>
                  </div>
                  <div>
                    <span>{record.organization}</span>
                    <small>{formatRelativeTime(record.registeredAt)}</small>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Recently active</h3>
              <p>Latest automation events across the control plane.</p>
            </div>
          </div>
          <ul className="activity-list">
            {activityFeed.length === 0 ? (
              <li className="empty">No recent activity</li>
            ) : (
              activityFeed.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.summary}</strong>
                  </div>
                  <small>{formatRelativeTime(item.occurredAt)}</small>
                </li>
              ))
            )}
          </ul>
        </section>
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
