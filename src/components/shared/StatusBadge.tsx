import type { NetworkNode } from '../../types';

interface StatusBadgeProps {
  status: NetworkNode['status'];
}

const STATUS_ICON: Record<NetworkNode['status'], string> = {
  online: '●',
  degraded: '▲',
  offline: '■',
};

const STATUS_LABEL: Record<NetworkNode['status'], string> = {
  online: 'Operational',
  degraded: 'Degraded',
  offline: 'Offline',
};

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className="status-chip" data-status={status} role="status" aria-label={`Node status ${STATUS_LABEL[status]}`}>
    <span className="status-chip__pulse" aria-hidden="true" />
    <span className="status-chip__icon" aria-hidden="true">
      {STATUS_ICON[status]}
    </span>
    <span className="status-chip__label">{STATUS_LABEL[status]}</span>
  </span>
);
