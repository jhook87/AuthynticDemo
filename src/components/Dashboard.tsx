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
        <h2>Overview Metrics</h2>
        <div className="metrics-grid" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="metric-item" style={{ flex: '1 1 150px' }}>
            <strong>{streams.length}</strong>
            <div>Total Streams</div>
          </div>
          <div className="metric-item" style={{ flex: '1 1 150px' }}>
            <strong>{activeStreams.length}</strong>
            <div>Active Streams</div>
          </div>
          <div className="metric-item" style={{ flex: '1 1 150px' }}>
            <strong>{onlineNodes.length}</strong>
            <div>Online Nodes</div>
          </div>
          <div className="metric-item" style={{ flex: '1 1 150px' }}>
            <strong>{offlineNodes.length}</strong>
            <div>Offline Nodes</div>
          </div>
          <div className="metric-item" style={{ flex: '1 1 150px' }}>
            <strong>{proofs.filter((p) => p.verified).length}</strong>
            <div>Valid Proofs</div>
          </div>
        </div>
      </div>
      <div className="card">
        <h2>Active Media Streams</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Source</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Location</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Authenticity</th>
              </tr>
            </thead>
            <tbody>
              {activeStreams.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                  <td style={{ padding: '0.5rem' }}>{s.id}</td>
                  <td style={{ padding: '0.5rem' }}>{s.source}</td>
                  <td style={{ padding: '0.5rem' }}>{s.location.name}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <div
                      style={{
                        background: '#eee',
                        borderRadius: '4px',
                        height: '8px',
                        overflow: 'hidden',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          width: `${s.authenticity}%`,
                          background: 'var(--color-accent)',
                          height: '100%',
                        }}
                      ></div>
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
          <p>
            Root calculated from first proof: <code>{sampleRoot}</code>
          </p>
        ) : (
          <p>No proof available for demonstration.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;