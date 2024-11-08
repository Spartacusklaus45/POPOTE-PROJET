import { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { measurePerformance } from './utils/performance';

// Chargement différé des composants
const Home = lazy(() => import('./pages/Home'));
const ErrorFallback = () => <div>Une erreur est survenue</div>;

function App() {
  // Mesurer les performances
  const endMeasure = measurePerformance('App');

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Chargement...</div>}>
        <Home />
      </Suspense>
    </ErrorBoundary>
  );

  // Fin de la mesure
  endMeasure();
}

export default App;