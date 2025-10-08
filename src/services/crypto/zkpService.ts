import type { ZkProofSummary } from '../../types';
import { randomFloat, randomId } from '../../utils/random';

const statements = [
  'This operator can reveal provenance without exposing user data.',
  'Media asset integrity confirmed without leaking fingerprint.',
  'Node participated in consensus without revealing identity.',
];

export const generateProof = (): ZkProofSummary => ({
  proofId: randomId('zkp'),
  statement: statements[Math.floor(Math.random() * statements.length)],
  verified: Math.random() > 0.08,
  confidence: randomFloat(0.75, 0.99),
  generatedAt: Date.now(),
});

export const verifyProof = (proof: ZkProofSummary): ZkProofSummary => ({
  ...proof,
  verified: proof.confidence > 0.8,
});
