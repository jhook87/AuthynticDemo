import { useEffect, useState } from 'react';
import { Layout } from './components/shared/Layout';
import { Router, Route } from './components/shared/Router';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { LoadingState } from './components/shared/LoadingState';
import { OperatorDashboard } from './components/dashboard/OperatorDashboard';
import { NetworkOperations } from './components/network/NetworkOperations';
import { MediaPipelineView } from './components/media/MediaPipelineView';
import { AnalyticsCenter } from './components/analytics/AnalyticsCenter';
import { ConfigurationCenter } from './components/settings/ConfigurationCenter';
import { TutorialOverlay } from './components/shared/TutorialOverlay';
import { LoginGate } from './components/shared/LoginGate';
import { useOperatorStore, initializeStore, resetScenarios } from './store';
import { useRealtimeSimulation } from './hooks/useRealtimeSimulation';

interface SessionState {
  token: string;
  operator: {
    name: string;
    role: string;
  };
}

const App = () => {
  const loading = useOperatorStore((state) => state.loading);
  const [darkMode, setDarkMode] = useState(true);
  const [session, setSession] = useState<SessionState | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    const persisted = window.localStorage.getItem('authyntic-demo-session');
    return persisted ? (JSON.parse(persisted) as SessionState) : null;
  });

  useEffect(() => {
    document.body.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  useEffect(() => {
    if (!session) {
      resetScenarios();
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('authyntic-demo-session');
      }
      return;
    }

    initializeStore({});
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('authyntic-demo-session', JSON.stringify(session));
    }
  }, [session]);

  useRealtimeSimulation(Boolean(session));

  if (!session) {
    return (
      <LoginGate
        onAuthenticated={(nextSession) => {
          setSession(nextSession);
        }}
      />
    );
  }

  if (loading) {
    return <LoadingState message="Loading Authyntic operator workspace" />;
  }

  return (
    <Router>
      <Layout
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((value) => !value)}
        operator={session.operator}
        onSignOut={() => setSession(null)}
      >
        <ErrorBoundary>
          <Route path="/" element={<OperatorDashboard />} />
          <Route path="/network" element={<NetworkOperations />} />
          <Route path="/media" element={<MediaPipelineView />} />
          <Route path="/analytics" element={<AnalyticsCenter />} />
          <Route path="/settings" element={<ConfigurationCenter />} />
        </ErrorBoundary>
        <TutorialOverlay />
      </Layout>
    </Router>
  );
};

export default App;
