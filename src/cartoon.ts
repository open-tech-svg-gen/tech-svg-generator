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
 * Render a WhatsApp-style message bubble - OPTIMIZED
 */
function whatsappMessage(
  x: number,
  y: number,
  text: string,
  colors: ThemeColors,
  isFromUser: boolean,
  maxWidth: number = 220
): string {
  // Word wrap text - more aggressive for compact bubbles
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  const charsPerLine = Math.floor(maxWidth / 6.2);
  
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= charsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  // Limit to 3 lines (more compact)
  if (lines.length > 3) {
    lines.length = 3;
    lines[2] = lines[2].substring(0, Math.max(charsPerLine - 3, 8)) + '...';
  }
  
  const lineHeight = 12;
  const paddingX = 10;
  const paddingY = 6;
  const bubbleWidth = Math.min(maxWidth, Math.max(...lines.map(l => l.length * 6.2)) + paddingX * 2);
  const bubbleHeight = lines.length * lineHeight + paddingY * 2;
  
  // WhatsApp colors
  const bgColor = isFromUser ? colors.orange : colors.card;
  const textColor = isFromUser ? '#fff' : colors.text;
  const borderColor = isFromUser ? colors.orange : colors.border;
  
  // Bubble position (right-aligned for user, left-aligned for other)
  const bubbleX = isFromUser ? x - bubbleWidth - 6 : x + 6;
  const bubbleY = y - bubbleHeight / 2;
  
  // Rounded rectangle
  const rx = 14;
  let bubblePath = `<rect x="${bubbleX}" y="${bubbleY}" width="${bubbleWidth}" height="${bubbleHeight}" rx="${rx}" fill="${bgColor}" stroke="${borderColor}" stroke-width="1"/>`;
  
  // Tail
  let tailPath = '';
  if (isFromUser) {
    // Right tail
    tailPath = `<polygon points="${bubbleX + bubbleWidth},${bubbleY + bubbleHeight - 6} ${bubbleX + bubbleWidth + 5},${bubbleY + bubbleHeight} ${bubbleX + bubbleWidth},${bubbleY + bubbleHeight}" fill="${bgColor}"/>`;
  } else {
    // Left tail
    tailPath = `<polygon points="${bubbleX},${bubbleY + bubbleHeight - 6} ${bubbleX - 5},${bubbleY + bubbleHeight} ${bubbleX},${bubbleY + bubbleHeight}" fill="${bgColor}"/>`;
  }
  
  // Text content
  const textContent = lines.map((line, i) => 
    `<text x="${bubbleX + bubbleWidth/2}" y="${bubbleY + paddingY + 2 + i * lineHeight}" text-anchor="middle" fill="${textColor}" font-size="10" font-family="${FONT}" font-weight="500">${escapeHtml(line)}</text>`
  ).join('');
  
  return `
    <g class="whatsapp-message">
      ${bubblePath}
      ${tailPath}
      ${textContent}
    </g>
  `;
}

/**
 * Render a speech bubble (legacy)
 */
