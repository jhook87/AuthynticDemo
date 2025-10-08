export const minutesAgo = (minutes: number): number =>
  Date.now() - minutes * 60_000;

export const hoursFromNow = (hours: number): number =>
  Date.now() + hours * 60 * 60_000;
