import type { MediaAsset, ModerationInsight, WatermarkRecord } from '../../types';
import { AUTHENTICITY_THRESHOLDS } from '../../constants';
import { computeHash } from '../crypto/hashService';
import { randomFloat, randomId } from '../../utils/random';

const fingerprint = (hash: string) => hash.slice(0, 32);

export const createMediaAsset = async (
  fileName: string,
  type: MediaAsset['type'],
  data?: ArrayBuffer,
): Promise<MediaAsset> => {
  const hashInput = data ? new Uint8Array(data) : fileName;
  const hashResult = await computeHash('sha-256', hashInput);
  return {
    id: randomId('asset'),
    type,
    title: `Sample ${type.toUpperCase()} Asset`,
    fileName,
    hash: hashResult.digest,
    fingerprint: fingerprint(hashResult.digest),
    authenticityScore: randomFloat(60, 98),
    similarityMatches: [],
    moderationFlags: [],
    lastUpdated: Date.now(),
  };
};

export const computeSimilarity = (asset: MediaAsset, others: MediaAsset[]): MediaAsset => ({
  ...asset,
  similarityMatches: others
    .filter((other) => other.id !== asset.id)
    .map((other) => ({
      assetId: other.id,
      score: randomFloat(0, 1),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3),
});

export const applyWatermark = (asset: MediaAsset): WatermarkRecord => ({
  assetId: asset.id,
  watermarkStrength: randomFloat(0.6, 0.95),
  detectionConfidence: randomFloat(0.8, 0.99),
  reversible: Math.random() > 0.4,
  appliedAt: Date.now(),
});

export const moderateAsset = (asset: MediaAsset): ModerationInsight => {
  const riskLevel: ModerationInsight['riskLevel'] =
    asset.authenticityScore > AUTHENTICITY_THRESHOLDS.trusted
      ? 'low'
      : asset.authenticityScore > AUTHENTICITY_THRESHOLDS.review
      ? 'moderate'
      : 'high';
  const policyViolations = riskLevel === 'low' ? [] : ['Potential tampering detected'];
  return {
    assetId: asset.id,
    riskLevel,
    policyViolations,
    reviewer: riskLevel === 'low' ? undefined : 'Automation',
    reviewedAt: Date.now(),
  };
};
