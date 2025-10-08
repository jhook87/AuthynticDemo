import type { TimestampRecord } from '../../types';
const CHAINS: TimestampRecord['anchorChain'][] = [
  'ethereum-testnet',
  'polygon-testnet',
  'solana-sim',
];

const randomHash = () =>
  Array.from({ length: 64 })
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');

export const anchorContent = (contentId: string): TimestampRecord => ({
  contentId,
  issuedAt: Date.now(),
  anchorChain: CHAINS[Math.floor(Math.random() * CHAINS.length)],
  transactionHash: `0x${randomHash()}`,
  confirmed: Math.random() > 0.2,
});

export const refreshConfirmation = (record: TimestampRecord): TimestampRecord => ({
  ...record,
  confirmed: true,
});
