import { useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { NavLink } from './Router';
import { useOperatorStore } from '../../store';
import type { OperatorState } from '../../types';
import { formatPercentage } from '../../utils/formatters';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Network', path: '/network' },
  { label: 'Media', path: '/media' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Operations', path: '/settings' },
];

export const Layout = ({ children }: LayoutProps) => {
  const selectSystemState = useCallback(
    (state: OperatorState) => ({
      alerts: state.alerts,
      consensus: state.consensus,
      networkNodes: state.networkNodes,
    }),
    [],
  );

  const { alerts, consensus, networkNodes } = useOperatorStore(selectSystemState);

  const unresolvedAlerts = useMemo(() => alerts.filter((alert) => !alert.acknowledged), [alerts]);
  const criticalAlerts = useMemo(
    () => alerts.filter((alert) => alert.level === 'critical' && !alert.acknowledged),
    [alerts],
  );
  const onlineNodes = useMemo(
    () => networkNodes.filter((node) => node.status === 'online').length,
    [networkNodes],
  );
  const degradedNodes = useMemo(
    () => networkNodes.filter((node) => node.status === 'degraded').length,
    [networkNodes],
  );

  return (
    <div className="app-shell">
      <aside className="app-nav" aria-label="Primary navigation">
        <div className="app-nav__brand">
          <span className="app-nav__crest" aria-hidden="true" />
          <div>
            <h1>Authyntic Command</h1>
            <p>Mission Authority: Media Provenance Division</p>
          </div>
        </div>
        <nav className="command-nav">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className="command-nav__link">
              <span className="command-nav__marker" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="command-nav__intel" aria-live="polite">
          <div className="command-nav__intel-row">
            <span>Unresolved Alerts</span>
            <strong>{unresolvedAlerts.length}</strong>
          </div>
          <div className="command-nav__intel-row" data-variant="critical">
            <span>Critical</span>
            <strong>{criticalAlerts.length}</strong>
          </div>
          <div className="command-nav__intel-row" data-variant="online">
            <span>Nodes Operational</span>
            <strong>
              {onlineNodes}/{networkNodes.length}
            </strong>
          </div>
          <div className="command-nav__intel-row" data-variant="degraded">
            <span>Nodes Degraded</span>
            <strong>{degradedNodes}</strong>
          </div>
        </div>
      </aside>
      <div className="app-shell__main">
        <header className="command-header" role="banner">
          <div className="command-header__left">
            <p className="command-header__eyebrow">Global Operations Console</p>
            <h2>Authyntic Strategic Control</h2>
            <p>Real-time provenance defense, consensus assurance, and adversarial mitigation.</p>
          </div>
          <div className="command-header__right">
            <div className="command-header__stat">
              <span>Consensus Integrity</span>
              <strong>{formatPercentage(consensus.commitRate * 100)}</strong>
            </div>
            <div className="command-header__stat">
              <span>Finality</span>
              <strong>{consensus.finalitySeconds.toFixed(2)}s</strong>
            </div>
            <div className="command-header__stat" data-variant="warning">
              <span>Disagreement</span>
              <strong>{formatPercentage(consensus.disagreementRatio * 100)}</strong>
            </div>
          </div>
        </header>
        <main className="app-main">{children}</main>
        <footer className="system-strip" aria-label="System health indicators">
          <div className="system-strip__item">
            <span className="system-strip__label">Network Height</span>
            <span className="system-strip__value">{consensus.height.toLocaleString()}</span>
          </div>
          <div className="system-strip__item">
            <span className="system-strip__label">Alerts Pending</span>
            <span className="system-strip__value" data-variant={criticalAlerts.length > 0 ? 'alert' : 'stable'}>
              {unresolvedAlerts.length}
            </span>
          </div>
          <div className="system-strip__item">
            <span className="system-strip__label">Operational Nodes</span>
            <span className="system-strip__value">{onlineNodes}</span>
          </div>
          <div className="system-strip__item">
            <span className="system-strip__label">Degraded Nodes</span>
            <span className="system-strip__value" data-variant={degradedNodes > 0 ? 'warning' : 'stable'}>
              {degradedNodes}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};