function speechBubble(
  x: number,
  y: number,
  text: string,
  colors: ThemeColors,
  type: 'speech' | 'thought' | 'shout' = 'speech',
  tailDirection: 'left' | 'right' | 'down' = 'down',
  maxWidth: number = 140
): string {
  // Use WhatsApp style instead
  return whatsappMessage(x, y, text, colors, false, maxWidth);
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
 * Render a single panel - COMIC STYLE with speech bubbles above characters
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
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="6" fill="${colors.elevated}" stroke="${colors.border}" stroke-width="2"/>
  `;
  
  // Caption at top center
  if (panel.caption) {
    content += `<text x="${x + width/2}" y="${y + 14}" text-anchor="middle" fill="${colors.muted}" font-size="9" font-family="${FONT}" font-weight="bold">${escapeHtml(panel.caption)}</text>`;
  }
  
  const captionHeight = panel.caption ? 18 : 4;
  
  // Calculate character scale to fill panel nicely
  // Base character is ~170px tall, we want it to fill ~60% of panel height
  const availableHeight = height - captionHeight - 20;
  const targetCharHeight = availableHeight * 0.65;
  const charScale = Math.min(1.2, targetCharHeight / 170);
  
  // Position characters at bottom center of panel
  const charY = y + height - 30 - (85 * charScale); // 85 is bottom of character (name tag)
  const charSpacing = width / (charCount + 1);
  
  // Group dialogue by character
  const dialogueByChar = new Map<string, DialogLine[]>();
  panel.dialogue.forEach(line => {
    if (!dialogueByChar.has(line.character)) {
      dialogueByChar.set(line.character, []);
    }
    dialogueByChar.get(line.character)!.push(line);
  });
  
  // Render each character with their speech bubble above them
  panelChars.forEach((char, i) => {
    const charX = x + charSpacing * (i + 1);
    const facing = charCount > 1 ? (i < charCount / 2 ? 'right' : 'left') : 'right';
    
    // Get emotion from dialogue
    const charDialogue = dialogueByChar.get(char.id) || [];
    const emotion = charDialogue[0]?.emotion || 'neutral';
    
    // Render character
    content += renderCharacter(charX, charY, char, emotion, charScale, facing);
    
    // Render speech bubbles above this character
    const bubbleX = charX;
    const bubbleStartY = y + captionHeight + 15;
    const charTopY = charY - (36 * charScale); // Top of character head
    const availableBubbleSpace = charTopY - bubbleStartY - 20;
    const bubbleSpacing = Math.min(50, availableBubbleSpace / Math.max(charDialogue.length, 1));
    
    charDialogue.forEach((line, lineIdx) => {
      const bubbleY = bubbleStartY + lineIdx * bubbleSpacing;
      
      if (bubbleY < charTopY - 30) {
        content += renderSpeechBubble(
          bubbleX,
          bubbleY,
          line.text,
          colors,
          line.type || 'speech',
          Math.min(width * 0.45, 200)
        );
      }
    });
  });
  
  return content;
}

/**
 * Render a clean speech bubble positioned above character
 */
function renderSpeechBubble(
  x: number,
  y: number,
  text: string,
  colors: ThemeColors,
  type: 'speech' | 'thought' | 'shout' = 'speech',
  maxWidth: number = 180
): string {
  // Word wrap
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  const charsPerLine = Math.floor(maxWidth / 7.5);
  
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= charsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  if (lines.length > 3) {
    lines.length = 3;
    lines[2] = lines[2].substring(0, Math.max(charsPerLine - 3, 8)) + '...';
  }
  
  const lineHeight = 15;
  const paddingX = 12;
  const paddingY = 8;
  const bubbleWidth = Math.min(maxWidth, Math.max(...lines.map(l => l.length * 7.5)) + paddingX * 2);
  const bubbleHeight = lines.length * lineHeight + paddingY * 2;
  
  const bubbleX = x - bubbleWidth / 2;
  const bubbleY = y;
  
  let bgColor = colors.card;
  let borderColor = colors.border;
  let textColor = colors.text;
  
  if (type === 'shout') {
    bgColor = colors.orange;
    borderColor = colors.orange;
    textColor = '#fff';
  }
  
  // Bubble with tail pointing down
  const tailX = x;
  const tailY = bubbleY + bubbleHeight;
  
  const bubble = `
    <rect x="${bubbleX}" y="${bubbleY}" width="${bubbleWidth}" height="${bubbleHeight}" rx="10" fill="${bgColor}" stroke="${borderColor}" stroke-width="2"/>
    <polygon points="${tailX - 6},${tailY - 1} ${tailX + 6},${tailY - 1} ${tailX},${tailY + 10}" fill="${bgColor}" stroke="${borderColor}" stroke-width="2"/>
    <rect x="${tailX - 8}" y="${tailY - 3}" width="16" height="5" fill="${bgColor}"/>
  `;
  
  const textContent = lines.map((line, i) => 
    `<text x="${x}" y="${bubbleY + paddingY + 11 + i * lineHeight}" text-anchor="middle" fill="${textColor}" font-size="12" font-family="${FONT}" font-weight="600">${escapeHtml(line)}</text>`
  ).join('');
  
  return `<g class="speech-bubble">${bubble}${textContent}</g>`;
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
