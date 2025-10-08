import { MediaStream, TrustNetwork, MerkleProof } from '../types/authyntic';

/**
 * A collection of static dummy data used to power the demo. In a real
 * application these values would be fetched from back‑end services or
 * computed at runtime. Here we provide enough variety to illustrate
 * typical usage scenarios without relying on external APIs.
 */

export const DUMMY_MEDIA_STREAMS: MediaStream[] = [
  {
    id: 'stream_001',
    source: 'Field Camera Alpha',
    location: { lat: 40.7128, lng: -74.0060, name: 'NYC Deployment' },
    status: 'active',
    authenticity: 98.5,
    proofChain: ['0x1a2b3c...', '0x4d5e6f...', '0x7g8h9i...'],
  },
  {
    id: 'stream_002',
    source: 'Drone Bravo',
    location: { lat: 34.0522, lng: -118.2437, name: 'LA Operation' },
    status: 'active',
    authenticity: 92.3,
    proofChain: ['0x2b3c4d...', '0x5e6f7g...', '0x8h9i0j...'],
  },
  {
    id: 'stream_003',
    source: 'Mobile Phone Charlie',
    location: { lat: 48.8566, lng: 2.3522, name: 'Paris Relay' },
    status: 'inactive',
    authenticity: 88.1,
    proofChain: ['0x3c4d5e...', '0x6f7g8h...', '0x9i0j1k...'],
  },
  {
    id: 'stream_004',
    source: 'Satellite Delta',
    location: { lat: 35.6895, lng: 139.6917, name: 'Tokyo Link' },
    status: 'active',
    authenticity: 97.9,
    proofChain: ['0x4d5e6f...', '0x7g8h9i...', '0x0j1k2l...'],
  },
  {
    id: 'stream_005',
    source: 'Bodycam Echo',
    location: { lat: 51.5074, lng: -0.1278, name: 'London Ops' },
    status: 'error',
    authenticity: 75.4,
    proofChain: ['0x5e6f7g...', '0x8h9i0j...', '0x1k2l3m...'],
  },
  {
    id: 'stream_006',
    source: 'Helmet Cam Foxtrot',
    location: { lat: 52.5200, lng: 13.4050, name: 'Berlin Watch' },
    status: 'active',
    authenticity: 91.0,
    proofChain: ['0x6f7g8h...', '0x9i0j1k...', '0x2l3m4n...'],
  },
  {
    id: 'stream_007',
    source: 'Dashcam Golf',
    location: { lat: -33.8688, lng: 151.2093, name: 'Sydney Patrol' },
    status: 'active',
    authenticity: 89.7,
    proofChain: ['0x7g8h9i...', '0x0j1k2l...', '0x3m4n5o...'],
  },
  {
    id: 'stream_008',
    source: 'Wearable Hotel',
    location: { lat: 55.7558, lng: 37.6173, name: 'Moscow Field' },
    status: 'inactive',
    authenticity: 83.2,
    proofChain: ['0x8h9i0j...', '0x1k2l3m...', '0x4n5o6p...'],
  },
  {
    id: 'stream_009',
    source: 'Handheld India',
    location: { lat: 28.6139, lng: 77.2090, name: 'Delhi Outpost' },
    status: 'active',
    authenticity: 94.8,
    proofChain: ['0x9i0j1k...', '0x2l3m4n...', '0x5o6p7q...'],
  },
  {
    id: 'stream_010',
    source: 'GoPro Juliet',
    location: { lat: -23.5505, lng: -46.6333, name: 'São Paulo Unit' },
    status: 'active',
    authenticity: 90.5,
    proofChain: ['0x0j1k2l...', '0x3m4n5o...', '0x6p7q8r...'],
  },
  {
    id: 'stream_011',
    source: 'Surveillance Kilo',
    location: { lat: 19.4326, lng: -99.1332, name: 'Mexico City Surveillance' },
    status: 'inactive',
    authenticity: 86.7,
    proofChain: ['0x1k2l3m...', '0x4n5o6p...', '0x7q8r9s...'],
  },
];

export const DUMMY_TRUST_NETWORK: TrustNetwork = {
  nodes: [
    { id: 'trust_node_1', type: 'coordinator', status: 'online', trust_score: 95.2 },
    { id: 'edge_device_1', type: 'edge', status: 'online', trust_score: 87.3 },
    { id: 'edge_device_2', type: 'edge', status: 'offline', trust_score: 72.1 },
    { id: 'validator_1', type: 'validator', status: 'online', trust_score: 90.5 },
    { id: 'edge_device_3', type: 'edge', status: 'online', trust_score: 80.4 },
    { id: 'edge_device_4', type: 'edge', status: 'online', trust_score: 78.9 },
  ],
  connections: [
    { source: 'trust_node_1', target: 'edge_device_1', strength: 0.9 },
    { source: 'trust_node_1', target: 'edge_device_2', strength: 0.6 },
    { source: 'trust_node_1', target: 'validator_1', strength: 0.8 },
    { source: 'validator_1', target: 'edge_device_3', strength: 0.7 },
    { source: 'validator_1', target: 'edge_device_4', strength: 0.85 },
    { source: 'edge_device_3', target: 'edge_device_4', strength: 0.5 },
  ],
};

export const DUMMY_MERKLE_PROOFS: MerkleProof[] = [
  {
    timestamp: new Date().toISOString(),
    mediaHash: '0x1a2b3c4d5e6f...',
    proof: ['0xabc123...', '0xdef456...'],
    verified: true,
  },
  {
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    mediaHash: '0x9f8e7d6c5b4a...',
    proof: ['0x123abc...', '0x456def...', '0x789012...'],
    verified: false,
  },
];