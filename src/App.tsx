import React, { useEffect, useState } from 'react';

// Import individual components
import Dashboard from './components/Dashboard';
import TrustVisualization from './components/TrustVisualization';
import StreamingDemo from './components/StreamingDemo';
import NetworkMap from './components/NetworkMap';
import MediaAuthentication from './components/MediaAuthentication';
import ProofGenerator from './components/ProofGenerator';

/**
 * Top‑level application component. Provides simple navigation between different demo views
 * and toggles for dark/light themes. This component uses plain React state to manage
 * which panel is visible. It could be extended later to use a routing library like
 * React Router, but for the purposes of this demo a lightweight approach works well.
 */
const App: React.FC = () => {
  // Keep track of the active view
  const [activeView, setActiveView] =
    useState<'dashboard' | 'trust' | 'streaming' | 'network' | 'authentication' | 'proof'>('dashboard');
  // Track theme mode
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'trust', label: 'Trust Visualization' },
    { id: 'streaming', label: 'Streaming Demo' },
    { id: 'network', label: 'Network Map' },
    { id: 'authentication', label: 'Media Auth' },
    { id: 'proof', label: 'Proof Generator' },
  ] as const;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <span className="brand-mark" aria-hidden="true"></span>
          <div>
            <h1>Authyntic Deployment Console</h1>
            <p className="app-tagline">Proof of truth at the speed of war.</p>
          </div>
        </div>
        <nav className="app-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              className={activeView === item.id ? 'active' : ''}
              aria-pressed={activeView === item.id}
              onClick={() => setActiveView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="theme-toggle">
          <label className="toggle-control">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="toggle-track">
              <span className="toggle-thumb" />
            </span>
            <span className="toggle-text">{darkMode ? 'Tactical' : 'Daylight'} Mode</span>
          </label>
        </div>
      </header>
      <main className="app-content">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'trust' && <TrustVisualization />}
        {activeView === 'streaming' && <StreamingDemo />}
        {activeView === 'network' && <NetworkMap />}
        {activeView === 'authentication' && <MediaAuthentication />}
        {activeView === 'proof' && <ProofGenerator />}
      </main>
    </div>
  );
};

export default App;