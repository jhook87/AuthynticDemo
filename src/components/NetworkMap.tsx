import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { TrustNetwork, TrustNode, TrustConnection } from '../types/authyntic';
import { getTrustNetwork } from '../services/mockTrustService';

interface NetworkMapProps {
  network?: TrustNetwork;
  width?: number;
  height?: number;
}

/**
 * NetworkMap renders an interactive force‑directed graph showing nodes and
 * connections between devices. Nodes are colored based on online/offline
 * status. Clicking a node displays its details below the graph. If no
 * network is provided it will fetch from the mock service on mount.
 */
const NetworkMap: React.FC<NetworkMapProps> = ({ network: propNetwork, width = 600, height = 400 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [network, setNetwork] = useState<TrustNetwork | null>(propNetwork ?? null);
  const [selectedNode, setSelectedNode] = useState<TrustNode | null>(null);

  useEffect(() => {
    if (!propNetwork) {
      getTrustNetwork().then(setNetwork);
    }
  }, [propNetwork]);

  useEffect(() => {
    if (!network || !svgRef.current) return;
    const nodes: any[] = network.nodes.map((n) => Object.assign({}, n));
    const links: any[] = network.connections.map((c) => ({ source: c.source, target: c.target, strength: c.strength }));

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const color = (node: TrustNode) => (node.status === 'online' ? '#00c853' : '#d50000');

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance((d: any) => 100 - d.strength * 50)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke-width', (d: any) => Math.max(1, d.strength * 4));

    // Draw nodes
    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 8)
      .attr('fill', (d: any) => color(d))
      .call(
        d3
          .drag<SVGCircleElement, any>()
          .on('start', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on('click', (_, d: any) => {
        // On click update selected node state
        setSelectedNode(d as TrustNode);
      });

    // Node labels
    const labels = svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text((d: any) => d.id)
      .attr('font-size', 10)
      .attr('dx', 12)
      .attr('dy', 4);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
      labels.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [network, width, height]);

  return (
    <div className="network-map">
      <svg ref={svgRef} width={width} height={height} style={{ border: '1px solid #ccc', borderRadius: '4px' }}></svg>
      {selectedNode && (
        <div className="node-info" style={{ marginTop: '0.5rem' }}>
          <strong>Selected Node:</strong> {selectedNode.id} ({selectedNode.type}) – status: {selectedNode.status}, trust score: {selectedNode.trust_score.toFixed(1)}
        </div>
      )}
    </div>
  );
};

export default NetworkMap;