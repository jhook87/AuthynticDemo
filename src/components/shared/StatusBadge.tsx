import type { NetworkNode } from '../../types';
import { STATUS_BADGE_COLORS } from '../../constants';

interface StatusBadgeProps {
  status: NetworkNode['status'];
}

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className="status-badge" style={{ backgroundColor: STATUS_BADGE_COLORS[status] }}>
    {status}
  </span>
);
