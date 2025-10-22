import { DemoScenario } from '../types/scenarioTypes.js';

export const CyberIncident: DemoScenario = {
  id: 'cyber-incident-response',
  name: 'Cyber Incident Response',
  description: 'Coordinated detection, containment, and recovery from an active threat.',
  duration: 900_000,
  stages: [
    {
      name: 'Threat Detection',
      duration: 180_000,
      events: [
        {
          type: 'ANOMALY_DETECTED_WARNING',
          severity: 'warning',
          location: 'perimeter-node-7',
          description: 'Edge analytics flagged abnormal signature propagation.',
        },
        {
          type: 'PATTERN_MATCH_CRITICAL',
          severity: 'critical',
          details: 'Known attack signature identified',
          description: 'Correlation engine matched a high-risk signature.',
        },
      ],
    },
    {
      name: 'Response Coordination',
      duration: 300_000,
      events: [
        {
          type: 'ISOLATION_INITIATED',
          target: 'affected-subnet',
          method: 'CONTAINMENT_PROTOCOL_A',
          description: 'Automated segmentation triggered for impacted nodes.',
        },
        {
          type: 'COUNTERMEASURE_DEPLOYED',
          capability: 'ADAPTIVE_DEFENSE',
          coverage: 'FULL_SPECTRUM',
          description: 'Dynamic policy enforcement activated across control plane.',
        },
      ],
    },
    {
      name: 'System Hardening',
      duration: 420_000,
      events: [
        {
          type: 'SECURITY_PATCH_DEPLOYED',
          scope: 'NETWORK_WIDE',
          verification: 'CRYPTOGRAPHIC_PROOF',
          description: 'Immutable update bundle pushed via secure channels.',
        },
        {
          type: 'TRUST_CHAIN_REESTABLISHED',
          method: 'ZERO_KNOWLEDGE_PROOF',
          confidence: 0.997,
          description: 'Zero-knowledge attestations confirm supply-chain integrity.',
        },
      ],
    },
  ],
};
