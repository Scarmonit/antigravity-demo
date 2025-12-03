import React from 'react';
import { Feature } from '../data/features';

interface FeaturesCardProps {
  features: Feature[];
}

const FeaturesCard: React.FC<FeaturesCardProps> = React.memo(({ features }) => {
  return (
    <div className="features-card">
      <h2>Antigravity Features</h2>
      <ul className="features-list">
        {features.map((feature) => (
          <li key={feature.id} className="feature-item">
            {feature.text}
          </li>
        ))}
      </ul>
    </div>
  );
});

FeaturesCard.displayName = 'FeaturesCard';

export default FeaturesCard;
