import React, { useEffect, useState } from 'react';
import { getMediaStreams } from '../services/mockStreamingService';
import { getTrustNetwork } from '../services/mockTrustService';
import { DUMMY_MERKLE_PROOFS } from '../services/dummyData';
import { MediaStream, TrustNetwork, MerkleProof } from '../types/authyntic';
import NetworkMap from './NetworkMap';
import { getMerkleRoot } from '../utils/merkleTree';

/**
 * The dashboard component aggregates various pieces of information into a
 * cohesive overview. It shows quick metrics, a small network preview and
 * authenticity scores for active media streams. The data is fetched from
 * mock services on mount and then displayed using simple cards.
 */
const Dashboard: React.FC = () => {
  const [streams, setStreams] = useState<MediaStream[]>([]);
  const [network, setNetwork] = useState<TrustNetwork | null>(null);
  const [proofs, setProofs] = useState<MerkleProof[]>([]);

  useEffect(() => {
    async function loadData() {
      const [s, n] = await Promise.all([getMediaStreams(), getTrustNetwork()]);
      setStreams(s);
      setNetwork(n);
      setProofs(DUMMY_MERKLE_PROOFS);
    }
    loadData();
  }, []);

  const activeStreams = streams.filter((s) => s.status === 'active');
  const onlineNodes = network?.nodes.filter((n) => n.status === 'online') ?? [];
  const offlineNodes = network?.nodes.filter((n) => n.status === 'offline') ?? [];

  // Compute example Merkle root from the first proof for display
  const sampleProof = proofs[0];
  const sampleRoot = sampleProof ? getMerkleRoot(sampleProof.proof) : null;

  return (
    <div className="dashboard">
      <div className="card">
        <h2>Operational Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-item">
            <span className="metric-value">{streams.length}</span>
            <span className="metric-label">Total Streams</span>
          </div>
          <div className="metric-item">
            <span className="metric-value">{activeStreams.length}</span>
            <span className="metric-label">Active Streams</span>
          </div>
          <div className="metric-item">
            <span className="metric-value">{onlineNodes.length}</span>
            <span className="metric-label">Online Nodes</span>
          </div>
          <div className="metric-item">
            <span className="metric-value">{offlineNodes.length}</span>
            <span className="metric-label">Offline Nodes</span>
          </div>
          <div className="metric-item">
            <span className="metric-value">{proofs.filter((p) => p.verified).length}</span>
            <span className="metric-label">Valid Proofs</span>
          </div>
        </div>
      </div>
      <div className="card">
        <h2>Active Media Streams</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Source</th>
                <th>Location</th>
                <th>Authenticity</th>
              </tr>
            </thead>
            <tbody>
              {activeStreams.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.source}</td>
                  <td>{s.location.name}</td>
                  <td>
                    <div className="progress-bar progress-bar--green">
                      <div className="progress-bar__fill" style={{ width: `${s.authenticity}%` }}></div>
                    </div>
                    <small>{s.authenticity.toFixed(1)}%</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <h2>Network Preview</h2>
        {/* Render a compact version of the network map by passing a prop */}
        {network && <NetworkMap network={network} height={300} />}
      </div>
      <div className="card">
        <h2>Example Merkle Root</h2>
        {sampleRoot ? (
          <>
            <p>Root calculated from first proof:</p>
            <div className="mono-block">{sampleRoot}</div>
          </>
        ) : (
          <p>No proof available for demonstration.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;