import React, { useState, useEffect } from 'react';
import { getMediaStreams, generateProofForStream } from '../services/mockStreamingService';
import { MediaStream, MerkleProof } from '../types/authyntic';
import { verifyMerkleProof } from '../utils/proofValidation';

/**
 * StreamingDemo showcases video/audio playback alongside proof generation and
 * authentication checks. Users can select a stream, view a sample media
 * file and trigger proof creation. They may also simulate tampering to
 * observe how verification behaves.
 */
const StreamingDemo: React.FC = () => {
  const [streams, setStreams] = useState<MediaStream[]>([]);
  const [selectedId, setSelectedId] = useState<string>('stream_001');
  const [proof, setProof] = useState<MerkleProof | null>(null);
  const [tampered, setTampered] = useState(false);

  useEffect(() => {
    getMediaStreams().then(setStreams);
  }, []);

  const handleGenerateProof = async () => {
    const p = await generateProofForStream(selectedId);
    setProof(p);
    setTampered(false);
  };

  // Determine verification result
  const verification = proof
    ? verifyMerkleProof(
        tampered ? proof.mediaHash.slice(1) : proof.mediaHash, // simple tampering: remove first char
        proof.proof,
        proof.proof.length ? proof.proof[proof.proof.length - 1] : proof.mediaHash
      )
    : false;

  return (
    <div className="streaming-demo">
      <div className="card">
        <h2>Select Stream</h2>
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          {streams.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} - {s.source}
            </option>
          ))}
        </select>
      </div>
      <div className="card">
        <h2>Media Playback</h2>
        {/* Use the same dummy media files for all streams for simplicity */}
        <video width="100%" height="200" controls src="/demo-media/sample-video.mp4"></video>
        <audio controls src="/demo-media/sample-audio.wav" style={{ width: '100%', marginTop: '0.5rem' }}></audio>
      </div>
      <div className="card">
        <h2>Proof Generation</h2>
        <button onClick={handleGenerateProof} style={{ marginRight: '0.5rem' }}>
          Generate Proof
        </button>
        {proof && (
          <>
            <button onClick={() => setTampered(!tampered)}>
              {tampered ? 'Revert Tamper' : 'Simulate Tamper'}
            </button>
            <div style={{ marginTop: '0.5rem' }}>
              <p>
                Proof Hash: <code>{proof.mediaHash}</code>
              </p>
              <p>
                Tampered: <strong>{tampered ? 'Yes' : 'No'}</strong>
              </p>
              <p>
                Verification: {verification ? 'Success ✅' : 'Failed ❌'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StreamingDemo;