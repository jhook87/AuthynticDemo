import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOperatorStore, upsertMediaAssets } from '../../store';
import { createMediaAsset, applyWatermark, computeSimilarity, moderateAsset } from '../../services/storage/mediaStorageService';
import { computeMultipleHashes } from '../../services/crypto/hashService';
import { createBatchProof, deriveRoot } from '../../services/crypto/merkleService';
import { generateProof } from '../../services/crypto/zkpService';
import { anchorContent } from '../../services/crypto/timestampService';
import type { HashAlgorithm, MerkleLeaf } from '../../types';
import { HASH_ALGORITHMS } from '../../constants';
import { formatHash, formatTimestamp } from '../../utils/formatters';
import { SAMPLE_MEDIA, type SampleMediaDefinition } from '../../constants/mediaSamples';
import { SimulatedVideoFeed } from './SimulatedVideoFeed';
import { demoCryptoService } from '../../services/demo/demoCryptoService';
import { demoInteractionService } from '../../services/demo/demoInteractionService';
import { FeatureCard } from '../shared/FeatureCard';
import { ProcessingStep } from '../shared/ProcessingStep';

interface HashAnimationState {
  active: boolean;
  percent: number;
  message: string;
  hash?: string;
}

const pseudoHash = (left: string, right: string) => {
  let hash = 0;
  const combined = `${left}${right}`;
  for (let index = 0; index < combined.length; index += 1) {
    hash = (hash << 5) - hash + combined.charCodeAt(index);
    hash |= 0;
  }
  const sanitized = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${sanitized}${combined.length.toString(16).padStart(4, '0')}`;
};

const buildDemoMerkleLevels = (leaves: MerkleLeaf[]) => {
  if (!leaves.length) {
    return [] as string[][];
  }

  const levels: string[][] = [];
  let current = leaves.map((leaf) => leaf.hash);
  levels.push(current);

  while (current.length > 1) {
    const next: string[] = [];
    for (let index = 0; index < current.length; index += 2) {
      const left = current[index];
      const right = current[index + 1] ?? current[index];
      next.push(pseudoHash(left, right));
    }
    current = next;
    levels.push(current);
  }

  return levels;
};

export const MediaPipelineView = () => {
  const assets = useOperatorStore((state) => state.mediaAssets);
  const [selected, setSelected] = useState<string | undefined>(assets[0]?.id);
  const [hashes, setHashes] = useState<Record<HashAlgorithm, string>>({} as Record<HashAlgorithm, string>);
  const [watermark, setWatermark] = useState(() => (assets[0] ? applyWatermark(assets[0]) : undefined));
  const [timestampRecord, setTimestampRecord] = useState(() => (assets[0] ? anchorContent(assets[0].id) : undefined));
  const [zkProof, setZkProof] = useState(() => generateProof());
  const [moderation, setModeration] = useState(() => (assets[0] ? moderateAsset(assets[0]) : undefined));
  const [definitions, setDefinitions] = useState<Map<string, SampleMediaDefinition>>(
    () => new Map(),
  );
  const [hashAnimation, setHashAnimation] = useState<HashAnimationState>({
    active: false,
    percent: 0,
    message: 'Ready to simulate hash verification.',
  });
  const progressRef = useRef<HTMLElement | null>(null);
  const spotlightTimeout = useRef<number | null>(null);
  const [hashSpotlight, setHashSpotlight] = useState(false);
  const clearSpotlightTimeout = useCallback(() => {
    if (spotlightTimeout.current !== null) {
      if (typeof window !== 'undefined') {
        window.clearTimeout(spotlightTimeout.current);
      }
      spotlightTimeout.current = null;
    }
  }, []);
  const algorithmList = useMemo(() => [...HASH_ALGORITHMS] as HashAlgorithm[], []);

  const updateHashes = useCallback(
    async (assetHash: string) => {
      const digestList = await computeMultipleHashes(assetHash, algorithmList);
      const digestMap = digestList.reduce(
        (acc, value) => ({ ...acc, [value.algorithm]: value.digest }),
        {} as Record<HashAlgorithm, string>,
      );
      setHashes(digestMap);
    },
    [algorithmList],
  );

  useEffect(() => {
    const bootstrap = async () => {
      if (assets.length) return;
      const created = await Promise.all(
        SAMPLE_MEDIA.map(async (entry) => {
          try {
            const buffer = await entry.getData();
            const asset = await createMediaAsset(entry.fileName, entry.type, buffer);
            return { asset, definition: entry };
          } catch (error) {
            console.error('Unable to generate sample media payload', entry.id, error);
            const asset = await createMediaAsset(entry.fileName, entry.type);
            return { asset, definition: entry };
          }
        }),
      );
      const assetsOnly = created.map((item) => item.asset);
      if (!assetsOnly.length) {
        return;
      }
      const comparable = assetsOnly.map((asset) => ({ ...asset }));
      upsertMediaAssets(assetsOnly.map((asset) => computeSimilarity(asset, comparable)));
      setDefinitions(new Map(created.map((item) => [item.asset.id, item.definition])));
      setSelected(assetsOnly[0]?.id);
      setWatermark(applyWatermark(assetsOnly[0]));
      setTimestampRecord(anchorContent(assetsOnly[0].id));
      setZkProof(generateProof());
      setModeration(moderateAsset(assetsOnly[0]));
      await updateHashes(assetsOnly[0].hash);
    };
    bootstrap();
  }, [assets, updateHashes]);

  useEffect(() => {
    const current = assets.find((asset) => asset.id === selected);
    if (!current) return;
    const update = async () => {
      await updateHashes(current.hash);
      setWatermark(applyWatermark(current));
      setTimestampRecord(anchorContent(current.id));
      setZkProof(generateProof());
      setModeration(moderateAsset(current));
    };
    update();
  }, [selected, assets, updateHashes]);

  useEffect(() => {
    setHashAnimation((state) =>
      state.active
        ? state
        : { active: false, percent: 0, message: 'Ready to simulate hash verification.', hash: undefined },
    );
    setHashSpotlight(false);
    clearSpotlightTimeout();
  }, [clearSpotlightTimeout, selected]);

  useEffect(() => () => {
    clearSpotlightTimeout();
  }, [clearSpotlightTimeout]);

  const handleSimulatedUpload = useCallback(async (assetId?: string) => {
    const targetId = assetId ?? selected;
    const current = assets.find((asset) => asset.id === targetId);
    if (!current) {
      setHashAnimation({ active: false, percent: 0, message: 'Select a media asset to begin the simulation.' });
      return;
    }

    progressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHashSpotlight(true);
    clearSpotlightTimeout();
    setHashAnimation({ active: true, percent: 5, message: 'Initializing demo pipeline…', hash: undefined });

    try {
      const demoHash = await demoCryptoService.generateHashWithAnimation(current.hash, (percent, message) => {
        setHashAnimation((previous) => ({
          ...previous,
          active: true,
          percent,
          message,
        }));
      });

      await updateHashes(current.hash);
      setHashAnimation({
        active: false,
        percent: 100,
        message: 'Hash generated! Demo verification complete.',
        hash: demoHash,
      });
      if (typeof window !== 'undefined') {
        spotlightTimeout.current = window.setTimeout(() => {
          setHashSpotlight(false);
          clearSpotlightTimeout();
        }, 1600);
      }
    } catch (error) {
      console.error('Demo upload simulation failed', error);
      setHashAnimation({ active: false, percent: 0, message: 'Simulation interrupted. Please try again.' });
      if (typeof window !== 'undefined') {
        spotlightTimeout.current = window.setTimeout(() => {
          setHashSpotlight(false);
          clearSpotlightTimeout();
        }, 1200);
      }
    }
  }, [assets, clearSpotlightTimeout, selected, updateHashes]);

  const startDemo = useCallback(
    async (mediaType: SampleMediaDefinition['type']) => {
      const matchingAsset = assets.find((asset) => {
        const definition = definitions.get(asset.id);
        return definition?.type === mediaType;
      });

      if (matchingAsset) {
        setSelected(matchingAsset.id);
        await handleSimulatedUpload(matchingAsset.id);
      } else if (assets[0]) {
        setSelected(assets[0].id);
        await handleSimulatedUpload(assets[0].id);
      }
    },
    [assets, definitions, handleSimulatedUpload],
  );

  useEffect(() => {
    const unsubscribe = demoInteractionService.on('media.simulateUpload', () => {
      void handleSimulatedUpload();
    });
    return unsubscribe;
  }, [handleSimulatedUpload]);

  useEffect(
    () =>
      demoInteractionService.on('media.focusHashPanel', () => {
        progressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHashSpotlight(true);
        clearSpotlightTimeout();
        if (typeof window !== 'undefined') {
          spotlightTimeout.current = window.setTimeout(() => {
            setHashSpotlight(false);
            clearSpotlightTimeout();
          }, 1800);
        }
      }),
    [clearSpotlightTimeout],
  );

  const selectedAsset = assets.find((asset) => asset.id === selected);
  const selectedDefinition = selectedAsset ? definitions.get(selectedAsset.id) : undefined;
  const leaves: MerkleLeaf[] = useMemo(
    () => assets.map((asset) => ({ id: asset.id, hash: asset.hash })),
    [assets],
  );

  const batchProof = useMemo(
    () => (leaves.length ? createBatchProof(leaves, leaves.map((_, index) => index)) : undefined),
    [leaves],
  );

  const merkleRoot = useMemo(() => (leaves.length ? deriveRoot(leaves) : null), [leaves]);
  const merkleLevels = useMemo(() => buildDemoMerkleLevels(leaves), [leaves]);

  const pipelineSteps = useMemo(
    () => {
      const percent = Math.max(0, Math.min(100, hashAnimation.percent));
      const baseSteps = [
        {
          key: 'hashing',
          title: 'Generating Hash Signatures',
          description: 'Parallel hashing across SHA-256, BLAKE2b, and Keccak digests.',
          start: 0,
          end: 33,
        },
        {
          key: 'merkle',
          title: 'Creating Merkle Tree',
          description: 'Batch aggregation and witness compilation for audit evidence.',
          start: 33,
          end: 66,
        },
        {
          key: 'anchoring',
          title: 'Blockchain Anchoring',
          description: 'Consensus notarisation and timestamp attestation.',
          start: 66,
          end: 100,
        },
      ];

      return baseSteps.map((step) => {
        let status: 'pending' | 'active' | 'complete' = 'pending';
        if (percent >= step.end) {
          status = 'complete';
        } else if (percent > step.start) {
          status = 'active';
        }

        const range = step.end - step.start;
        const progress = percent <= step.start
          ? 0
          : percent >= step.end
            ? 100
            : ((percent - step.start) / range) * 100;

        if (!hashAnimation.active && percent === 0) {
          status = 'pending';
        }

        return {
          key: step.key,
          title: step.title,
          description: step.description,
          status,
          progress,
        };
      });
    },
    [hashAnimation.active, hashAnimation.percent],
  );

  const processingActive = hashAnimation.active || hashAnimation.percent > 0;

  return (
    <div className="media-pipeline-container">
      <section className="pipeline-hero fade-in">
        <h1 className="text-display-1">Media Provenance Pipeline</h1>
        <p className="text-body-lg">
          Upload or simulate any media file and watch Authyntic orchestrate hashing, Merkle proofs, and blockchain anchoring in
          real-time.
        </p>
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              void handleSimulatedUpload();
            }}
            disabled={hashAnimation.active || assets.length === 0}
          >
            {hashAnimation.active ? 'Simulating Pipeline…' : 'Start Live Demo'}
          </button>
        </div>
      </section>

      <section className="upload-demo-section fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="card upload-zone">
          <div className="upload-dropzone">
            <span className="upload-icon" aria-hidden="true">☁️</span>
            <h3 className="text-heading-2">Drop your media file here</h3>
            <p className="text-body-lg">Or select from our curated samples to see provenance automation in action.</p>
            <div className="sample-files">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  void startDemo('image');
                }}
                disabled={!assets.length || hashAnimation.active}
              >
                📸 Demo Image
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  void startDemo('video');
                }}
                disabled={!assets.length || hashAnimation.active}
              >
                🎥 Demo Video
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  void startDemo('audio');
                }}
                disabled={!assets.length || hashAnimation.active}
              >
                🎵 Demo Audio
              </button>
            </div>
          </div>
          <div className="media-asset-list">
            {assets.length === 0 && <div className="loading-skeleton" style={{ height: '64px' }} />}
            {assets.map((asset) => (
              <button
                type="button"
                key={asset.id}
                className={`media-asset-toggle${asset.id === selected ? ' media-asset-toggle--active' : ''}`}
                onClick={() => setSelected(asset.id)}
                disabled={hashAnimation.active}
              >
                <strong>{asset.title}</strong>
                <span>{asset.type}</span>
              </button>
            ))}
          </div>
        </div>

        {processingActive && (
          <div className="processing-visualization slide-up">
            <h3 className="text-heading-2">Processing Media File…</h3>
            <div className="crypto-operations">
              {pipelineSteps.map((step) => (
                <ProcessingStep
                  key={step.key}
                  title={step.title}
                  description={step.description}
                  status={step.status}
                  progress={step.progress}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="media-panel fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="media-preview">
          <header>
            <h2 className="text-heading-2">Media Preview</h2>
            <p className="text-muted">High-fidelity playback with instant authenticity diagnostics.</p>
          </header>
          {selectedAsset ? (
            <>
              <div className="media-player">
                {selectedAsset.type === 'image' && (
                  <img src={selectedDefinition?.previewUrl ?? selectedAsset.fileName} alt={selectedAsset.title} />
                )}
                {selectedAsset.type === 'audio' && (
                  <audio controls src={selectedDefinition?.previewUrl ?? selectedAsset.fileName} />
                )}
                {selectedAsset.type === 'video' && selectedDefinition?.frames && (
                  <SimulatedVideoFeed frames={selectedDefinition.frames} />
                )}
                {selectedAsset.type === 'video' && !selectedDefinition?.frames && <p>Simulated operations feed unavailable.</p>}
              </div>
              <dl className="media-details">
                <div>
                  <dt>Fingerprint</dt>
                  <dd>{formatHash(selectedAsset.fingerprint)}</dd>
                </div>
                <div>
                  <dt>Authenticity score</dt>
                  <dd>{selectedAsset.authenticityScore.toFixed(1)} / 100</dd>
                </div>
                <div>
                  <dt>Last updated</dt>
                  <dd>{formatTimestamp(selectedAsset.lastUpdated)}</dd>
                </div>
              </dl>
            </>
          ) : (
            <div className="loading-skeleton" style={{ height: '220px' }} />
          )}
        </div>

        <div
          className={`crypto-progress${hashSpotlight ? ' slide-up' : ''}`}
          aria-live="polite"
          ref={progressRef}
        >
          <h2 className="text-heading-2">Cryptographic Operations</h2>
          <p
            className={`crypto-progress-message${
              hashAnimation.hash ? ' crypto-progress-message--success' : ''
            }`}
            role="status"
          >
            {hashAnimation.message}
          </p>
          <div className="progress-bar" role="presentation">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, Math.max(0, hashAnimation.percent))}%` }}
              aria-hidden="true"
            />
          </div>
          {hashAnimation.hash && (
            <p className="crypto-progress-message crypto-progress-message--success" aria-live="assertive">
              Demo hash <code>{formatHash(hashAnimation.hash)}</code>
            </p>
          )}
        </div>

        <div className="media-insights">
          <section>
            <h3 className="text-heading-2" style={{ fontSize: '1.25rem' }}>Multi-algorithm hashing</h3>
            <ul>
              {Object.entries(hashes).map(([algorithm, digest]) => (
                <li key={algorithm}>
                  <strong>{algorithm}</strong>
                  <span>{formatHash(digest)}</span>
                </li>
              ))}
            </ul>
          </section>

          {merkleLevels.length > 0 && (
            <section>
              <h3 className="text-heading-2" style={{ fontSize: '1.25rem' }}>Merkle tree reconstruction</h3>
              <div className="merkle-tree-visualizer" role="list">
                {merkleLevels.map((level, levelIndex) => (
                  <div
                    className="merkle-level"
                    key={`merkle-level-${levelIndex}`}
                    role="listitem"
                    aria-label={`Level ${levelIndex + 1}`}
                  >
                    {level.map((hash, nodeIndex) => (
                      <span className="merkle-node" key={`merkle-node-${levelIndex}-${nodeIndex}`}>
                        <small>
                          {levelIndex === 0
                            ? 'Leaf'
                            : levelIndex === merkleLevels.length - 1
                              ? 'Root'
                              : `Layer ${levelIndex}`}
                        </small>
                        <code>{formatHash(hash)}</code>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}

          {watermark && (
            <section>
              <h3 className="text-heading-2" style={{ fontSize: '1.25rem' }}>Watermark intelligence</h3>
              <p>
                Strength {watermark.watermarkStrength.toFixed(2)} · Detection {watermark.detectionConfidence.toFixed(2)}
              </p>
              <p>{watermark.reversible ? 'Reversible' : 'Permanent'} watermark applied {formatTimestamp(watermark.appliedAt)}</p>
            </section>
          )}

          {timestampRecord && (
            <section>
              <h3 className="text-heading-2" style={{ fontSize: '1.25rem' }}>Blockchain anchoring</h3>
              <p>
                Anchored on {timestampRecord.anchorChain} · Tx {timestampRecord.transactionHash.slice(0, 14)}…
              </p>
              <p>{timestampRecord.confirmed ? 'Confirmed' : 'Awaiting confirmations'}</p>
            </section>
          )}

          {moderation && (
            <section>
              <h3 className="text-heading-2" style={{ fontSize: '1.25rem' }}>Content moderation</h3>
              <p>Risk level {moderation.riskLevel}</p>
              {moderation.policyViolations.length > 0 && (
                <ul>
                  {moderation.policyViolations.map((violation) => (
                    <li key={violation}>{violation}</li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {batchProof && merkleRoot && (
            <section>
              <h3 className="text-heading-2" style={{ fontSize: '1.25rem' }}>Merkle verification</h3>
              <p>Root {formatHash(merkleRoot)}</p>
              <p>Batch verified {batchProof.proofs.filter((proof) => proof.verified).length} / {batchProof.proofs.length}</p>
            </section>
          )}

          {zkProof && (
            <section>
              <h3 className="text-heading-2" style={{ fontSize: '1.25rem' }}>Zero-knowledge attestation</h3>
              <p>{zkProof.statement}</p>
              <p>{zkProof.verified ? 'Proof verified' : 'Verification pending'} · Confidence {zkProof.confidence.toFixed(2)}</p>
            </section>
          )}
        </div>
      </section>

      <section className="features-showcase grid grid-3 fade-in" style={{ animationDelay: '0.3s' }}>
        <FeatureCard
          title="Cryptographic Hashing"
          description="Layered digest generation creates immutable digital fingerprints for every media asset."
          businessValue="99.99% tamper detection accuracy"
          techDetails="SHA-256 · BLAKE2b · Keccak orchestration"
          icon="🔐"
        />
        <FeatureCard
          title="Blockchain Anchoring"
          description="Distributed ledger notarisation ensures defensible provenance evidence."
          businessValue="Legal-grade proof of ownership"
          techDetails="Cross-chain timestamping · Consensus validation"
          icon="⛓️"
        />
        <FeatureCard
          title="Zero-Knowledge Proofs"
          description="Privacy-preserving attestations confirm authenticity without exposing sensitive media."
          businessValue="Privacy-first compliance"
          techDetails="zkSNARKs · Selective disclosure workflows"
          icon="🧠"
        />
      </section>
    </div>
  );
};
