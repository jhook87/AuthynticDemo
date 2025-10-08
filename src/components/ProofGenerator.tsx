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
          Leaves (comma separated):
          <input
            type="text"
            value={leavesInput}
            onChange={(e) => setLeavesInput(e.target.value)}
            style={{ width: '100%', marginTop: '0.25rem' }}
          />
        </label>
        <label>
          Leaf Index:
          <input
            type="number"
            min="0"
            max={leavesInput.split(',').length - 1}
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            style={{ width: '60px', marginLeft: '0.5rem' }}
          />
        </label>
        <button onClick={generateTree} style={{ marginLeft: '0.5rem' }}>
          Generate Proof
        </button>
        {tree.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h3>Tree Levels</h3>
            {tree.map((level, idx) => (
              <div key={idx} style={{ fontFamily: 'monospace', marginBottom: '0.3rem' }}>
                <strong>Level {idx}:</strong> {level.join(' | ')}
              </div>
            ))}
            <h3>Proof</h3>
            <p style={{ fontFamily: 'monospace' }}>{proof.join(' , ')}</p>
            <p>
              Root: <code>{root}</code>
            </p>
            <button onClick={handleVerify}>Verify Proof</button>
            {verified !== null && (
              <p>Result: {verified ? 'Valid ✅' : 'Invalid ❌'}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProofGenerator;