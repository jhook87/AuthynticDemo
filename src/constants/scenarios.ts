import { randomId } from '../utils/random';
import type { ScenarioImpact } from '../types';

type ScenarioEventKind =
  | {
      type: 'registration';
      name: string;
      organization: string;
      role: string;
      impact: ScenarioImpact;
      headline: string;
      details: string;
      activity: string;
      delta?: { total?: number; active?: number; admin?: number; suspended?: number; biometricEnabled?: number };
    }
  | { type: 'activity'; summary: string; channel: 'system' | 'security' | 'comms' | 'admin'; impact: ScenarioImpact; headline: string; details: string }
  | { type: 'metrics'; delta: { total?: number; active?: number; admin?: number; suspended?: number; biometricEnabled?: number }; impact: ScenarioImpact; headline: string; details: string; activity?: { summary: string; channel: 'system' | 'security' | 'comms' | 'admin' } };

export interface ScenarioScript {
  id: string;
  delayMs: number;
  events: Array<{ delayMs: number; payload: ScenarioEventKind }>;
}

export const SCENARIO_SCRIPTS: ScenarioScript[] = [
  {
    id: 'onboarding-surge',
    delayMs: 1_000,
    events: [
      {
        delayMs: 0,
        payload: {
          type: 'registration',
          name: 'Ava Sinclair',
          organization: 'APAC Command',
          role: 'Regional Strategist',
          impact: 'success',
          headline: 'APAC onboarding wave launched',
          details: 'Command requested four new analyst slots for the APAC incident desk.',
          activity: 'Provisioned credential scope: apac-response/*',
          delta: { total: 1, active: 1, biometricEnabled: 1 },
        },
      },
      {
        delayMs: 2_500,
        payload: {
          type: 'metrics',
          delta: { total: 4, active: 4, admin: 1, biometricEnabled: 2 },
          impact: 'info',
          headline: 'User roster expanded',
          details: 'Directory sync reflected the new APAC roles within 90 seconds.',
          activity: { summary: 'Directory sync completed for APAC cohort', channel: 'system' },
        },
      },
      {
        delayMs: 2_000,
        payload: {
          type: 'registration',
          name: 'Quinn Harper',
          organization: 'Threat Intel',
          role: 'Authenticity Analyst',
          impact: 'success',
          headline: 'Threat Intel assigned support operator',
          details: 'Intel hub assigned Quinn to co-pilot authenticity reviews.',
          activity: 'Assigned to queue: authenticity/triage/rotating',
          delta: { total: 1, active: 1 },
        },
      },
    ],
  },
  {
    id: 'role-hardening',
    delayMs: 10_000,
    events: [
      {
        delayMs: 0,
        payload: {
          type: 'metrics',
          delta: { admin: 2 },
          impact: 'info',
          headline: 'Privilege promotion underway',
          details: 'Two operators elevated to admin for rapid approvals window.',
          activity: { summary: 'Admin promotion audit logged for review', channel: 'security' },
        },
      },
      {
        delayMs: 2_800,
        payload: {
          type: 'activity',
          summary: 'Multi-factor challenge verified for elevated roles',
          channel: 'security',
          impact: 'success',
          headline: 'Security verified admin elevation',
          details: 'Adaptive MFA enforced physical token and biometric handshake.',
        },
      },
    ],
  },
  {
    id: 'biometric-pilot',
    delayMs: 20_000,
    events: [
      {
        delayMs: 0,
        payload: {
          type: 'metrics',
          delta: { biometricEnabled: 5, active: 3 },
          impact: 'success',
          headline: 'Biometric pilot activated',
          details: 'Pilot group enabled passkey authentication across mobile and desktop.',
          activity: { summary: 'Attestation packets verified for pilot cohort', channel: 'system' },
        },
      },
      {
        delayMs: 2_200,
        payload: {
          type: 'activity',
          summary: 'Live biometric recovery drilled for remote ops team',
          channel: 'comms',
          impact: 'info',
          headline: 'Preparedness drill circulated',
          details: 'Guidance distributed to remote operators with fallback codes.',
        },
      },
    ],
  },
  {
    id: 'suspension-review',
    delayMs: 30_000,
    events: [
      {
        delayMs: 0,
        payload: {
          type: 'metrics',
          delta: { suspended: -2, active: 2 },
          impact: 'success',
          headline: 'Suspension review cleared',
          details: 'Trust desk reinstated two accounts after behavior review.',
          activity: { summary: 'Trust review closed two pending suspensions', channel: 'admin' },
        },
      },
      {
        delayMs: 2_500,
        payload: {
          type: 'activity',
          summary: 'Escalated suspension request queued for legal triage',
          channel: 'security',
          impact: 'warning',
          headline: 'Legal escalation pending',
          details: 'One suspended account routed to legal for external coordination.',
        },
      },
    ],
  },
];

export const scenarioEventId = () => randomId('scenario-event');
