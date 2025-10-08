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
        <label>
          <span className="label-title">Choose Media</span>
          <input type="file" accept="image/*,video/*,audio/*" onChange={handleFileChange} />
        </label>
        {fileName && <p>Uploaded Asset: <strong>{fileName}</strong></p>}
        {score !== null && (
          <div className="info-panel">
            <p>Authenticity Score</p>
            <div className={score > 80 ? 'status-callout status-callout--success' : score > 50 ? 'status-callout' : 'status-callout status-callout--danger'}>
              {score.toFixed(2)}%
            </div>
            <div className={score > 80 ? 'progress-bar progress-bar--green' : score > 50 ? 'progress-bar progress-bar--blue' : 'progress-bar progress-bar--alert'}>
              <div className="progress-bar__fill" style={{ width: `${Math.min(score, 100)}%` }}></div>
            </div>
            <p>Computed Hash</p>
            <div className="mono-block">{hash}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaAuthentication;