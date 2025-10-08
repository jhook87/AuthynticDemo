/**
 * Type definitions used throughout the Authyntic demo. Defining types in a
 * dedicated module helps keep the application consistent and reduces
 * duplicate interfaces across services and components.
 */

export interface MediaLocation {
  lat: number;
  lng: number;
  name: string;
}

export interface MediaStream {
  id: string;
  source: string;
  location: MediaLocation;
  status: 'active' | 'inactive' | 'error';
  authenticity: number; // score in percentage
  proofChain: string[];
}

export interface TrustNode {
  id: string;
  type: 'coordinator' | 'edge' | 'validator' | 'unknown';
  status: 'online' | 'offline';
  trust_score: number;
}

export interface TrustConnection {
  source: string;
  target: string;
  strength: number; // 0–1 indicating connection quality
}

export interface TrustNetwork {
  nodes: TrustNode[];
  connections: TrustConnection[];
}

export interface MerkleProof {
  timestamp: string;
  mediaHash: string;
  proof: string[];
  verified: boolean;
}