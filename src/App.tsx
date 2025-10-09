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
import { useOperatorStore, initializeStore } from './store';
import { useRealtimeSimulation } from './hooks/useRealtimeSimulation';

const App = () => {
  const loading = useOperatorStore((state) => state.loading);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  useEffect(() => {
    initializeStore({});
  }, []);

  useRealtimeSimulation();

  if (loading) {
    return <LoadingState message="Loading Authyntic operator workspace" />;
  }

  return (
    <Router>
      <Layout darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)}>
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
