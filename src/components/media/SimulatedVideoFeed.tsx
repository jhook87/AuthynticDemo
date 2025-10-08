import { useEffect, useState } from 'react';

type SimulatedVideoFeedProps = {
  frames: string[][];
  intervalMs?: number;
};

export const SimulatedVideoFeed = ({ frames, intervalMs = 600 }: SimulatedVideoFeedProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!frames.length || typeof window === 'undefined') return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % frames.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [frames, intervalMs]);

  const activeFrame = frames[index] ?? [];

  return (
    <pre className="simulated-video" aria-label="Simulated operations video feed">
      {activeFrame.join('\n')}
    </pre>
  );
};
