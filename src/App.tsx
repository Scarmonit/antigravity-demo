import { useState, useEffect, lazy, Suspense } from 'react';
import './App.css';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import InteractiveCounter from './components/InteractiveCounter';
import FeaturesCard from './components/FeaturesCard';
import Footer from './components/Footer';

// Lazy-loaded components for better initial load performance
const FirebaseCard = lazy(() => import('./components/FirebaseCard'));
const WorkflowsCard = lazy(() => import('./components/WorkflowsCard'));
const ParticleBackground = lazy(() => import('./components/ParticleBackground'));
const MCPShowcase = lazy(() => import('./components/MCPShowcase'));
const RAGShowcase = lazy(() => import('./components/RAGShowcase'));
const PerformanceMetrics = lazy(() => import('./components/PerformanceMetrics'));

// Loading fallback component
const LoadingCard = () => (
  <div className="card loading-card">
    <div className="loading-spinner"></div>
  </div>
);

function App() {
  const [count, setCount] = useState(0);
  const [features, setFeatures] = useState<string[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [stats] = useState({
    workflows: 5,
    tools: 25,
    deployments: '∞',
  });

  useEffect(() => {
    // Demonstrate Antigravity features
    setFeatures([
      '✅ Full automation with turbo-mode workflows',
      '✅ Browser subagent for automated testing',
      '✅ MCP server integration (25+ development tools)',
      '✅ React + TypeScript + Vite',
      '✅ Complete documentation and guides',
      '🔥 Particle effects and advanced animations',
    ]);
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const resetCounter = () => {
    setCount(0);
  };

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
        <Suspense fallback={<LoadingCard />}>
          <MCPShowcase />
        </Suspense>
        <Suspense fallback={<LoadingCard />}>
          <RAGShowcase />
        </Suspense>
        <Suspense fallback={<LoadingCard />}>
          <PerformanceMetrics />
        </Suspense>
        <Suspense fallback={<LoadingCard />}>
          <FirebaseCard />
        </Suspense>
        <Suspense fallback={<LoadingCard />}>
          <WorkflowsCard />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
