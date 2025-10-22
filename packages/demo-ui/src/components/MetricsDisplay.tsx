import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ScenarioMetricSnapshot } from '@authyntic/demo-core';
import { authynticTheme } from '../theme/authynticTheme.js';

export interface MetricsDisplayProps {
  readonly history: readonly ScenarioMetricSnapshot[];
  readonly metricKey: string;
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ history, metricKey }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const data = history.map((snapshot) => ({
      timestamp: snapshot.timestamp,
      value: snapshot.metrics[metricKey] ?? 0,
    }));

    if (data.length === 0) {
      return;
    }

    const svg = d3.select(svgRef.current);
    const width = Number(svg.attr('width')) || 400;
    const height = Number(svg.attr('height')) || 160;

    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const contentWidth = width - margin.left - margin.right;
    const contentHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xExtent = d3.extent(data, (d) => d.timestamp) as [number, number];
    const x = d3
      .scaleLinear()
      .domain(xExtent[0] === xExtent[1] ? [xExtent[0], xExtent[0] + 1] : xExtent)
      .range([0, contentWidth]);

    const y = d3.scaleLinear().domain([0, 100]).range([contentHeight, 0]);

    const line = d3
      .line<{ timestamp: number; value: number }>()
      .x((d) => x(d.timestamp))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', authynticTheme.colors.secure)
      .attr('stroke-width', 2)
      .attr('d', line);

    g.append('g').attr('transform', `translate(0,${contentHeight})`).call(d3.axisBottom(x));
    g.append('g').call(d3.axisLeft(y));
  }, [history, metricKey]);

  return <svg ref={svgRef} width={400} height={160} role="presentation" />;
};
