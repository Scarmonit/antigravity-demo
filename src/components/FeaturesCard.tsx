import React from 'react';

interface FeaturesCardProps {
  features: string[];
}

const FeaturesCard: React.FC<FeaturesCardProps> = React.memo(({ features }) => {
  return (
    <div className="features-card">
      <h2>Antigravity Features</h2>
      <ul className="features-list">
        {features.map((feature, index) => (
          <li key={index} className="feature-item">
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default FeaturesCard;
