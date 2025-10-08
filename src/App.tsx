import React, { useState } from 'react';

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
  const [activeView, setActiveView] = useState<'dashboard' | 'trust' | 'streaming' | 'network' | 'authentication' | 'proof'>('dashboard');
  // Track theme mode
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <header className="app-header">
        <h1>Authyntic Platform Demo</h1>
        <nav className="app-nav">
          <button onClick={() => setActiveView('dashboard')} className={activeView === 'dashboard' ? 'active' : ''}>Dashboard</button>
          <button onClick={() => setActiveView('trust')} className={activeView === 'trust' ? 'active' : ''}>Trust Visualization</button>
          <button onClick={() => setActiveView('streaming')} className={activeView === 'streaming' ? 'active' : ''}>Streaming Demo</button>
          <button onClick={() => setActiveView('network')} className={activeView === 'network' ? 'active' : ''}>Network Map</button>
          <button onClick={() => setActiveView('authentication')} className={activeView === 'authentication' ? 'active' : ''}>Media Auth</button>
          <button onClick={() => setActiveView('proof')} className={activeView === 'proof' ? 'active' : ''}>Proof Generator</button>
        </nav>
        <div className="theme-toggle">
          <label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            {darkMode ? '🌙 Dark' : '☀️ Light'}
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