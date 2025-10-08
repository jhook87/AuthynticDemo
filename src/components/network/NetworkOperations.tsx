import { useEffect, useRef } from 'react';
import { useOperatorStore } from '../../store';
import type { NetworkNode } from '../../types';
import { ROLE_COLORS } from '../../constants';
import { formatLatency, formatPercentage } from '../../utils/formatters';

const drawNetwork = (canvas: HTMLCanvasElement, nodes: NetworkNode[]) => {
  const context = canvas.getContext('2d');
  if (!context) return;
  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);
  context.font = '12px Inter, system-ui';
  context.textAlign = 'center';
  nodes.forEach((node, index) => {
    const angle = (index / nodes.length) * Math.PI * 2;
    const radius = Math.min(width, height) / 2.6;
    const x = width / 2 + radius * Math.cos(angle);
    const y = height / 2 + radius * Math.sin(angle);
    context.fillStyle = ROLE_COLORS[node.role];
    context.beginPath();
    context.arc(x, y, 14, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#e2e8f0';
    context.fillText(node.label, x, y + 24);
    node.connections.forEach((peerId) => {
      const peer = nodes.find((candidate) => candidate.id === peerId);
      if (!peer) return;
      const peerIndex = nodes.indexOf(peer);
      const peerAngle = (peerIndex / nodes.length) * Math.PI * 2;
      const peerX = width / 2 + radius * Math.cos(peerAngle);
      const peerY = height / 2 + radius * Math.sin(peerAngle);
      context.strokeStyle = 'rgba(94, 234, 212, 0.25)';
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(peerX, peerY);
      context.stroke();
    });
  });
};

export const NetworkOperations = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { nodes, consensus } = useOperatorStore((state) => ({
    nodes: state.networkNodes,
    consensus: state.consensus,
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawNetwork(canvas, nodes);
  }, [nodes]);

  return (
    <section className="panel">
      <header className="network-header">
        <div>
          <h2>Network topology</h2>
          <p>Dynamic view of the current operator consortium.</p>
        </div>
        <div className="consensus-meta">
          <span>Leader {consensus.leader}</span>
          <span>Algorithm {consensus.algorithm}</span>
          <span>Finality {consensus.finalitySeconds.toFixed(1)}s</span>
        </div>
      </header>
      <canvas ref={canvasRef} width={720} height={420} role="img" aria-label="Network topology visualization" />
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
