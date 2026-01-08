/**
 * Cartoon strip generator with characters and speech bubbles
 */

import type { ThemeColors } from './themes.js';
import { getTheme } from './themes.js';
import { renderCharacter, createCharacter, type Character, type Emotion } from './characters.js';
import { escapeHtml } from './primitives.js';

const FONT = "'SF Mono', Menlo, Monaco, 'Courier New', monospace";

export interface DialogLine {
  /** Character ID speaking */
  character: string;
  /** The dialogue text */
  text: string;
  /** Emotion for this line */
  emotion?: Emotion;
  /** Type of speech bubble */
  type?: 'speech' | 'thought' | 'shout';
}

export interface CartoonPanel {
  /** Characters in this panel (by ID) */
  characters: string[];
  /** Dialogue lines in order */
  dialogue: DialogLine[];
  /** Optional panel title/caption */
  caption?: string;
}

export interface CartoonStripConfig {
  /** Title of the strip */
  title?: string;
  /** Character definitions */
  characters: Record<string, { name: string; preset?: string; style?: any }>;
  /** Panels in the strip */
  panels: CartoonPanel[];
  /** Grid layout: 'auto' | '1x2' | '2x1' | '2x2' | '1x3' | '3x1' | '2x3' | '3x2' */
  layout?: string;
  /** Theme name */
  theme?: string;
  /** Total width */
  width?: number;
  /** Total height */
  height?: number;
}

/**
 * Render a speech bubble
 */
function speechBubble(
  x: number,
  y: number,
  text: string,
  colors: ThemeColors,
  type: 'speech' | 'thought' | 'shout' = 'speech',
  tailDirection: 'left' | 'right' | 'down' = 'down',
  maxWidth: number = 180
): string {
  // Word wrap text
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  const charsPerLine = Math.floor(maxWidth / 7);
  
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= charsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  // Limit lines
  if (lines.length > 4) {
    lines.length = 4;
    lines[3] = lines[3].substring(0, charsPerLine - 3) + '...';
  }
  
  const lineHeight = 16;
  const padding = 12;
  const bubbleWidth = Math.min(maxWidth, Math.max(...lines.map(l => l.length * 7)) + padding * 2);
  const bubbleHeight = lines.length * lineHeight + padding * 2;
  
  let bubblePath: string;
  let tailPath: string;
  
  if (type === 'thought') {
    // Thought bubble with cloud shape
    bubblePath = `
      <ellipse cx="${x}" cy="${y}" rx="${bubbleWidth/2}" ry="${bubbleHeight/2}" fill="${colors.card}" stroke="${colors.border}" stroke-width="2"/>
    `;
    const tailX = tailDirection === 'left' ? x - bubbleWidth/2 - 5 : tailDirection === 'right' ? x + bubbleWidth/2 + 5 : x;
    const tailY = y + bubbleHeight/2 + 10;
    tailPath = `
      <circle cx="${tailX}" cy="${tailY}" r="6" fill="${colors.card}" stroke="${colors.border}" stroke-width="2"/>
      <circle cx="${tailX + (tailDirection === 'left' ? -8 : tailDirection === 'right' ? 8 : 0)}" cy="${tailY + 12}" r="4" fill="${colors.card}" stroke="${colors.border}" stroke-width="2"/>
    `;
  } else if (type === 'shout') {
    // Spiky shout bubble
    const spikes = 8;
    const innerR = Math.min(bubbleWidth, bubbleHeight) / 2;
    const outerR = innerR * 1.3;
    let points = '';
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes;
      const r = i % 2 === 0 ? outerR : innerR;
      const px = x + r * Math.cos(angle - Math.PI/2);
      const py = y + r * Math.sin(angle - Math.PI/2) * (bubbleHeight/bubbleWidth);
      points += `${px},${py} `;
    }
    bubblePath = `<polygon points="${points.trim()}" fill="${colors.card}" stroke="${colors.orange}" stroke-width="2"/>`;
    tailPath = '';
  } else {
    // Regular speech bubble
    const rx = 12;
    bubblePath = `<rect x="${x - bubbleWidth/2}" y="${y - bubbleHeight/2}" width="${bubbleWidth}" height="${bubbleHeight}" rx="${rx}" fill="${colors.card}" stroke="${colors.border}" stroke-width="2"/>`;
    
    // Tail pointing to speaker
    const tailSize = 12;
    let tx: number, ty: number, t1x: number, t1y: number, t2x: number, t2y: number;
    
    if (tailDirection === 'left') {
      tx = x - bubbleWidth/2 - tailSize;
      ty = y + bubbleHeight/4;
      t1x = x - bubbleWidth/2;
      t1y = y;
      t2x = x - bubbleWidth/2;
      t2y = y + bubbleHeight/4;
    } else if (tailDirection === 'right') {
      tx = x + bubbleWidth/2 + tailSize;
      ty = y + bubbleHeight/4;
      t1x = x + bubbleWidth/2;
      t1y = y;
      t2x = x + bubbleWidth/2;
      t2y = y + bubbleHeight/4;
    } else {
      tx = x;
      ty = y + bubbleHeight/2 + tailSize;
      t1x = x - 8;
      t1y = y + bubbleHeight/2;
      t2x = x + 8;
      t2y = y + bubbleHeight/2;
    }
    tailPath = `<polygon points="${t1x},${t1y} ${tx},${ty} ${t2x},${t2y}" fill="${colors.card}" stroke="${colors.border}" stroke-width="2"/>
                <line x1="${t1x}" y1="${t1y}" x2="${t2x}" y2="${t2y}" stroke="${colors.card}" stroke-width="4"/>`;
  }
  
  const textContent = lines.map((line, i) => 
    `<text x="${x}" y="${y - (lines.length - 1) * lineHeight/2 + i * lineHeight + 5}" text-anchor="middle" fill="${colors.text}" font-size="12" font-family="${FONT}">${escapeHtml(line)}</text>`
  ).join('');
  
  return `
    <g class="speech-bubble">
      ${bubblePath}
      ${tailPath}
      ${textContent}
    </g>
  `;
}

