/**
 * Sequence Diagram Generator
 * Create UML-style sequence diagrams for technical documentation
 */

import type { ThemeColors } from './themes.js';
import { getTheme } from './themes.js';
import { escapeHtml } from './primitives.js';

const FONT = "'SF Mono', Menlo, Monaco, 'Courier New', monospace";

export interface Participant {
  id: string;
  name: string;
  type?: 'actor' | 'service' | 'database' | 'queue' | 'external';
}

export interface Message {
  from: string;
  to: string;
  text: string;
  type?: 'sync' | 'async' | 'reply' | 'self';
  note?: string;
}

export interface SequenceDiagramConfig {
  title?: string;
  participants: Participant[];
  messages: Message[];
  theme?: string;
  width?: number;
  height?: number;
}

/**
 * Render participant box/icon
 */
function renderParticipant(
  p: Participant,
  x: number,
  y: number,
  colors: ThemeColors
): string {
  const type = p.type || 'service';
  const boxWidth = 100;
  const boxHeight = 50;
  
  let icon = '';
  let color = colors.blue;
  
  switch (type) {
    case 'actor':
      color = colors.cyan;
      // Stick figure
      icon = `
        <circle cx="${x}" cy="${y - 25}" r="10" fill="none" stroke="${color}" stroke-width="2"/>
        <line x1="${x}" y1="${y - 15}" x2="${x}" y2="${y + 5}" stroke="${color}" stroke-width="2"/>
        <line x1="${x - 15}" y1="${y - 8}" x2="${x + 15}" y2="${y - 8}" stroke="${color}" stroke-width="2"/>
        <line x1="${x}" y1="${y + 5}" x2="${x - 12}" y2="${y + 20}" stroke="${color}" stroke-width="2"/>
        <line x1="${x}" y1="${y + 5}" x2="${x + 12}" y2="${y + 20}" stroke="${color}" stroke-width="2"/>
      `;
      break;
    case 'database':
      color = colors.purple;
      icon = `
        <ellipse cx="${x}" cy="${y - 20}" rx="${boxWidth/2 - 10}" ry="8" fill="${colors.card}" stroke="${color}" stroke-width="2"/>
        <path d="M${x - boxWidth/2 + 10},${y - 20} L${x - boxWidth/2 + 10},${y + 10} Q${x},${y + 25} ${x + boxWidth/2 - 10},${y + 10} L${x + boxWidth/2 - 10},${y - 20}" fill="${colors.card}" stroke="${color}" stroke-width="2"/>
      `;
      break;
    case 'queue':
      color = colors.orange;
      icon = `
        <rect x="${x - boxWidth/2 + 5}" y="${y - 20}" width="${boxWidth - 10}" height="35" rx="4" fill="${colors.card}" stroke="${color}" stroke-width="2"/>
        <line x1="${x - 15}" y1="${y - 10}" x2="${x - 15}" y2="${y + 5}" stroke="${color}" stroke-width="1.5"/>
        <line x1="${x}" y1="${y - 10}" x2="${x}" y2="${y + 5}" stroke="${color}" stroke-width="1.5"/>
        <line x1="${x + 15}" y1="${y - 10}" x2="${x + 15}" y2="${y + 5}" stroke="${color}" stroke-width="1.5"/>
      `;
      break;
    case 'external':
      color = colors.muted;
      icon = `
        <rect x="${x - boxWidth/2 + 5}" y="${y - 25}" width="${boxWidth - 10}" height="${boxHeight}" rx="8" fill="${colors.card}" stroke="${color}" stroke-width="2" stroke-dasharray="5,3"/>
      `;
      break;
    default: // service
      icon = `
        <rect x="${x - boxWidth/2 + 5}" y="${y - 25}" width="${boxWidth - 10}" height="${boxHeight}" rx="8" fill="${colors.card}" stroke="${color}" stroke-width="2"/>
      `;
  }
  
  return `
    <g class="participant" data-id="${p.id}">
      ${icon}
      <text x="${x}" y="${y + 40}" text-anchor="middle" fill="${colors.text}" font-size="11" font-family="${FONT}" font-weight="500">${escapeHtml(p.name)}</text>
    </g>
  `;
}

/**
 * Render message arrow
 */
