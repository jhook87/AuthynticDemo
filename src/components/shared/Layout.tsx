import type { ReactNode } from 'react';
import { NavLink } from './Router';
import { useOperatorStore } from '../../store';

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
  const alerts = useOperatorStore((state) => state.alerts);
  return (
    <div className="app-shell">
      <aside className="app-nav">
        <div className="app-nav__brand">
          <h1>Authyntic Operator</h1>
          <p>Command center for authenticity intelligence</p>
        </div>
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
      </aside>
      <main>{children}</main>
    </div>
  );
};
