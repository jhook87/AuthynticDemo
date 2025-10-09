import React, { useCallback, useMemo } from 'react';
import { MetricCard } from '../shared/MetricCard';
import { StatusBadge } from '../shared/StatusBadge';
import { useOperatorStore } from '../../store';
import type { NetworkNode, OperatorState } from '../../types';
import { formatLatency, formatPercentage, formatScore, formatTimestamp } from '../../utils/formatters';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  level: 'success' | 'warning' | 'error' | 'info';
}

const CLASSIFICATION_LABEL: Record<ActivityItem['level'], string> = {
  success: 'BRIEFING',
  warning: 'CLASSIFIED',
  error: 'TOP SECRET',
  info: 'ADVISORY',
};

const PRIORITY_BAND: Record<ActivityItem['level'], string> = {
  success: 'priority-low',
  warning: 'priority-medium',
  error: 'priority-high',
  info: 'priority-info',
};

const getSparklineFromTrend = (values: Array<{ value: number }>) =>
  values.map((entry) => entry.value);

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
  const tacticalNodes = useMemo(() => networkNodes.slice(0, 9), [networkNodes]);
  const recentAlerts = useMemo(() => alerts.slice(0, 4), [alerts]);
  const recentIncidents = useMemo(() => incidents.slice(0, 4), [incidents]);

  const executiveMetrics = useMemo(
    () => [
      {
        title: 'Media Assets Verified',
        value: '124,847',
        trend: '+23% throughput',
        status: 'success' as const,
        icon: '⌁',
        progress: 86,
        sparkline: [62, 68, 71, 78, 85, 89, 92, 95],
        active: true,
      },
      {
        title: 'Fraud Attempts Neutralized',
        value: '2,156',
        trend: '99.8% interception',
        status: 'success' as const,
        icon: '⛨',
        progress: 94,
        sparkline: [54, 59, 63, 72, 80, 88, 96, 97],
        active: true,
      },
      {
        title: 'Average Verification Time',
        value: '1.2s',
        trend: '-34% latency delta',
        status: 'info' as const,
        icon: '⚡',
        progress: 68,
        sparkline: [32, 30, 28, 25, 22, 20, 18, 17],
        active: false,
      },
      {
        title: 'Network Health Index',
        value: `${formatPercentage(consensus.commitRate * 100)}`,
        trend: `Finality ${consensus.finalitySeconds.toFixed(2)}s`,
        status: consensus.disagreementRatio < 0.1 ? ('success' as const) : ('warning' as const),
        icon: '🛰',
        progress: consensus.commitRate * 100,
        sparkline: getSparklineFromTrend(trustMetrics[0]?.trend ?? []),
        active: true,
      },
    ],
    [consensus.commitRate, consensus.disagreementRatio, consensus.finalitySeconds, trustMetrics],
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
      .slice(0, 8)
      .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
  }, [recentAlerts, recentIncidents]);

  const nodeLayouts = useMemo(() => {
    if (tacticalNodes.length === 0) {
      return [] as Array<NetworkNode & { x: number; y: number }>;
    }

    return tacticalNodes.map((node, index) => {
      const angle = (index / tacticalNodes.length) * Math.PI * 2;
      const radius = 22 + ((index % 3) + 1) * 10;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;
      return { ...node, x, y };
    });
  }, [tacticalNodes]);

  const connectionLines = useMemo(() => {
    const lines: Array<{ from: { x: number; y: number }; to: { x: number; y: number } }> = [];
    const nodeMap = new Map(nodeLayouts.map((node) => [node.id, node]));
    const seen = new Set<string>();

    nodeLayouts.forEach((node) => {
      node.connections.forEach((targetId) => {
        const target = nodeMap.get(targetId);
        if (!target) return;
        const key = [node.id, target.id].sort().join('-');
        if (seen.has(key)) return;
        seen.add(key);
        lines.push({ from: { x: node.x, y: node.y }, to: { x: target.x, y: target.y } });
      });
    });

    return lines;
  }, [nodeLayouts]);

  return (
    <div className="command-center">
      <section className="command-center__metrics">
        {executiveMetrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            trend={metric.trend}
            status={metric.status}
            icon={metric.icon}
            progress={metric.progress}
            sparkline={metric.sparkline}
            isActive={metric.active}
          />
        ))}
      </section>

      <section className="command-center__panels">
        <article className="tactical-panel consensus-monitor" aria-label="Consensus telemetry">
          <header className="tactical-panel__header">
            <h3>Consensus Watch</h3>
            <span className="panel-badge">{consensus.algorithm}</span>
          </header>
          <div className="consensus-monitor__grid">
            <div className="consensus-monitor__dial" role="img" aria-label="Consensus health visualization">
              <svg viewBox="0 0 160 160">
                <defs>
                  <linearGradient id="dial-primary" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--accent-cyan)" />
                    <stop offset="100%" stopColor="var(--accent-green)" />
                  </linearGradient>
                  <linearGradient id="dial-secondary" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-violet)" />
                    <stop offset="100%" stopColor="var(--accent-amber)" />
                  </linearGradient>
                </defs>
                <circle className="dial-ring" cx="80" cy="80" r="62" />
                <circle
                  className="dial-progress dial-progress--primary"
                  cx="80"
                  cy="80"
                  r="62"
                  strokeDasharray={2 * Math.PI * 62}
                  strokeDashoffset={(1 - consensus.commitRate) * 2 * Math.PI * 62}
                />
                <circle
                  className="dial-progress dial-progress--secondary"
                  cx="80"
                  cy="80"
                  r="48"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={consensus.disagreementRatio * 2 * Math.PI * 48}
                />
                <circle className="dial-core" cx="80" cy="80" r="24" />
              </svg>
              <div className="dial-readout">
                <span className="dial-readout__label">Commit</span>
                <span className="dial-readout__value">{formatPercentage(consensus.commitRate * 100)}</span>
                <span className="dial-readout__metric">Finality {consensus.finalitySeconds.toFixed(2)}s</span>
              </div>
            </div>
            <div className="consensus-monitor__intel">
              <div className="intel-block">
                <span className="intel-label">Current Leader</span>
                <strong className="intel-value">{consensus.leader}</strong>
                <span className="intel-sub">Height {consensus.height.toLocaleString()}</span>
              </div>
              <div className="intel-block">
                <span className="intel-label">Leader Protection</span>
                <div className="intel-progress" aria-hidden="true">
                  <span style={{ width: `${Math.min(100, consensus.commitRate * 120)}%` }} />
                </div>
                <span className="intel-sub">Disagreement {formatPercentage(consensus.disagreementRatio * 100)}</span>
              </div>
              <div className="intel-block">
                <span className="intel-label">Block Height</span>
                <div className="intel-odometer" aria-live="polite">
                  {consensus.height.toLocaleString().split('').map((digit, index) => (
                    <span key={`${digit}-${index}`}>{digit}</span>
                  ))}
                </div>
                <span className="intel-sub">Finality Window {consensus.finalitySeconds.toFixed(2)}s</span>
              </div>
            </div>
          </div>
        </article>

        <article className="tactical-panel network-operations" aria-label="Network topology">
          <header className="tactical-panel__header">
            <h3>Network Topology</h3>
            <span className="panel-badge panel-badge--success">{formatPercentage(consensus.commitRate * 100)} Integrity</span>
          </header>
          <div className="network-map">
            <svg className="network-map__connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {connectionLines.map((line, index) => (
                <line
                  key={`line-${index}`}
                  x1={line.from.x}
                  y1={line.from.y}
                  x2={line.to.x}
                  y2={line.to.y}
                />
              ))}
            </svg>
            <div className="network-map__radar" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            {nodeLayouts.map((node) => (
              <button
                key={node.id}
                type="button"
                className="network-map__node"
                data-status={node.status}
                style={{
                  '--node-x': `${node.x}%`,
                  '--node-y': `${node.y}%`,
                  '--node-latency': Math.min(1, node.latencyMs / 1500),
                } as React.CSSProperties}
                aria-label={`${node.label} ${node.status} latency ${formatLatency(node.latencyMs)}`}
              >
                <span className="network-map__node-glow" aria-hidden="true" />
                <span className="network-map__node-label">{node.label}</span>
              </button>
            ))}
          </div>
          <div className="network-operations__intel">
            {featuredNodes.map((node) => (
              <div className="network-operations__row" key={`intel-${node.id}`}>
                <StatusBadge status={node.status} />
                <div className="network-operations__meta">
                  <strong>{node.label}</strong>
                  <span>{node.region.toUpperCase()} • Latency {formatLatency(node.latencyMs)}</span>
                </div>
                <span className="network-operations__score">{formatPercentage(node.reputation * 100)}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="command-center__intel">
        <article className="tactical-panel trust-intel" aria-label="Trust metrics">
          <header className="tactical-panel__header">
            <h3>Trust Lattice</h3>
            <span className="panel-badge">Projection</span>
          </header>
          <div className="trust-intel__grid">
            {trustMetrics.slice(0, 3).map((metric) => {
              const latestTrend =
                metric.trend.length > 0 ? metric.trend[metric.trend.length - 1]?.value ?? metric.score : metric.score;
              const projected = metric.projection.length > 0 ? metric.projection[0]?.value ?? metric.score : metric.score;
              return (
                <div className="trust-intel__item" key={metric.label}>
                  <div className="trust-intel__label">{metric.label}</div>
                  <div className="trust-intel__value">{formatScore(metric.score)}</div>
                  <div className="trust-intel__bars" aria-hidden="true">
                    <span style={{ width: `${Math.min(100, metric.score)}%` }} />
                    <span style={{ width: `${Math.min(100, latestTrend)}%` }} />
                    <span style={{ width: `${Math.min(100, projected)}%` }} />
                  </div>
                  <div className="trust-intel__meta">
                    <span>Trend {formatScore(latestTrend)}</span>
                    <span>Projection {formatScore(projected)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="tactical-panel mission-feed" aria-label="Mission feed">
          <header className="tactical-panel__header">
            <h3>Mission Feed</h3>
            <span className="panel-badge panel-badge--warning">Live</span>
          </header>
          <div className="mission-feed__timeline" aria-live="polite">
            {activityFeed.map((activity, index) => (
              <details
                key={activity.id}
                className={`mission-feed__item ${PRIORITY_BAND[activity.level]}`}
                data-branch={index % 2 === 0 ? 'left' : 'right'}
                open={index === 0}
              >
                <summary>
                  <span className="mission-feed__badge">{CLASSIFICATION_LABEL[activity.level]}</span>
                  <div className="mission-feed__summary">
                    <strong>{activity.title}</strong>
                    <span>{activity.timestamp}</span>
                  </div>
                </summary>
                <div className="mission-feed__details">
                  <p>{activity.description}</p>
                  <button type="button" className="mission-feed__action">
                    Acknowledge
                  </button>
                </div>
              </details>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};
