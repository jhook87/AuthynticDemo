import React, { useCallback, useMemo } from 'react';
import { MetricCard } from '../shared/MetricCard';
import { StatusBadge } from '../shared/StatusBadge';
import { useOperatorStore } from '../../store';
import type { OperatorState } from '../../types';
import { formatLatency, formatPercentage, formatScore, formatTimestamp } from '../../utils/formatters';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  level: 'success' | 'warning' | 'error' | 'info';
}

const ACTIVITY_LEVEL_CLASS: Record<ActivityItem['level'], string> = {
  success: 'status-online',
  warning: 'status-offline',
  error: 'status-offline',
  info: 'status-online',
};

export const OperatorDashboard: React.FC = () => {
  const selectDashboardState = useCallback(
    (state: OperatorState) => ({
      consensus: state.consensus,
      trustMetrics: state.trustMetrics,
      networkNodes: state.networkNodes,
      alerts: state.alerts,
      incidents: state.incidents,
    }),
    [],
  );

  const { consensus, trustMetrics, networkNodes, alerts, incidents } = useOperatorStore(selectDashboardState);

  const featuredNodes = useMemo(() => networkNodes.slice(0, 5), [networkNodes]);
  const recentAlerts = useMemo(() => alerts.slice(0, 4), [alerts]);
  const recentIncidents = useMemo(() => incidents.slice(0, 4), [incidents]);

  const executiveMetrics = useMemo(
    () => [
      {
        title: 'Media Files Processed',
        value: '124,847',
        trend: '+23% this month',
        status: 'success' as const,
        icon: '📄',
      },
      {
        title: 'Fraud Attempts Blocked',
        value: '2,156',
        trend: '99.8% accuracy',
        status: 'success' as const,
        icon: '🛡️',
      },
      {
        title: 'Average Verification Time',
        value: '1.2s',
        trend: '-34% improvement',
        status: 'info' as const,
        icon: '⚡',
      },
      {
        title: 'Network Health',
        value: `${formatPercentage(consensus.commitRate * 100)}`,
        trend: `Finality ${consensus.finalitySeconds.toFixed(2)}s`,
        status: 'success' as const,
        icon: '🌐',
      },
    ],
    [consensus.commitRate, consensus.finalitySeconds],
  );

  const activityFeed = useMemo<ActivityItem[]>(() => {
    const alertActivities = recentAlerts.map<ActivityItem>((alert) => ({
      id: alert.id,
      title: alert.title,
      description: alert.message,
      timestamp: formatTimestamp(alert.createdAt),
      level: alert.level === 'critical' ? 'error' : alert.level === 'warning' ? 'warning' : 'info',
    }));

    const incidentActivities = recentIncidents.map<ActivityItem>((incident) => ({
      id: incident.id,
      title: incident.description,
      description: incident.remediation,
      timestamp: formatTimestamp(incident.detectedAt),
      level: incident.severity === 'high' ? 'error' : incident.severity === 'medium' ? 'warning' : 'success',
    }));

    return [...alertActivities, ...incidentActivities]
      .slice(0, 6)
      .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
  }, [recentAlerts, recentIncidents]);

  return (
    <div className="container">
      <header className="dashboard-header fade-in">
        <h1 className="text-display-1">Operator Dashboard</h1>
        <p className="text-body-lg">
          Real-time media provenance monitoring, fraud detection, and blockchain consensus analytics for enterprise teams.
        </p>
      </header>

      <section className="dashboard-grid fade-in" style={{ animationDelay: '0.1s' }}>
        {executiveMetrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            trend={metric.trend}
            status={metric.status}
            icon={metric.icon}
          />
        ))}
      </section>

      <section className="dashboard-charts grid grid-2 fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="card">
          <h2 className="text-heading-2">Consensus Snapshot</h2>
          <p className="text-muted">Automated consensus rotation and resilience telemetry.</p>
          <div className="activity-list" style={{ marginTop: '1.5rem' }}>
            <div className="activity-item">
              <span className="status-badge status-online">Leader</span>
              <div className="activity-meta">
                <strong>{consensus.leader}</strong>
                <span className="text-muted">Current height {consensus.height.toLocaleString()}</span>
              </div>
              <span className="text-muted">{consensus.algorithm}</span>
            </div>
            <div className="activity-item">
              <span className="status-badge status-online">Commit</span>
              <div className="activity-meta">
                <strong>{formatPercentage(consensus.commitRate * 100)}</strong>
                <span className="text-muted">Disagreement {formatPercentage(consensus.disagreementRatio * 100)}</span>
              </div>
              <span className="text-muted">Finality {consensus.finalitySeconds.toFixed(2)}s</span>
            </div>
          </div>
        </div>
        <div className="card">
          <h2 className="text-heading-2">Trust Metrics</h2>
          <p className="text-muted">Confidence indicators across ingestion, verification, and distribution.</p>
          <div className="activity-list" style={{ marginTop: '1.5rem' }}>
            {trustMetrics.slice(0, 3).map((metric) => (
              <div className="activity-item" key={metric.label}>
                <span className="status-badge status-online">{metric.label}</span>
                <div className="activity-meta">
                  <strong>{formatScore(metric.score)}</strong>
                  <span className="text-muted">
                    Trend {formatScore((metric.trend.length > 0 ? metric.trend[metric.trend.length - 1]?.value : undefined) ?? metric.score)}
                  </span>
                </div>
                <span className="text-muted">
                  Projection {formatScore((metric.projection.length > 0 ? metric.projection[0]?.value : undefined) ?? metric.score)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card fade-in" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-heading-2">Active Network</h2>
        <p className="text-muted">Operational health across gateway, oracle, and validation nodes.</p>
        <div className="activity-list" style={{ marginTop: '1.5rem' }}>
          {featuredNodes.map((node) => (
            <div className="activity-item" key={node.id}>
              <StatusBadge status={node.status} />
              <div className="activity-meta">
                <strong>{node.label}</strong>
                <span className="text-muted">Latency {formatLatency(node.latencyMs)}</span>
              </div>
              <span className="text-muted">Reputation {formatPercentage(node.reputation * 100)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="activity-feed card fade-in" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-heading-2">Live Activity Feed</h2>
        <p className="text-muted">Curated insight stream of fraud prevention, remediation, and compliance events.</p>
        <div className="activity-list">
          {activityFeed.map((activity) => (
            <div className="activity-item" key={activity.id}>
              <span className={`status-badge ${ACTIVITY_LEVEL_CLASS[activity.level]}`}>{activity.level}</span>
              <div className="activity-meta">
                <strong>{activity.title}</strong>
                <span className="text-muted">{activity.description}</span>
              </div>
              <span className="text-muted">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
