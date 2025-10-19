export const formatTimestamp = (value: number): string =>
  new Date(value).toLocaleString();

export const formatPercentage = (value: number, digits = 1): string =>
  `${value.toFixed(digits)}%`;

export const formatLatency = (value: number): string => `${value.toFixed(0)} ms`;

export const formatScore = (value: number): string => `${value.toFixed(0)}/100`;

export const formatHash = (hash: string): string => `${hash.slice(0, 10)}…${hash.slice(-6)}`;

export const formatRelativeTime = (value: number): string => {
  const diff = Date.now() - value;
  const seconds = Math.max(1, Math.floor(diff / 1000));
  if (seconds < 60) {
    return `${seconds}s ago`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
