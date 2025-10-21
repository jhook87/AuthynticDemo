import { randomId } from '../utils/random';
import type { ScenarioDefinition, ScenarioEvent } from '../types';

const buildEvent = <T extends ScenarioEvent>(event: T): T => event;

const ms = (seconds: number) => seconds * 1_000;

export const SCENARIO_LIBRARY: ScenarioDefinition[] = [
  {
    id: 'onboarding-surge',
    name: 'Onboarding Surge',
    durationMs: ms(28),
    complexity: 'Intro',
    expectedOutcomes: [
      'Provision four regional strategists',
      'Demonstrate biometric adoption uptick',
      'Showcase automated directory synchronisation',
    ],
    preview: 'apac-wave',
    checkpoints: [
      {
        id: 'request-review',
        label: 'Request review',
        description: 'APAC command submits provisioning request.',
        offsetMs: ms(4),
      },
      {
        id: 'directory-sync',
        label: 'Directory sync',
        description: 'Directory synchronisation completes.',
        offsetMs: ms(12),
      },
      {
        id: 'analyst-ready',
        label: 'Analysts ready',
        description: 'Threat Intel support staffed.',
        offsetMs: ms(22),
      },
    ],
    events: [
      buildEvent({
        id: 'onboarding-surge-apac-launch',
        type: 'registration',
        timing: { delayMs: ms(2), duration: ms(4) },
        payload: {
          impact: 'success',
          headline: 'APAC onboarding wave launched',
          details: 'Command requested four new analyst slots for the APAC incident desk.',
          name: 'Ava Sinclair',
          organization: 'APAC Command',
          role: 'Regional Strategist',
          activity: 'Provisioned credential scope: apac-response/*',
          delta: { total: 1, active: 1, biometricEnabled: 1 },
        },
      }),
      buildEvent({
        id: 'onboarding-surge-directory-sync',
        type: 'metrics',
        timing: { delayMs: ms(9), duration: ms(3) },
        payload: {
          impact: 'info',
          headline: 'User roster expanded',
          details: 'Directory sync reflected the new APAC roles within 90 seconds.',
          delta: { total: 4, active: 4, admin: 1, biometricEnabled: 2 },
          activity: { summary: 'Directory sync completed for APAC cohort', channel: 'system' },
        },
      }),
      buildEvent({
        id: 'onboarding-surge-threat-analyst',
        type: 'registration',
        timing: { delayMs: ms(18), duration: ms(4) },
        payload: {
          impact: 'success',
          headline: 'Threat Intel assigned support operator',
          details: 'Intel hub assigned Quinn to co-pilot authenticity reviews.',
          name: 'Quinn Harper',
          organization: 'Threat Intel',
          role: 'Authenticity Analyst',
          activity: 'Assigned to queue: authenticity/triage/rotating',
          delta: { total: 1, active: 1 },
        },
      }),
    ],
  },
  {
    id: 'role-hardening',
    name: 'Role Hardening',
    durationMs: ms(26),
    complexity: 'Moderate',
    expectedOutcomes: [
      'Showcase privileged role promotion workflow',
      'Highlight adaptive MFA enforcement',
      'Demonstrate audit logging of privilege changes',
    ],
    preview: 'role-security',
    checkpoints: [
      {
        id: 'change-request',
        label: 'Change request',
        description: 'Privilege change ticket filed.',
        offsetMs: ms(3),
      },
      {
        id: 'mfa-challenge',
        label: 'Adaptive MFA',
        description: 'Adaptive MFA verifies new admins.',
        offsetMs: ms(11),
      },
      {
        id: 'audit-review',
        label: 'Audit review',
        description: 'Security validates audit trail.',
        offsetMs: ms(20),
      },
    ],
    events: [
      buildEvent({
        id: 'role-hardening-promotion',
        type: 'metrics',
        timing: { delayMs: ms(4), duration: ms(5) },
        payload: {
          impact: 'info',
          headline: 'Privilege promotion underway',
          details: 'Two operators elevated to admin for rapid approvals window.',
          delta: { admin: 2 },
          activity: { summary: 'Admin promotion audit logged for review', channel: 'security' },
        },
      }),
      buildEvent({
        id: 'role-hardening-mfa',
        type: 'activity',
        timing: { delayMs: ms(12), duration: ms(4) },
        payload: {
          impact: 'success',
          headline: 'Security verified admin elevation',
          details: 'Adaptive MFA enforced physical token and biometric handshake.',
          summary: 'Multi-factor challenge verified for elevated roles',
          channel: 'security',
        },
      }),
      buildEvent({
        id: 'role-hardening-closure',
        type: 'activity',
        timing: { delayMs: ms(21), duration: ms(3) },
        payload: {
          impact: 'info',
          headline: 'Change review broadcast',
          details: 'Security review announced completion of privilege hardening window.',
          summary: 'Privilege review broadcast to compliance observers',
          channel: 'comms',
        },
      }),
    ],
  },
  {
    id: 'biometric-pilot',
    name: 'Biometric Pilot',
    durationMs: ms(24),
    complexity: 'Intro',
    expectedOutcomes: [
      'Illustrate biometric rollout cadence',
      'Demonstrate attestation validation',
      'Highlight communications coaching remote operators',
    ],
    preview: 'biometric-preview',
    checkpoints: [
      {
        id: 'pilot-launch',
        label: 'Pilot launch',
        description: 'Pilot cohort receives passkeys.',
        offsetMs: ms(5),
      },
      {
        id: 'attestation',
        label: 'Attestation',
        description: 'Device attestation complete.',
        offsetMs: ms(12),
      },
      {
        id: 'enablement',
        label: 'Enablement',
        description: 'Operators trained on recovery.',
        offsetMs: ms(19),
      },
    ],
    events: [
      buildEvent({
        id: 'biometric-pilot-activation',
        type: 'metrics',
        timing: { delayMs: ms(3), duration: ms(4) },
        payload: {
          impact: 'success',
          headline: 'Biometric pilot activated',
          details: 'Pilot group enabled passkey authentication across mobile and desktop.',
          delta: { biometricEnabled: 5, active: 3 },
          activity: { summary: 'Attestation packets verified for pilot cohort', channel: 'system' },
        },
      }),
      buildEvent({
        id: 'biometric-pilot-drill',
        type: 'activity',
        timing: { delayMs: ms(14), duration: ms(4) },
        payload: {
          impact: 'info',
          headline: 'Preparedness drill circulated',
          details: 'Guidance distributed to remote operators with fallback codes.',
          summary: 'Live biometric recovery drilled for remote ops team',
          channel: 'comms',
        },
      }),
      buildEvent({
        id: 'biometric-pilot-health',
        type: 'metrics',
        timing: { delayMs: ms(20), duration: ms(3) },
        payload: {
          impact: 'info',
          headline: 'Pilot health verified',
          details: 'Support desk confirmed 100% adoption with no regressions.',
          delta: { biometricEnabled: 2 },
          activity: { summary: 'Support desk confirmed biometric health check', channel: 'admin' },
        },
      }),
    ],
  },
  {
    id: 'suspension-review',
    name: 'Suspension Review',
    durationMs: ms(26),
    complexity: 'Moderate',
    expectedOutcomes: [
      'Demonstrate trust desk adjudication',
      'Highlight reinstatement workflow',
      'Surface escalations to legal operations',
    ],
    preview: 'trust-balance',
    checkpoints: [
      {
        id: 'case-intake',
        label: 'Case intake',
        description: 'Trust desk triages suspended accounts.',
        offsetMs: ms(4),
      },
      {
        id: 'reinstatement',
        label: 'Reinstatement',
        description: 'Two accounts reinstated.',
        offsetMs: ms(13),
      },
      {
        id: 'escalation',
        label: 'Escalation',
        description: 'Legal notified of high-risk user.',
        offsetMs: ms(21),
      },
    ],
    events: [
      buildEvent({
        id: 'suspension-review-clear',
        type: 'metrics',
        timing: { delayMs: ms(6), duration: ms(4) },
        payload: {
          impact: 'success',
          headline: 'Suspension review cleared',
          details: 'Trust desk reinstated two accounts after behavior review.',
          delta: { suspended: -2, active: 2 },
          activity: { summary: 'Trust review closed two pending suspensions', channel: 'admin' },
        },
      }),
      buildEvent({
        id: 'suspension-review-legal',
        type: 'activity',
        timing: { delayMs: ms(18), duration: ms(5) },
        payload: {
          impact: 'warning',
          headline: 'Legal escalation pending',
          details: 'One suspended account routed to legal for external coordination.',
          summary: 'Escalated suspension request queued for legal triage',
          channel: 'security',
        },
      }),
      buildEvent({
        id: 'suspension-review-outcome',
        type: 'activity',
        timing: { delayMs: ms(24), duration: ms(2) },
        payload: {
          impact: 'info',
          headline: 'Trust case archived',
          details: 'Final summary shared with compliance observers.',
          summary: 'Trust case archived following legal follow-up',
          channel: 'admin',
        },
      }),
    ],
  },
  {
    id: 'threat-detection',
    name: 'Threat Detection',
    durationMs: ms(32),
    complexity: 'Advanced',
    expectedOutcomes: [
      'Spot coordinated authenticity attack',
      'Coordinate network incident response',
      'Elevate countermeasures via alerting',
    ],
    preview: 'threat-detection',
    checkpoints: [
      {
        id: 'signal-detected',
        label: 'Signal detected',
        description: 'Anomaly detection surfaces synthetic behavior.',
        offsetMs: ms(5),
      },
      {
        id: 'containment',
        label: 'Containment',
        description: 'Network throttles malicious workload.',
        offsetMs: ms(17),
      },
      {
        id: 'retrospective',
        label: 'Retrospective',
        description: 'Threat desk records lessons learned.',
        offsetMs: ms(28),
      },
    ],
    events: [
      buildEvent({
        id: 'threat-detection-alert',
        type: 'activity',
        timing: { delayMs: ms(6), duration: ms(4) },
        payload: {
          impact: 'critical',
          headline: 'Coordinated forgery campaign detected',
          details: 'Velocity anomaly flagged mirrored posts sourced from compromised node.',
          summary: 'Detection engine quarantined forged narrative cluster',
          channel: 'security',
        },
      }),
      buildEvent({
        id: 'threat-detection-response',
        type: 'metrics',
        timing: { delayMs: ms(15), duration: ms(5) },
        payload: {
          impact: 'warning',
          headline: 'Containment window activated',
          details: 'Consensus prioritized forensic nodes to inspect impacted ledger ranges.',
          delta: { suspended: 1 },
          activity: { summary: 'Containment policy throttled east-edge validators', channel: 'system' },
        },
      }),
      buildEvent({
        id: 'threat-detection-brief',
        type: 'activity',
        timing: { delayMs: ms(26), duration: ms(4) },
        payload: {
          impact: 'info',
          headline: 'Threat desk published retrospective',
          details: 'Response catalogued threat IoCs and updated training scenario backlog.',
          summary: 'Threat desk retrospective shared with stakeholders',
          channel: 'comms',
        },
      }),
    ],
  },
  {
    id: 'network-partition-recovery',
    name: 'Network Partition Recovery',
    durationMs: ms(34),
    complexity: 'Advanced',
    expectedOutcomes: [
      'Visualize partition blast radius',
      'Demonstrate automated recovery orchestration',
      'Showcase trust score stabilization',
    ],
    preview: 'partition-recovery',
    checkpoints: [
      {
        id: 'partition-detected',
        label: 'Partition detected',
        description: 'Topology anomaly triggers alert.',
        offsetMs: ms(6),
      },
      {
        id: 'recovery-plan',
        label: 'Recovery plan',
        description: 'Failover plan executes consensus rotation.',
        offsetMs: ms(18),
      },
      {
        id: 'stability',
        label: 'Stability',
        description: 'Trust scores normalize.',
        offsetMs: ms(30),
      },
    ],
    events: [
      buildEvent({
        id: 'partition-alert',
        type: 'activity',
        timing: { delayMs: ms(7), duration: ms(4) },
        payload: {
          impact: 'warning',
          headline: 'Consensus drift spotted',
          details: 'Edge validators lost quorum with core ledger after peering outage.',
          summary: 'Partition alert triggered for east-edge cluster',
          channel: 'system',
        },
      }),
      buildEvent({
        id: 'partition-recovery',
        type: 'metrics',
        timing: { delayMs: ms(16), duration: ms(6) },
        payload: {
          impact: 'success',
          headline: 'Partition recovery orchestrated',
          details: 'Automated playbook rotated consensus leader and rehydrated ledger diffs.',
          delta: { active: 2, suspended: -1 },
          activity: { summary: 'Failover automation executed partition recovery steps', channel: 'system' },
        },
      }),
      buildEvent({
        id: 'partition-stabilized',
        type: 'activity',
        timing: { delayMs: ms(29), duration: ms(3) },
        payload: {
          impact: 'info',
          headline: 'Trust metrics stabilized',
          details: 'Trust engine signalled consensus health returning to baseline.',
          summary: 'Trust engine confirmed stabilization post-partition',
          channel: 'admin',
        },
      }),
    ],
  },
  {
    id: 'multi-factor-auth-flow',
    name: 'Multi-factor Authentication Flow',
    durationMs: ms(30),
    complexity: 'Intro',
    expectedOutcomes: [
      'Demonstrate MFA enrollment and fallback',
      'Visualize adaptive challenges under load',
      'Highlight administrative overrides',
    ],
    preview: 'mfa-flow',
    checkpoints: [
      {
        id: 'enrollment',
        label: 'Enrollment',
        description: 'Operators complete MFA enrollment.',
        offsetMs: ms(4),
      },
      {
        id: 'challenge',
        label: 'Adaptive challenge',
        description: 'Risk-based prompt triggered.',
        offsetMs: ms(15),
      },
      {
        id: 'override',
        label: 'Override issued',
        description: 'Admin grants temporary bypass.',
        offsetMs: ms(25),
      },
    ],
    events: [
      buildEvent({
        id: 'mfa-enrollment',
        type: 'metrics',
        timing: { delayMs: ms(5), duration: ms(4) },
        payload: {
          impact: 'success',
          headline: 'MFA enrollment completed',
          details: 'Wave of operators onboarded into multi-factor flow with biometric backup.',
          delta: { biometricEnabled: 3, active: 3 },
          activity: { summary: 'Enrollment batch completed for regional operators', channel: 'system' },
        },
      }),
      buildEvent({
        id: 'mfa-challenge',
        type: 'activity',
        timing: { delayMs: ms(16), duration: ms(4) },
        payload: {
          impact: 'warning',
          headline: 'Adaptive challenge triggered',
          details: 'Risk score spike required step-up verification for remote session.',
          summary: 'Adaptive MFA challenged remote privileged session',
          channel: 'security',
        },
      }),
      buildEvent({
        id: 'mfa-override',
        type: 'activity',
        timing: { delayMs: ms(26), duration: ms(3) },
        payload: {
          impact: 'info',
          headline: 'Override approved for incident lead',
          details: 'Admin provided 30 minute bypass window with just-in-time audit trail.',
          summary: 'Temporary MFA override logged for incident commander',
          channel: 'admin',
        },
      }),
    ],
  },
  {
    id: 'trust-score-evolution',
    name: 'Trust Score Evolution',
    durationMs: ms(36),
    complexity: 'Advanced',
    expectedOutcomes: [
      'Track trust score adjustments in real time',
      'Surface predictive projections for leadership',
      'Demonstrate metric annotations tied to events',
    ],
    preview: 'trust-evolution',
    checkpoints: [
      {
        id: 'baseline',
        label: 'Baseline established',
        description: 'Trust baseline snapshot captured.',
        offsetMs: ms(3),
      },
      {
        id: 'boost',
        label: 'Boost detected',
        description: 'Trust climbs after remediation.',
        offsetMs: ms(16),
      },
      {
        id: 'forecast',
        label: 'Forecast delivered',
        description: 'Predictive trust outlook shared.',
        offsetMs: ms(30),
      },
    ],
    events: [
      buildEvent({
        id: 'trust-baseline',
        type: 'metrics',
        timing: { delayMs: ms(4), duration: ms(4) },
        payload: {
          impact: 'info',
          headline: 'Trust baseline captured',
          details: 'Trust metrics aligned across ingest, curator, and validator pools.',
          delta: {},
          activity: { summary: 'Baseline trust snapshot shared with leadership', channel: 'comms' },
        },
      }),
      buildEvent({
        id: 'trust-boost',
        type: 'metrics',
        timing: { delayMs: ms(18), duration: ms(5) },
        payload: {
          impact: 'success',
          headline: 'Trust uplift achieved',
          details: 'Coordinated authenticity sweeps improved overall trust posture.',
          delta: { active: 1 },
          activity: { summary: 'Trust uplift attributed to authenticity sweeps', channel: 'system' },
        },
      }),
      buildEvent({
        id: 'trust-forecast',
        type: 'activity',
        timing: { delayMs: ms(31), duration: ms(3) },
        payload: {
          impact: 'info',
          headline: 'Leadership brief circulated',
          details: 'Predictive trust outlook delivered with annotated projection bands.',
          summary: 'Trust forecast distributed to executive stakeholders',
          channel: 'comms',
        },
      }),
    ],
  },
];

export const scenarioEventId = () => randomId('scenario-event');

export const getScenarioDefinition = (scenarioId: string) =>
  SCENARIO_LIBRARY.find((scenario) => scenario.id === scenarioId);

