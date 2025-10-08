export const randomFloat = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export const randomInt = (min: number, max: number): number =>
  Math.floor(randomFloat(min, max + 1));

export const randomItem = <T>(items: readonly T[]): T =>
  items[randomInt(0, items.length - 1)];

export const randomId = (prefix: string): string =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
