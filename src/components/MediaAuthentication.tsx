import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

/**
 * MediaAuthentication allows users to simulate uploading a media file and
 * receiving an authenticity score. In a real system this would involve
 * complex cryptographic verification against known proofs. Here we simply
 * hash the file and assign a random confidence score.
 */
const MediaAuthentication: React.FC = () => {
  const [fileName, setFileName] = useState<string>('');
  const [score, setScore] = useState<number | null>(null);
  const [hash, setHash] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer as any);
      const computedHash = CryptoJS.SHA256(wordArray).toString();
      setHash(computedHash);
      // Generate pseudo score based on hash value
      const seed = parseInt(computedHash.slice(0, 4), 16);
      const generatedScore = (seed % 10000) / 100;
      setScore(generatedScore);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="media-auth">
      <div className="card">
        <h2>Media Upload Simulation</h2>
        <input type="file" accept="image/*,video/*,audio/*" onChange={handleFileChange} />
        {fileName && (
          <p>
            Uploaded: <strong>{fileName}</strong>
          </p>
        )}
        {score !== null && (
          <div style={{ marginTop: '0.5rem' }}>
            <p>
              Authenticity Score: <strong>{score.toFixed(2)}%</strong>
            </p>
            <div style={{ background: '#eee', borderRadius: '4px', height: '12px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${score}%`,
                  background: score > 80 ? '#4caf50' : score > 50 ? '#ffc107' : '#f44336',
                  height: '100%',
                }}
              ></div>
            </div>
            <p>
              Hash: <code>{hash}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaAuthentication;