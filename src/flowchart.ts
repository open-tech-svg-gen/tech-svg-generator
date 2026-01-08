/**
 * Flowchart Generator
 * Create flowcharts and decision trees programmatically
 */

import type { ThemeColors } from './themes.js';
import { getTheme } from './themes.js';
import { escapeHtml } from './primitives.js';

const FONT = "'SF Mono', Menlo, Monaco, 'Courier New', monospace";

export type NodeType = 'start' | 'end' | 'process' | 'decision' | 'io' | 'subprocess' | 'database' | 'delay';

export interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  sublabel?: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  type?: 'default' | 'yes' | 'no' | 'error';
}

export interface FlowchartConfig {
  title?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  direction?: 'TB' | 'LR'; // Top-Bottom or Left-Right
  theme?: string;
  width?: number;
  height?: number;
}

interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Render a flowchart node
 */
function renderNode(
  node: FlowNode,
  pos: NodePosition,
  colors: ThemeColors
): string {
  const { x, y, width, height } = pos;
  const cx = x + width / 2;
  const cy = y + height / 2;
  
  let shape = '';
  let color = colors.blue;
  
  switch (node.type) {
    case 'start':
      color = colors.green;
      shape = `<ellipse cx="${cx}" cy="${cy}" rx="${width/2}" ry="${height/2}" fill="${colors.card}" stroke="${color}" stroke-width="2"/>`;
      break;
    case 'end':
      color = colors.red;
      shape = `<ellipse cx="${cx}" cy="${cy}" rx="${width/2}" ry="${height/2}" fill="${colors.card}" stroke="${color}" stroke-width="3"/>`;
      break;
    case 'decision':
      color = colors.orange;
      shape = `<polygon points="${cx},${y} ${x + width},${cy} ${cx},${y + height} ${x},${cy}" fill="${colors.card}" stroke="${color}" stroke-width="2"/>`;
      break;
    case 'io':
      color = colors.cyan;
      const skew = 15;
      shape = `<polygon points="${x + skew},${y} ${x + width},${y} ${x + width - skew},${y + height} ${x},${y + height}" fill="${colors.card}" stroke="${color}" stroke-width="2"/>`;
      break;
    case 'subprocess':
      color = colors.purple;
      shape = `
        <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="4" fill="${colors.card}" stroke="${color}" stroke-width="2"/>
        <line x1="${x + 10}" y1="${y}" x2="${x + 10}" y2="${y + height}" stroke="${color}" stroke-width="1"/>
        <line x1="${x + width - 10}" y1="${y}" x2="${x + width - 10}" y2="${y + height}" stroke="${color}" stroke-width="1"/>
      `;
      break;
    case 'database':
      color = colors.purple;
      const ry = 8;
      shape = `
        <ellipse cx="${cx}" cy="${y + ry}" rx="${width/2}" ry="${ry}" fill="${colors.card}" stroke="${color}" stroke-width="2"/>
        <path d="M${x},${y + ry} L${x},${y + height - ry} Q${cx},${y + height + ry} ${x + width},${y + height - ry} L${x + width},${y + ry}" fill="${colors.card}" stroke="${color}" stroke-width="2"/>
      `;
      break;
    case 'delay':
      color = colors.muted;
      shape = `<path d="M${x},${y} L${x + width - 20},${y} Q${x + width},${cy} ${x + width - 20},${y + height} L${x},${y + height} Z" fill="${colors.card}" stroke="${color}" stroke-width="2"/>`;
      break;
    default: // process
      shape = `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="8" fill="${colors.card}" stroke="${color}" stroke-width="2"/>`;
  }
  
  const labelY = node.sublabel ? cy - 6 : cy + 4;
  const sublabelSvg = node.sublabel 
    ? `<text x="${cx}" y="${cy + 12}" text-anchor="middle" fill="${colors.muted}" font-size="10" font-family="${FONT}">${escapeHtml(node.sublabel.substring(0, 20))}</text>`
    : '';
  
  return `
    <g class="node" data-id="${node.id}">
      ${shape}
      <text x="${cx}" y="${labelY}" text-anchor="middle" fill="${colors.text}" font-size="11" font-family="${FONT}">${escapeHtml(node.label.substring(0, 15))}</text>
      ${sublabelSvg}
    </g>
  `;
}

/**
 * Calculate node positions using a simple layout algorithm
 */
function calculateLayout(
  nodes: FlowNode[],
  edges: FlowEdge[],
  direction: 'TB' | 'LR',
  width: number,
  height: number
): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  
  // Build adjacency list
  const children = new Map<string, string[]>();
  const parents = new Map<string, string[]>();
  
  nodes.forEach(n => {
    children.set(n.id, []);
    parents.set(n.id, []);
  });
  
  edges.forEach(e => {
    children.get(e.from)?.push(e.to);
    parents.get(e.to)?.push(e.from);
  });
  
  // Find root nodes (no parents)
  const roots = nodes.filter(n => (parents.get(n.id)?.length || 0) === 0);
  
  // BFS to assign levels
  const levels = new Map<string, number>();
  const queue = roots.map(r => ({ id: r.id, level: 0 }));
  const visited = new Set<string>();
  
  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    levels.set(id, level);
    
    children.get(id)?.forEach(childId => {
      if (!visited.has(childId)) {
        queue.push({ id: childId, level: level + 1 });
      }
    });
  }
  
  // Group nodes by level
  const levelGroups = new Map<number, string[]>();
  levels.forEach((level, id) => {
    if (!levelGroups.has(level)) levelGroups.set(level, []);
    levelGroups.get(level)!.push(id);
  });
  
  const maxLevel = Math.max(...Array.from(levels.values()), 0);
  const nodeWidth = direction === 'TB' ? 120 : 100;
  const nodeHeight = direction === 'TB' ? 50 : 60;
  const hSpacing = direction === 'TB' ? 40 : 60;
  const vSpacing = direction === 'TB' ? 80 : 40;
  
  // Position nodes
  levelGroups.forEach((nodeIds, level) => {
    const count = nodeIds.length;
    
    if (direction === 'TB') {
      const totalWidth = count * nodeWidth + (count - 1) * hSpacing;
      const startX = (width - totalWidth) / 2;
      const y = 80 + level * (nodeHeight + vSpacing);
      
      nodeIds.forEach((id, i) => {
        positions.set(id, {
          x: startX + i * (nodeWidth + hSpacing),
          y,
          width: nodeWidth,
          height: nodeHeight,
        });
      });
    } else {
      const totalHeight = count * nodeHeight + (count - 1) * vSpacing;
      const startY = (height - totalHeight) / 2;
      const x = 80 + level * (nodeWidth + hSpacing);
      
      nodeIds.forEach((id, i) => {
        positions.set(id, {
          x,
          y: startY + i * (nodeHeight + vSpacing),
          width: nodeWidth,
          height: nodeHeight,
        });
      });
    }
  });
  
  return positions;
}

/**
 * Render edge between nodes
 */
function renderEdge(
  edge: FlowEdge,
  fromPos: NodePosition,
  toPos: NodePosition,
  direction: 'TB' | 'LR',
  colors: ThemeColors,
  index: number
): string {
  let color = colors.muted;
  let dashArray = '';
  
  switch (edge.type) {
    case 'yes':
      color = colors.green;
      break;
    case 'no':
      color = colors.red;
      break;
    case 'error':
      color = colors.red;
      dashArray = 'stroke-dasharray="4,2"';
      break;
  }
  
  const markerId = `flowArrow${index}`;
  
  let x1: number, y1: number, x2: number, y2: number;
  
  if (direction === 'TB') {
    x1 = fromPos.x + fromPos.width / 2;
    y1 = fromPos.y + fromPos.height;
    x2 = toPos.x + toPos.width / 2;
    y2 = toPos.y;
  } else {
    x1 = fromPos.x + fromPos.width;
    y1 = fromPos.y + fromPos.height / 2;
    x2 = toPos.x;
    y2 = toPos.y + toPos.height / 2;
  }
  
  // Create curved path if not aligned
  let path: string;
  if (Math.abs(x1 - x2) < 5 || Math.abs(y1 - y2) < 5) {
    path = `M${x1},${y1} L${x2},${y2}`;
  } else {
    const midY = (y1 + y2) / 2;
    const midX = (x1 + x2) / 2;
    if (direction === 'TB') {
      path = `M${x1},${y1} L${x1},${midY} L${x2},${midY} L${x2},${y2}`;
    } else {
      path = `M${x1},${y1} L${midX},${y1} L${midX},${y2} L${x2},${y2}`;
    }
  }
  
  const labelSvg = edge.label ? `
    <rect x="${(x1 + x2) / 2 - 15}" y="${(y1 + y2) / 2 - 10}" width="30" height="16" rx="3" fill="${colors.card}"/>
    <text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 + 3}" text-anchor="middle" fill="${color}" font-size="10" font-family="${FONT}">${escapeHtml(edge.label)}</text>
  ` : '';
  
  return `
    <defs>
      <marker id="${markerId}" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="${color}"/>
      </marker>
    </defs>
    <path d="${path}" fill="none" stroke="${color}" stroke-width="2" ${dashArray} marker-end="url(#${markerId})"/>
    ${labelSvg}
  `;
}

/**
 * Generate a flowchart SVG
 */
export function generateFlowchart(config: FlowchartConfig): string {
  const {
    title = '',
    nodes,
    edges,
    direction = 'TB',
    theme: themeName,
    width = 800,
    height = 600,
  } = config;
  
  const theme = getTheme(themeName);
  const colors = theme.colors;
  
  const positions = calculateLayout(nodes, edges, direction, width, height);
  
  const edgesSvg = edges.map((edge, i) => {
    const fromPos = positions.get(edge.from);
    const toPos = positions.get(edge.to);
    if (!fromPos || !toPos) return '';
    return renderEdge(edge, fromPos, toPos, direction, colors, i);
  }).join('');
  
  const nodesSvg = nodes.map(node => {
    const pos = positions.get(node.id);
    if (!pos) return '';
    return renderNode(node, pos, colors);
  }).join('');
  
  const titleSvg = title 
    ? `<text x="${width/2}" y="35" text-anchor="middle" fill="${colors.text}" font-size="16" font-weight="bold" font-family="${FONT}">${escapeHtml(title)}</text>`
    : '';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.bg}"/>
      <stop offset="100%" stop-color="${colors.card}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  ${titleSvg}
  ${edgesSvg}
  ${nodesSvg}
</svg>`;
}
