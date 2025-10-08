import React, { useState, useMemo } from 'react';
import { DUMMY_MERKLE_PROOFS, DUMMY_TRUST_NETWORK } from '../services/dummyData';
import { generateMerkleProof, buildMerkleTree } from '../utils/merkleTree';
import { verifyMerkleProof } from '../utils/proofValidation';

/**
 * TrustVisualization demonstrates several core concepts: Merkle tree
 * generation and inspection, interactive trust score calculation and
 * proof validation. It also provides a simple consensus indicator based
 * on the average trust score of the network.
 */
const TrustVisualization: React.FC = () => {
  const [riskFactor, setRiskFactor] = useState(0.5);
  const [reliability, setReliability] = useState(0.5);
  const [selectedProofIndex, setSelectedProofIndex] = useState(0);

  // Compute custom trust score based on slider values
  const customScore = useMemo(() => {
    // Weighted average between reliability and inverse risk
    const reliabilityWeight = reliability;
    const riskWeight = 1 - riskFactor;
    return Math.round((reliabilityWeight * 100 + riskWeight * 100) / 2);
  }, [riskFactor, reliability]);

  const customScoreClass = useMemo(() => {
    if (customScore >= 75) return 'status-callout status-callout--success';
    if (customScore >= 50) return 'status-callout';
    return 'status-callout status-callout--danger';
  }, [customScore]);

  // Derive consensus as average of trust scores in network
  const consensus = useMemo(() => {
    const avg = DUMMY_TRUST_NETWORK.nodes.reduce((acc, n) => acc + n.trust_score, 0) / DUMMY_TRUST_NETWORK.nodes.length;
    return Math.round(avg);
  }, []);

  // Select proof from dummy list
  const selectedProof = DUMMY_MERKLE_PROOFS[selectedProofIndex] ?? null;
  const leaves = selectedProof?.proof ?? [];
  const merkleTree = useMemo(() => buildMerkleTree(leaves), [leaves]);

  // Validate proof using our helper
  const proofValid = useMemo(() => {
    if (!selectedProof) return false;
    // For demonstration treat first element as leaf
    const leaf = leaves[0] ?? '';
    const root = merkleTree[merkleTree.length - 1]?.[0] ?? '';
    return verifyMerkleProof(leaf, selectedProof.proof, root);
  }, [selectedProof, merkleTree]);

  return (
    <div className="trust-visualization">
      <div className="card">
        <h2>Merkle Tree Inspector</h2>
        {selectedProof ? (
          <div className="mono-block trust-tree">
            {merkleTree.map((level, idx) => (
              <div key={idx} className="trust-tree__level">
                <strong>Level {idx}:</strong> {level.join(' | ')}
              </div>
            ))}
          </div>
        ) : (
          <p>No proof selected.</p>
        )}
        <label>
          <span className="label-title">Select Proof</span>
          <select value={selectedProofIndex} onChange={(e) => setSelectedProofIndex(Number(e.target.value))}>
            {DUMMY_MERKLE_PROOFS.map((_, idx) => (
              <option value={idx} key={idx}>
                Proof {idx + 1}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="card">
        <h2>Trust Score Calculator</h2>
        <label>
          <span className="label-title">Reliability ({Math.round(reliability * 100)}%)</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={reliability}
            onChange={(e) => setReliability(parseFloat(e.target.value))}
          />
        </label>
        <label>
          <span className="label-title">Risk Factor ({Math.round(riskFactor * 100)}%)</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={riskFactor}
            onChange={(e) => setRiskFactor(parseFloat(e.target.value))}
          />
        </label>
        <p>Calculated Trust Score</p>
        <span className={customScoreClass}>{customScore}</span>
        <div className="progress-bar progress-bar--green">
          <div className="progress-bar__fill" style={{ width: `${customScore}%` }}></div>
        </div>
      </div>
      <div className="card">
        <h2>Proof Validation Simulator</h2>
        {selectedProof ? (
          <p>
            Computed root status:{' '}
            <span className={proofValid ? 'status-callout status-callout--success' : 'status-callout status-callout--danger'}>
              {proofValid ? 'Valid' : 'Invalid'}
            </span>
          </p>
        ) : (
          <p>Select a proof to verify.</p>
        )}
      </div>
      <div className="card">
        <h2>Network Consensus</h2>
        <p>
          Average Trust Score across nodes: <strong>{consensus}</strong>
        </p>
        <div className="status-group">
          <span className={consensus >= 75 ? 'status-callout status-callout--success' : 'status-callout'}>
            Consensus {consensus}%
          </span>
        </div>
        <div className="progress-bar progress-bar--blue">
          <div className="progress-bar__fill" style={{ width: `${consensus}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default TrustVisualization;