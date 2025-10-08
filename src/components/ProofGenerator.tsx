import React, { useState } from 'react';
import { buildMerkleTree, generateMerkleProof } from '../utils/merkleTree';
import { verifyMerkleProof } from '../utils/proofValidation';

/**
 * ProofGenerator lets users experiment with Merkle tree creation and
 * verification. They can input arbitrary leaf values, generate the tree
 * structure and compute proofs for individual leaves. Verification of
 * generated proofs is also provided.
 */
const ProofGenerator: React.FC = () => {
  const [leavesInput, setLeavesInput] = useState('a,b,c,d');
  const [tree, setTree] = useState<string[][]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [proof, setProof] = useState<string[]>([]);
  const [root, setRoot] = useState<string | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);

  const generateTree = () => {
    const leaves = leavesInput.split(',').map((s) => s.trim()).filter(Boolean);
    if (leaves.length === 0) return;
    const merkleTree = buildMerkleTree(leaves);
    setTree(merkleTree);
    const { proof: p, root: r } = generateMerkleProof(leaves, selectedIndex);
    setProof(p);
    setRoot(r);
    setVerified(null);
  };

  const handleVerify = () => {
    const leaves = leavesInput.split(',').map((s) => s.trim()).filter(Boolean);
    const leaf = leaves[selectedIndex] ?? '';
    if (!root) return;
    const ok = verifyMerkleProof(leaf, proof, root);
    setVerified(ok);
  };

  return (
    <div className="proof-generator">
      <div className="card">
        <h2>Merkle Proof Generator</h2>
        <label>
          <span className="label-title">Leaves (comma separated)</span>
          <input type="text" value={leavesInput} onChange={(e) => setLeavesInput(e.target.value)} />
        </label>
        <div className="inline-controls">
          <label>
            <span className="label-title">Leaf Index</span>
            <input
              className="number-input"
              type="number"
              min="0"
              max={Math.max(leavesInput.split(',').length - 1, 0)}
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
            />
          </label>
          <button className="btn-secondary" onClick={generateTree}>
            Generate Proof
          </button>
        </div>
        {tree.length > 0 && (
          <div className="info-panel">
            <h3>Tree Levels</h3>
            <div className="mono-block trust-tree">
              {tree.map((level, idx) => (
                <div key={idx} className="trust-tree__level">
                  <strong>Level {idx}:</strong> {level.join(' | ')}
                </div>
              ))}
            </div>
            <h3>Proof</h3>
            <div className="mono-block">{proof.join(' | ')}</div>
            <p>Merkle Root</p>
            <div className="mono-block">{root}</div>
            <div className="action-row">
              <button className="btn-primary" onClick={handleVerify}>
                Verify Proof
              </button>
              {verified !== null && (
                <span className={verified ? 'status-callout status-callout--success' : 'status-callout status-callout--danger'}>
                  {verified ? 'Valid' : 'Invalid'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProofGenerator;