import React, { useId, useMemo } from 'react';

type MetricStatus = 'success' | 'warning' | 'error' | 'info';

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  status: MetricStatus;
  icon: string;
  progress?: number;
  sparkline?: number[];
  isActive?: boolean;
}

const STATUS_LABEL: Record<MetricStatus, string> = {
  success: 'Operational',
  warning: 'Investigate',
  error: 'Critical',
  info: 'Intel',
};

const clampProgress = (value: number) => Math.min(100, Math.max(0, value));

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  status,
  icon,
  progress,
  sparkline,
  isActive = false,
}) => {
  const gaugeProgress = clampProgress(progress ?? 0);
  const sparklineId = useId();

  const sparklinePath = useMemo(() => {
    if (!sparkline || sparkline.length === 0) {
      return '';
    }

    const max = Math.max(...sparkline);
    const min = Math.min(...sparkline);
    const height = 28;
    const width = 100;
    const range = max - min || 1;

    return sparkline
      .map((point, index) => {
        const x = sparkline.length === 1 ? width : (index / (sparkline.length - 1)) * width;
        const normalized = (point - min) / range;
        const y = height - normalized * height;
        return `${x},${y}`;
      })
      .join(' ');
  }, [sparkline]);

  return (
    <article className={`metric-card`}
      data-status={status}
      data-active={isActive}
      aria-label={`${title} status ${STATUS_LABEL[status]}`}
    >
      <div className="metric-card__holo" aria-hidden="true" />
      <header className="metric-card__header">
        <span className="metric-card__icon" aria-hidden="true">
          {icon}
        </span>
        <div className="metric-card__titles">
          <p className="metric-card__status" aria-hidden="true">
            {STATUS_LABEL[status]}
          </p>
          <h3>{title}</h3>
        </div>
        <span className="metric-card__pulse" aria-hidden="true" />
      </header>
      <div className="metric-card__value" aria-live={isActive ? 'polite' : 'off'}>
        <span>{value}</span>
        <small>{trend}</small>
      </div>
      <div className="metric-card__telemetry" role="presentation">
        <div className="metric-card__progress" aria-hidden="true">
          <span className="metric-card__progress-bar" style={{ width: `${gaugeProgress}%` }} />
          <span className="metric-card__progress-glow" style={{ width: `${gaugeProgress}%` }} />
        </div>
        <div className="metric-card__sparkline" aria-hidden={!sparkline || sparkline.length === 0}>
          {sparkline && sparkline.length > 0 && (
            <svg viewBox="0 0 100 28" preserveAspectRatio="none" role="presentation">
              <defs>
                <linearGradient id={`${sparklineId}-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--accent-cyan)" />
                  <stop offset="100%" stopColor="var(--accent-violet)" />
                </linearGradient>
              </defs>
              <polyline
                points={sparklinePath}
                fill="none"
                stroke={`url(#${sparklineId}-gradient)`}
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </article>
  );
};
