import { lazy, Suspense, useEffect } from 'react';
import { Layout } from './components/shared/Layout';
import { Router, Route } from './components/shared/Router';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { LoadingState } from './components/shared/LoadingState';
import { TutorialOverlay } from './components/shared/TutorialOverlay';
import { useOperatorStore, initializeStore, restoreTutorialProgress } from './store';
import { demoStateService } from './services/storage/demoStateService';
import { useRealtimeSimulation } from './hooks/useRealtimeSimulation';

const OperatorDashboard = lazy(() =>
  import('./components/dashboard/OperatorDashboard').then((module) => ({
    default: module.OperatorDashboard,
  })),
);

const NetworkOperations = lazy(() =>
  import('./components/network/NetworkOperations').then((module) => ({
    default: module.NetworkOperations,
  })),
);

const MediaPipelineView = lazy(() =>
  import('./components/media/MediaPipelineView').then((module) => ({
    default: module.MediaPipelineView,
  })),
);

const AnalyticsCenter = lazy(() =>
  import('./components/analytics/AnalyticsCenter').then((module) => ({
    default: module.AnalyticsCenter,
  })),
);

const ConfigurationCenter = lazy(() =>
  import('./components/settings/ConfigurationCenter').then((module) => ({
    default: module.ConfigurationCenter,
  })),
);

const App = () => {
  const loading = useOperatorStore((state) => state.loading);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = (matches: boolean) => {
      document.body.dataset.theme = matches ? 'dark' : 'light';
    };

    applyTheme(media.matches);
    const handleChange = (event: MediaQueryListEvent) => applyTheme(event.matches);
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }
    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  useEffect(() => {
    initializeStore({});
    const savedProgress = demoStateService.loadDemoProgress();
    if (savedProgress) {
      restoreTutorialProgress(savedProgress);
    }
  }, []);

  useRealtimeSimulation();

  if (loading) {
    return <LoadingState message="Loading Authyntic operator workspace" />;
  }

  return (
    <Router>
      <Layout>
        <ErrorBoundary>
          <Suspense fallback={<LoadingState message="Preparing interactive workspace" />}>
            <Route path="/" element={<OperatorDashboard />} />
            <Route path="/network" element={<NetworkOperations />} />
            <Route path="/media" element={<MediaPipelineView />} />
            <Route path="/analytics" element={<AnalyticsCenter />} />
            <Route path="/settings" element={<ConfigurationCenter />} />
          </Suspense>
        </ErrorBoundary>
        <TutorialOverlay />
      </Layout>
    </Router>
  );
};

export default App;
