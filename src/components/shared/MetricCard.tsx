import React from 'react';

type MetricStatus = 'success' | 'warning' | 'error' | 'info';

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  status: MetricStatus;
  icon: string;
}

const statusClass: Record<MetricStatus, string> = {
  success: 'metric-success',
  warning: 'metric-warning',
  error: 'metric-error',
  info: 'metric-info',
};

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, status, icon }) => (
  <article className={`metric-card ${statusClass[status]}`} role="presentation">
    <span className="metric-status-pill">{status.toUpperCase()}</span>
    <div className="metric-header">
      <span className="metric-icon" aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
    </div>
    <div className="metric-value">{value}</div>
    <div className="metric-trend">{trend}</div>
  </article>
);