function renderMessage(
  msg: Message,
  fromX: number,
  toX: number,
  y: number,
  colors: ThemeColors,
  index: number
): string {
  const type = msg.type || 'sync';
  const isSelf = msg.from === msg.to || type === 'self';
  
  let color = colors.text;
  let dashArray = '';
  let arrowHead = 'arrow';
  
  switch (type) {
    case 'async':
      dashArray = 'stroke-dasharray="6,3"';
      color = colors.cyan;
      break;
    case 'reply':
      dashArray = 'stroke-dasharray="4,2"';
      color = colors.green;
      arrowHead = 'openArrow';
      break;
    case 'self':
      color = colors.orange;
      break;
  }
  
  const markerId = `${arrowHead}${index}`;
  
  if (isSelf) {
    // Self-call loop
    const loopWidth = 40;
    const loopHeight = 30;
    return `
      <defs>
        <marker id="${markerId}" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="${color}"/>
        </marker>
      </defs>
      <path d="M${fromX},${y} L${fromX + loopWidth},${y} L${fromX + loopWidth},${y + loopHeight} L${fromX + 5},${y + loopHeight}" 
            fill="none" stroke="${color}" stroke-width="2" ${dashArray} marker-end="url(#${markerId})"/>
      <rect x="${fromX + loopWidth + 5}" y="${y - 10}" width="${msg.text.length * 7 + 16}" height="20" rx="4" fill="${colors.card}"/>
      <text x="${fromX + loopWidth + 13}" y="${y + 4}" fill="${colors.text}" font-size="11" font-family="${FONT}">${escapeHtml(msg.text)}</text>
    `;
  }
  
  const direction = toX > fromX ? 1 : -1;
  const textX = (fromX + toX) / 2;
  const textWidth = msg.text.length * 7 + 16;
  
  let noteContent = '';
  if (msg.note) {
    const noteY = y + 20;
    noteContent = `
      <rect x="${textX - 60}" y="${noteY}" width="120" height="24" rx="4" fill="${colors.elevated}" stroke="${colors.border}"/>
      <text x="${textX}" y="${noteY + 16}" text-anchor="middle" fill="${colors.muted}" font-size="10" font-family="${FONT}" font-style="italic">${escapeHtml(msg.note.substring(0, 18))}</text>
    `;
  }
  
  return `
    <defs>
      <marker id="${markerId}" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
        ${arrowHead === 'openArrow' 
          ? `<path d="M0,0 L10,5 L0,10" fill="none" stroke="${color}" stroke-width="2"/>`
          : `<path d="M0,0 L10,5 L0,10 Z" fill="${color}"/>`
        }
      </marker>
    </defs>
    <line x1="${fromX}" y1="${y}" x2="${toX - direction * 10}" y2="${y}" stroke="${color}" stroke-width="2" ${dashArray} marker-end="url(#${markerId})"/>
    <rect x="${textX - textWidth/2}" y="${y - 18}" width="${textWidth}" height="20" rx="4" fill="${colors.card}"/>
    <text x="${textX}" y="${y - 4}" text-anchor="middle" fill="${colors.text}" font-size="11" font-family="${FONT}">${escapeHtml(msg.text)}</text>
    ${noteContent}
  `;
}

/**
 * Generate a sequence diagram SVG
 */
export function generateSequenceDiagram(config: SequenceDiagramConfig): string {
  const {
    title = '',
    participants,
    messages,
    theme: themeName,
    width = 800,
    height = 600,
  } = config;
  
  const theme = getTheme(themeName);
  const colors = theme.colors;
  
  // Calculate positions
  const participantSpacing = width / (participants.length + 1);
  const participantY = 80;
  const messageStartY = 160;
  const messageSpacing = 60;
  
  // Create participant position map
  const positions = new Map<string, number>();
  participants.forEach((p, i) => {
    positions.set(p.id, participantSpacing * (i + 1));
  });
  
  // Render participants
  const participantsSvg = participants.map((p, i) => {
    const x = participantSpacing * (i + 1);
    return renderParticipant(p, x, participantY, colors);
  }).join('');
  
  // Render lifelines
  const lifelineEndY = messageStartY + messages.length * messageSpacing + 40;
  const lifelinesSvg = participants.map((p, i) => {
    const x = participantSpacing * (i + 1);
    return `<line x1="${x}" y1="${participantY + 50}" x2="${x}" y2="${lifelineEndY}" stroke="${colors.border}" stroke-width="1" stroke-dasharray="4,4"/>`;
  }).join('');
  
  // Render messages
  const messagesSvg = messages.map((msg, i) => {
    const fromX = positions.get(msg.from) || 0;
    const toX = positions.get(msg.to) || fromX;
    const y = messageStartY + i * messageSpacing;
    return renderMessage(msg, fromX, toX, y, colors, i);
  }).join('');
  
  // Title
  const titleSvg = title 
    ? `<text x="${width/2}" y="35" text-anchor="middle" fill="${colors.text}" font-size="16" font-weight="bold" font-family="${FONT}">${escapeHtml(title)}</text>`
    : '';
  
  const actualHeight = Math.max(height, lifelineEndY + 40);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${actualHeight}" width="${width}" height="${actualHeight}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.bg}"/>
      <stop offset="100%" stop-color="${colors.card}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${actualHeight}" fill="url(#bg)"/>
  ${titleSvg}
  ${lifelinesSvg}
  ${participantsSvg}
  ${messagesSvg}
</svg>`;
}
