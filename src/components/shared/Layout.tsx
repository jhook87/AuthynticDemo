import type { ReactNode } from 'react';
import { NavLink } from './Router';
import { useOperatorStore } from '../../store';

interface LayoutProps {
  children: ReactNode;
  darkMode: boolean;
  onToggleTheme: () => void;
}

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Network', path: '/network' },
  { label: 'Media', path: '/media' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Operations', path: '/settings' },
];

export const Layout = ({ children, darkMode, onToggleTheme }: LayoutProps) => {
  const alerts = useOperatorStore((state) => state.alerts);
  return (
    <div className="app-shell">
      <aside className="app-nav">
        <h1>Authyntic Operator</h1>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className="nav-link">
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-alerts" aria-live="polite">
          <strong>Active alerts</strong>
          <span>{alerts.filter((alert) => !alert.acknowledged).length}</span>
        </div>
        <button type="button" className="theme-switch" onClick={onToggleTheme}>
          {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        </button>
      </aside>
      <main>{children}</main>
    </div>
  );
};
