import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: ReactNode;
  footer?: ReactNode;
  accent?: 'blue' | 'green' | 'amber' | 'rose';
}

const accentClass: Record<NonNullable<MetricCardProps['accent']>, string> = {
  blue: 'metric-blue',
  green: 'metric-green',
  amber: 'metric-amber',
  rose: 'metric-rose',
};

export const MetricCard = ({ title, value, footer, accent = 'blue' }: MetricCardProps) => (
  <article className={`metric-card ${accentClass[accent]}`}>
    <header>{title}</header>
    <strong>{value}</strong>
    {footer && <footer>{footer}</footer>}
  </article>
);
