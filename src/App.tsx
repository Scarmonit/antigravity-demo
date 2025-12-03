import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import './App.css';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import InteractiveCounter from './components/InteractiveCounter';
import FeaturesCard from './components/FeaturesCard';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import MCPShowcase from './components/MCPShowcase';
import RAGShowcase from './components/RAGShowcase';
import { features } from './data/features';

// Lazy-loaded components for better initial load performance
const FirebaseCard = lazy(() => import('./components/FirebaseCard'));
const WorkflowsCard = lazy(() => import('./components/WorkflowsCard'));
const ParticleBackground = lazy(() => import('./components/ParticleBackground'));
const PerformanceMetrics = lazy(() => import('./components/PerformanceMetrics'));

// Loading fallback component
const LoadingCard = () => (
  <div className="card loading-card">
    <div className="loading-spinner"></div>
  </div>
);

// Static data moved outside component
const stats = {
  workflows: 5,
  tools: 25,
  deployments: '∞',
};

function App() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const resetCounter = useCallback(() => {
    setCount(0);
  }, []);

  return (
    <div className={`app theme-${theme}`}>
      <Suspense fallback={null}>
        <ParticleBackground theme={theme} />
      </Suspense>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <StatsBar stats={stats} count={count} />
      <main className="app-main">
        <InteractiveCounter
          count={count}
          setCount={setCount}
          resetCounter={resetCounter}
        />
        <FeaturesCard features={features} />
        <ErrorBoundary>
          <MCPShowcase />
        </ErrorBoundary>
        <ErrorBoundary>
          <RAGShowcase />
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingCard />}>
            <PerformanceMetrics />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingCard />}>
            <FirebaseCard />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingCard />}>
            <WorkflowsCard />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default App;
