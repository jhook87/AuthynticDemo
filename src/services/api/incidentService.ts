import type { NetworkIncident } from '../../types';
import { minutesAgo } from '../../utils/time';
import { randomId, randomItem } from '../../utils/random';
import { INCIDENT_SEVERITIES } from '../../constants';

const incidentTemplates: Array<Omit<NetworkIncident, 'id' | 'detectedAt'>> = [
  {
    severity: 'high',
    description: 'Validator double-sign detected and quarantined.',
    resolvedAt: undefined,
    impactedNodes: [],
    remediation: 'Slashed offending validator and rebalanced weights.',
  },
  {
    severity: 'medium',
    description: 'Ingress node experiencing packet loss.',
    resolvedAt: undefined,
    impactedNodes: [],
    remediation: 'Rerouted through redundant edge network.',
  },
  {
    severity: 'critical',
    description: 'Attempted deepfake injection flagged by moderation pipeline.',
    resolvedAt: undefined,
    impactedNodes: [],
    remediation: 'Quarantined asset and broadcasted revocation notice.',
  },
];

export const generateIncidents = (nodeIds: string[]): NetworkIncident[] =>
  incidentTemplates.map((template, index) => ({
    ...template,
    id: randomId('incident'),
    detectedAt: minutesAgo((index + 1) * 12),
    impactedNodes: [randomItem(nodeIds)],
    severity: randomItem(INCIDENT_SEVERITIES as unknown as NetworkIncident['severity'][]),
  }));
