import React from 'react';
import { workflows } from '../data/workflows';

const WorkflowsCard: React.FC = React.memo(() => {
  return (
    <div className="info-card">
      <h2>Available Workflows</h2>
      <div className="workflows">
        {workflows.map((workflow, index) => (
          <div className="workflow" key={index}>
            <h3>{workflow.title}</h3>
            <p>{workflow.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

export default WorkflowsCard;
