import type { AuditLogEntry } from '../../types';
import { minutesAgo } from '../../utils/time';
import { randomId } from '../../utils/random';

const actions = [
  'Updated consensus policy',
  'Approved authenticity report',
  'Triggered incident response',
  'Exported compliance log',
];

export const buildAuditTrail = (): AuditLogEntry[] =>
  actions.map((action, index) => ({
    id: randomId('audit'),
    actor: index % 2 === 0 ? 'Operator A' : 'Automated System',
    action,
    details: `${action} at ${new Date().toLocaleTimeString()}`,
    createdAt: minutesAgo((index + 1) * 6),
    risk: index === 0 ? 'moderate' : 'low',
  }));