/**
 * Calculate grid layout dimensions
 */
function calculateLayout(
  panelCount: number,
  layout: string,
  totalWidth: number,
  totalHeight: number
): { cols: number; rows: number; panelWidth: number; panelHeight: number } {
  let cols: number, rows: number;
  
  if (layout === 'auto') {
    if (panelCount <= 2) {
      cols = panelCount;
      rows = 1;
    } else if (panelCount <= 4) {
      cols = 2;
      rows = Math.ceil(panelCount / 2);
    } else if (panelCount <= 6) {
      cols = 3;
      rows = Math.ceil(panelCount / 3);
    } else {
      cols = 4;
      rows = Math.ceil(panelCount / 4);
    }
  } else {
    const match = layout.match(/(\d+)x(\d+)/);
    if (match) {
      cols = parseInt(match[1]);
      rows = parseInt(match[2]);
    } else {
      cols = 2;
      rows = Math.ceil(panelCount / 2);
    }
  }
  
  const gap = 10;
  const panelWidth = (totalWidth - gap * (cols + 1)) / cols;
  const panelHeight = (totalHeight - gap * (rows + 1) - 40) / rows; // 40 for title
  
  return { cols, rows, panelWidth, panelHeight };
}

/**
 * Render a single panel
 */
function renderPanel(
  panel: CartoonPanel,
  characters: Map<string, Character>,
  x: number,
  y: number,
  width: number,
  height: number,
  colors: ThemeColors,
  panelIndex: number
): string {
  const panelChars = panel.characters.map(id => characters.get(id)).filter(Boolean) as Character[];
  const charCount = panelChars.length;
  
  // Panel background
  let content = `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="8" fill="${colors.elevated}" stroke="${colors.border}" stroke-width="2"/>
  `;
  
  // Caption if present
  if (panel.caption) {
    content += `<text x="${x + width/2}" y="${y + 18}" text-anchor="middle" fill="${colors.muted}" font-size="10" font-family="${FONT}">${escapeHtml(panel.caption)}</text>`;
  }
  
  // Position characters - adjusted for new larger character design
  const charY = y + height - 100;
  const charSpacing = width / (charCount + 1);
  const charScale = Math.min(0.7, (height - 150) / 180); // Scale based on panel height
  
  panelChars.forEach((char, i) => {
    const charX = x + charSpacing * (i + 1);
    const facing = i < charCount / 2 ? 'right' : 'left';
    
    // Find emotion for this character in dialogue
    const charDialogue = panel.dialogue.find(d => d.character === char.id);
    const emotion = charDialogue?.emotion || 'neutral';
    
    content += renderCharacter(charX, charY, char, emotion, charScale, facing);
  });
  
  // Render dialogue bubbles - positioned above characters
  const dialogueStartY = y + (panel.caption ? 35 : 20);
  const dialogueEndY = charY - 60 * charScale;
  const bubbleSpacing = Math.min(70, (dialogueEndY - dialogueStartY) / Math.max(panel.dialogue.length, 1));
  
  panel.dialogue.forEach((line, i) => {
    const charIndex = panelChars.findIndex(c => c.id === line.character);
    if (charIndex === -1) return;
    
    const charX = x + charSpacing * (charIndex + 1);
    const bubbleX = charX;
    const bubbleY = dialogueStartY + 25 + i * bubbleSpacing;
    
    content += speechBubble(
      bubbleX,
      bubbleY,
      line.text,
      colors,
      line.type || 'speech',
      'down',
      width * 0.65
    );
  });
  
  return content;
}

/**
 * Generate a cartoon strip SVG
 */
export function generateCartoonStrip(config: CartoonStripConfig): string {
  const {
    title = '',
    characters: charDefs,
    panels,
    layout = 'auto',
    theme: themeName,
    width = 800,
    height = 600,
  } = config;
  
  const theme = getTheme(themeName);
  const colors = theme.colors;
  
  // Create character instances
  const characters = new Map<string, Character>();
  for (const [id, def] of Object.entries(charDefs)) {
    characters.set(id, createCharacter(id, def.name, def.preset || def.style || 'dev1'));
  }
  
  // Calculate layout
  const { cols, rows, panelWidth, panelHeight } = calculateLayout(panels.length, layout, width, height);
  const gap = 10;
  
  // Build SVG
  let content = '';
  
  // Title
  if (title) {
    content += `<text x="${width/2}" y="28" text-anchor="middle" fill="${colors.text}" font-size="16" font-weight="bold" font-family="${FONT}">${escapeHtml(title)}</text>`;
  }
  
  // Render panels
  panels.forEach((panel, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const px = gap + col * (panelWidth + gap);
    const py = (title ? 45 : gap) + row * (panelHeight + gap);
    
    content += renderPanel(panel, characters, px, py, panelWidth, panelHeight, colors, i);
  });
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.bg}"/>
      <stop offset="100%" stop-color="${colors.card}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  ${content}
</svg>`;
}

export { speechBubble };
