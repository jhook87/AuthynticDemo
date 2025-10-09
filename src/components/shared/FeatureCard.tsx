import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  businessValue: string;
  techDetails: string;
  icon?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, businessValue, techDetails, icon }) => (
  <article className="feature-card">
    <header style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {icon ? <span style={{ fontSize: '1.75rem' }}>{icon}</span> : null}
      <h3>{title}</h3>
    </header>
    <p className="feature-description">{description}</p>
    <div className="feature-meta">
      <span><strong>Business impact:</strong> {businessValue}</span>
      <span><strong>Technical detail:</strong> {techDetails}</span>
    </div>
  </article>
);
