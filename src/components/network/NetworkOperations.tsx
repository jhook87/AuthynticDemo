import { useCallback, useEffect, useRef, useState } from 'react';
import { useOperatorStore } from '../../store';
import type { NetworkNode } from '../../types';
import { ROLE_COLORS } from '../../constants';
import { formatLatency, formatPercentage } from '../../utils/formatters';
import { demoInteractionService } from '../../services/demo/demoInteractionService';

const drawNetwork = (
  canvas: HTMLCanvasElement,
  nodes: NetworkNode[],
  leaderLabel: string,
  spotlightLeader: boolean,
  tick: number,
) => {
  const context = canvas.getContext('2d');
  if (!context) return;
  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);
  context.save();
  context.font = '12px Inter, system-ui';
  context.textAlign = 'center';
  context.setLineDash([6, 10]);
  context.lineWidth = 1.5;
  const dashOffset = (tick / 12) % 16;
  const baseRadius = Math.min(width, height) / 2.75;
  nodes.forEach((node, index) => {
    const angle = (index / nodes.length) * Math.PI * 2;
    const x = width / 2 + baseRadius * Math.cos(angle);
    const y = height / 2 + baseRadius * Math.sin(angle);
    node.connections.forEach((peerId) => {
      const peer = nodes.find((candidate) => candidate.id === peerId);
      if (!peer) return;
      const peerIndex = nodes.indexOf(peer);
      const peerAngle = (peerIndex / nodes.length) * Math.PI * 2;
      const peerX = width / 2 + baseRadius * Math.cos(peerAngle);
      const peerY = height / 2 + baseRadius * Math.sin(peerAngle);
      context.strokeStyle = 'rgba(94, 234, 212, 0.35)';
      context.lineDashOffset = dashOffset;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(peerX, peerY);
      context.stroke();
    });
  });

  nodes.forEach((node, index) => {
    const angle = (index / nodes.length) * Math.PI * 2;
    const x = width / 2 + baseRadius * Math.cos(angle);
    const y = height / 2 + baseRadius * Math.sin(angle);
    const isLeader = node.label === leaderLabel;
    const oscillation = Math.sin(tick / 420 + index) * 2;
    const leaderBoost = isLeader ? (spotlightLeader ? 6 : 4) : 0;
    const nodeRadius = 12 + oscillation + leaderBoost;
    context.fillStyle = ROLE_COLORS[node.role];
    context.shadowColor = isLeader ? 'rgba(56, 189, 248, 0.75)' : 'rgba(15, 118, 110, 0.55)';
    context.shadowBlur = isLeader ? 18 : 12;
    context.beginPath();
    context.arc(x, y, nodeRadius, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;
    context.fillStyle = '#e2e8f0';
    context.fillText(node.label, x, y + nodeRadius + 18);
  });
  context.restore();
};

export const NetworkOperations = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { nodes, consensus } = useOperatorStore((state) => ({
    nodes: state.networkNodes,
    consensus: state.consensus,
  }));
  const [leaderSpotlight, setLeaderSpotlight] = useState(false);
  const spotlightTimeout = useRef<number | null>(null);
  const animationFrame = useRef<number | null>(null);
  const clearSpotlightTimeout = useCallback(() => {
    if (spotlightTimeout.current !== null) {
      if (typeof window !== 'undefined') {
        window.clearTimeout(spotlightTimeout.current);
      }
      spotlightTimeout.current = null;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    if (typeof window === 'undefined') {
      drawNetwork(canvas, nodes, consensus.leader, leaderSpotlight, Date.now());
      return undefined;
    }

    const render = (time: number) => {
      drawNetwork(canvas, nodes, consensus.leader, leaderSpotlight, time);
      animationFrame.current = window.requestAnimationFrame(render);
    };

    animationFrame.current = window.requestAnimationFrame(render);
    return () => {
      if (animationFrame.current) {
        window.cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
    };
  }, [clearSpotlightTimeout, consensus.leader, leaderSpotlight, nodes]);

  useEffect(
    () =>
      demoInteractionService.on('network.highlightConsensus', () => {
        setLeaderSpotlight(true);
        clearSpotlightTimeout();
        if (typeof window !== 'undefined') {
          spotlightTimeout.current = window.setTimeout(() => {
            setLeaderSpotlight(false);
            clearSpotlightTimeout();
          }, 2400);
        }
      }),
    [clearSpotlightTimeout],
  );

  useEffect(
    () => () => {
      clearSpotlightTimeout();
      if (animationFrame.current) {
        if (typeof window !== 'undefined') {
          window.cancelAnimationFrame(animationFrame.current);
        }
        animationFrame.current = null;
      }
    },
    [clearSpotlightTimeout],
  );

  return (
    <section className="panel">
      <header className="network-header">
        <div>
          <h2>Network topology</h2>
          <p>Dynamic view of the current operator consortium.</p>
        </div>
        <div className={`consensus-meta${leaderSpotlight ? ' consensus-meta--highlight' : ''}`}>
          <span>Leader {consensus.leader}</span>
          <span>Algorithm {consensus.algorithm}</span>
          <span>Finality {consensus.finalitySeconds.toFixed(1)}s</span>
        </div>
      </header>
      <div className="network-visualization">
        <canvas ref={canvasRef} width={720} height={420} role="img" aria-label="Network topology visualization" />
      </div>
      <table className="network-table">
        <thead>
          <tr>
            <th>Node</th>
            <th>Role</th>
            <th>Status</th>
            <th>Latency</th>
            <th>Reputation</th>
            <th>Connections</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node) => (
            <tr key={node.id}>
              <td>{node.label}</td>
              <td>{node.role}</td>
              <td>{node.status}</td>
              <td>{formatLatency(node.latencyMs)}</td>
              <td>{formatPercentage(node.reputation * 100)}</td>
              <td>{node.connections.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
