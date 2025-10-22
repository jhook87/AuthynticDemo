import { DemoScenario } from '../types/scenarioTypes.js';

export const SecureRelay: DemoScenario = {
  id: 'secure-relay',
  name: 'Secure Relay Operations',
  description: 'Assured transport of intelligence feeds through hardened relays.',
  duration: 600_000,
  stages: [
    {
      name: 'Relay Initialization',
      duration: 150_000,
      events: [
        {
          type: 'RELAY_BOOTSTRAP',
          description: 'Relay nodes establish encrypted peer mesh.',
        },
        {
          type: 'CHANNEL_CALIBRATION',
          description: 'Adaptive bandwidth calibration across contested spectrum.',
        },
      ],
    },
    {
      name: 'Secure Transport',
      duration: 240_000,
      events: [
        {
          type: 'PAYLOAD_ENCRYPTION',
          description: 'Payload encryption with post-quantum ciphers engaged.',
        },
        {
          type: 'ANOMALY_GUARD_WARNING',
          severity: 'warning',
          description: 'Anomaly guard flagged inconsistent telemetry traces.',
        },
      ],
    },
    {
      name: 'Continuity Assurance',
      duration: 210_000,
      events: [
        {
          type: 'FAILOVER_TEST',
          description: 'Cross-relay failover executed under degraded conditions.',
        },
        {
          type: 'MISSION_FEEDBACK',
          severity: 'info',
          description: 'Mission feedback loop confirms delivery with high fidelity.',
        },
      ],
    },
  ],
};
