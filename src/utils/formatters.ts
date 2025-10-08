export const formatTimestamp = (value: number): string =>
  new Date(value).toLocaleString();

export const formatPercentage = (value: number, digits = 1): string =>
  `${value.toFixed(digits)}%`;

export const formatLatency = (value: number): string => `${value.toFixed(0)} ms`;

export const formatScore = (value: number): string => `${value.toFixed(0)}/100`;

export const formatHash = (hash: string): string => `${hash.slice(0, 10)}…${hash.slice(-6)}`;
