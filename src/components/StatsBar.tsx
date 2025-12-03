import React from 'react';

interface StatsBarProps {
  stats: {
    workflows: number;
    tools: number;
    deployments: string;
  };
  count: number;
}

const StatsBar: React.FC<StatsBarProps> = ({ stats, count }) => {
  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-number">{stats.workflows}</span>
        <span className="stat-label">Workflows</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{stats.tools}</span>
        <span className="stat-label">MCP Tools</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{stats.deployments}</span>
        <span className="stat-label">Deployments</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{count}</span>
        <span className="stat-label">Button Clicks</span>
      </div>
    </div>
  );
};

export default StatsBar;
