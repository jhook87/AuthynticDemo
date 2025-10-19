import type { ReactNode } from 'react';
import { NavLink } from './Router';
import { useOperatorStore } from '../../store';

interface LayoutProps {
  children: ReactNode;
  darkMode: boolean;
  onToggleTheme: () => void;
  operator: {
    name: string;
    role: string;
  };
  onSignOut: () => void;
}

const navItems = [
  { label: 'Strategic Dashboard', path: '/' },
  { label: 'Operator Network', path: '/network' },
  { label: 'Media Operations', path: '/media' },
  { label: 'Network Analytics', path: '/analytics' },
  { label: 'Configuration', path: '/settings' },
];

export const Layout = ({ children, darkMode, onToggleTheme, operator, onSignOut }: LayoutProps) => {
  const alerts = useOperatorStore((state) => state.alerts);
  const activeAlerts = alerts.filter((alert) => !alert.acknowledged).length;

  return (
    <div className="app-shell">
      <aside className="app-nav">
        <div className="nav-header">
          <span className="nav-kicker">Authyntic demo</span>
          <h1>Operator sandbox</h1>
          <p>Guided preview of the strategic control environment.</p>
        </div>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className="nav-link">
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-footer">
          <div className="nav-session">
            <span className="nav-session-label">Signed in</span>
            <strong>{operator.name}</strong>
            <small>{operator.role}</small>
          </div>
          <div className="nav-alerts" aria-live="polite">
            <span>Active alerts</span>
            <strong>{activeAlerts}</strong>
          </div>
          <button type="button" className="theme-switch" onClick={onToggleTheme}>
            {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          </button>
          <button type="button" className="nav-signout" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="app-main">
        <div className="app-toolbar">
          <div className="app-session">
            <span className="session-label">Demo session</span>
            <strong>{operator.name}</strong>
            <small>{operator.role}</small>
          </div>
          <div className="toolbar-actions">
            <button type="button" onClick={onToggleTheme}>
              {darkMode ? 'Enable light theme' : 'Enable dark theme'}
            </button>
          </div>
        </div>
        <div className="workspace-content">{children}</div>
      </main>
    </div>
  );
};
