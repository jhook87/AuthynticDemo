import { useEffect, useMemo, useState } from 'react';
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
  const algorithmList = useMemo(() => [...HASH_ALGORITHMS] as HashAlgorithm[], []);

  useEffect(() => {
    let disposed = false;
    const bootstrap = async () => {
      if (assets.length || disposed) return;
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
      if (!assetsOnly.length || disposed) {
        return;
      }
      const comparable = assetsOnly.map((asset) => ({ ...asset }));
      upsertMediaAssets(assetsOnly.map((asset) => computeSimilarity(asset, comparable)));
      if (disposed) return;
      setDefinitions(new Map(created.map((item) => [item.asset.id, item.definition])));
      setSelected(assetsOnly[0]?.id);
      setWatermark(applyWatermark(assetsOnly[0]));
      setTimestampRecord(anchorContent(assetsOnly[0].id));
      setZkProof(generateProof());
      setModeration(moderateAsset(assetsOnly[0]));
      const digestList = await computeMultipleHashes(assetsOnly[0].hash, algorithmList);
      const digestMap = digestList.reduce(
        (acc, value) => ({ ...acc, [value.algorithm]: value.digest }),
        {} as Record<HashAlgorithm, string>,
      );
      if (!disposed) {
        setHashes(digestMap);
      }
    };
    bootstrap();
    return () => {
      disposed = true;
    };
  }, [assets, algorithmList]);

  useEffect(() => {
    const current = assets.find((asset) => asset.id === selected);
    if (!current) return;
    let disposed = false;
    const update = async () => {
      const digestList = await computeMultipleHashes(current.hash, algorithmList);
      const digestMap = digestList.reduce(
        (acc, value) => ({ ...acc, [value.algorithm]: value.digest }),
        {} as Record<HashAlgorithm, string>,
      );
      if (disposed) return;
      setHashes(digestMap);
      setWatermark(applyWatermark(current));
      setTimestampRecord(anchorContent(current.id));
      setZkProof(generateProof());
      setModeration(moderateAsset(current));
    };
    update();
    return () => {
      disposed = true;
    };
  }, [selected, assets, algorithmList]);

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

  return (
    <section className="panel media-panel">
      <header>
        <h2>Media authenticity pipeline</h2>
        <p>Hashing, watermarking, and zero-knowledge attestations across sample assets.</p>
      </header>
      <div className="media-layout">
        <aside>
          <ul>
            {assets.map((asset) => (
              <li key={asset.id}>
                <button type="button" onClick={() => setSelected(asset.id)} className={asset.id === selected ? 'active' : ''}>
                  <strong>{asset.title}</strong>
                  <span>{asset.type}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div className="media-preview">
          {selectedAsset && (
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
              {selectedAsset.type === 'video' && !selectedDefinition?.frames && (
                <p>Simulated operations feed unavailable.</p>
              )}
            </div>
          )}
          {selectedAsset && (
            <dl className="media-details">
              <div>
                <dt>Fingerprint</dt>
                <dd>{formatHash(selectedAsset.fingerprint)}</dd>
              </div>
              <div>
                <dt>Authenticity</dt>
                <dd>{selectedAsset.authenticityScore.toFixed(1)} / 100</dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>{formatTimestamp(selectedAsset.lastUpdated)}</dd>
              </div>
            </dl>
          )}
        </div>
        <div className="media-analytics">
          <section>
            <h3>Multi-algorithm hashing</h3>
            <ul>
              {Object.entries(hashes).map(([algorithm, digest]) => (
                <li key={algorithm}>
                  <strong>{algorithm}</strong>
                  <span>{formatHash(digest)}</span>
                </li>
              ))}
            </ul>
          </section>
          {watermark && (
            <section>
              <h3>Watermark</h3>
              <p>Strength {watermark.watermarkStrength.toFixed(2)} · Detection {watermark.detectionConfidence.toFixed(2)}</p>
              <p>{watermark.reversible ? 'Reversible' : 'Permanent'} watermark applied {formatTimestamp(watermark.appliedAt)}</p>
            </section>
          )}
          {timestampRecord && (
            <section>
              <h3>Blockchain anchoring</h3>
              <p>
                Anchored on {timestampRecord.anchorChain} · Tx {timestampRecord.transactionHash.slice(0, 14)}…
              </p>
              <p>{timestampRecord.confirmed ? 'Confirmed' : 'Awaiting confirmations'}</p>
            </section>
          )}
          {moderation && (
            <section>
              <h3>Content moderation</h3>
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
              <h3>Merkle verification</h3>
              <p>Root {formatHash(merkleRoot)}</p>
              <p>Batch verified {batchProof.proofs.filter((proof) => proof.verified).length} / {batchProof.proofs.length}</p>
            </section>
          )}
          {zkProof && (
            <section>
              <h3>Zero-knowledge attestation</h3>
              <p>{zkProof.statement}</p>
              <p>{zkProof.verified ? 'Proof verified' : 'Verification pending'} · Confidence {zkProof.confidence.toFixed(2)}</p>
            </section>
          )}
        </div>
      </div>
    </section>
  );
};
