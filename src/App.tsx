import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import InteractiveCounter from './components/InteractiveCounter';
import FeaturesCard from './components/FeaturesCard';
import FirebaseCard from './components/FirebaseCard';
import WorkflowsCard from './components/WorkflowsCard';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import MCPShowcase from './components/MCPShowcase';
import RAGShowcase from './components/RAGShowcase';

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
      <ParticleBackground theme={theme} />
      <Header theme={theme} toggleTheme={toggleTheme} />
      <StatsBar stats={stats} count={count} />
      <main className="app-main">
        <InteractiveCounter
          count={count}
          setCount={setCount}
          resetCounter={resetCounter}
        />
        <FeaturesCard features={features} />
        <MCPShowcase />
        <RAGShowcase />
        <FirebaseCard />
        <WorkflowsCard />
      </main>
      <Footer />
    </div>
  );
}

export default App;
