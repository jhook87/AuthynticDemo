import { CyberIncident } from './scenarios/CyberIncident.js';
import { CrossChainVerification } from './scenarios/CrossChainVerification.js';
import { SecureRelay } from './scenarios/SecureRelay.js';

export type { DemoScenario, ScenarioCatalog } from './types/scenarioTypes.js';

export { CyberIncident, CrossChainVerification, SecureRelay };

export const scenarioCatalog = {
  primary: CyberIncident,
  supporting: [CrossChainVerification, SecureRelay],
} as const;
