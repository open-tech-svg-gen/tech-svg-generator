/**
 * Character definitions for cartoon strips
 * Each character has a unique appearance and can express emotions
 */

export type Emotion = 
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'thinking'
  | 'confused'
  | 'excited'
  | 'worried';

export interface CharacterStyle {
  /** Primary color (hair/hat) */
  primary: string;
  /** Secondary color (shirt/body) */
  secondary: string;
  /** Skin tone */
  skin: string;
  /** Hair style: 'short' | 'long' | 'bald' | 'spiky' | 'curly' */
  hairStyle: 'short' | 'long' | 'bald' | 'spiky' | 'curly';
  /** Accessory: 'none' | 'glasses' | 'hat' | 'headphones' */
  accessory: 'none' | 'glasses' | 'hat' | 'headphones';
}

export interface Character {
  id: string;
  name: string;
  style: CharacterStyle;
}

/**
 * Predefined character styles for consistency
 */
export const CHARACTER_PRESETS: Record<string, CharacterStyle> = {
  dev1: {
    primary: '#6366f1',  // indigo hair
    secondary: '#3b82f6', // blue shirt
    skin: '#fcd5b8',
    hairStyle: 'short',
    accessory: 'glasses',
  },
  dev2: {
    primary: '#8b5cf6',  // purple hair
    secondary: '#10b981', // green shirt
    skin: '#d4a574',
    hairStyle: 'curly',
    accessory: 'none',
  },
  dev3: {
    primary: '#f59e0b',  // orange/blonde hair
    secondary: '#ef4444', // red shirt
    skin: '#fce7d6',
    hairStyle: 'long',
    accessory: 'headphones',
  },
  dev4: {
    primary: '#1f2937',  // dark hair
    secondary: '#6366f1', // indigo shirt
    skin: '#8d6e4c',
    hairStyle: 'spiky',
    accessory: 'none',
  },
  dev5: {
    primary: '#ec4899',  // pink hair
    secondary: '#8b5cf6', // purple shirt
    skin: '#fcd5b8',
    hairStyle: 'short',
    accessory: 'hat',
  },
  robot: {
    primary: '#6b7280',  // gray
    secondary: '#3b82f6', // blue
    skin: '#d1d5db',
    hairStyle: 'bald',
    accessory: 'none',
  },
};

/**
 * Get emotion-specific eye and mouth paths
 */
function getEmotionFeatures(emotion: Emotion): { eyes: string; mouth: string; eyebrows: string } {
  const features: Record<Emotion, { eyes: string; mouth: string; eyebrows: string }> = {
    neutral: {
      eyes: 'M-6,-2 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0 M2,-2 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0',
      mouth: 'M-4,6 Q0,8 4,6',
      eyebrows: 'M-7,-6 L-3,-6 M3,-6 L7,-6',
    },
    happy: {
      eyes: 'M-6,-2 Q-4,-4 -2,-2 M2,-2 Q4,-4 6,-2',
      mouth: 'M-5,5 Q0,10 5,5',
      eyebrows: 'M-7,-7 L-3,-5 M3,-5 L7,-7',
    },
    sad: {
      eyes: 'M-6,-1 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0 M2,-1 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0',
      mouth: 'M-4,8 Q0,5 4,8',
      eyebrows: 'M-7,-5 L-3,-7 M3,-7 L7,-5',
    },
    angry: {
      eyes: 'M-6,-2 a1.5,1.5 0 1,0 3,0 a1.5,1.5 0 1,0 -3,0 M3,-2 a1.5,1.5 0 1,0 3,0 a1.5,1.5 0 1,0 -3,0',
      mouth: 'M-4,7 L0,5 L4,7',
      eyebrows: 'M-7,-4 L-3,-7 M3,-7 L7,-4',
    },
    surprised: {
      eyes: 'M-6,-2 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 M2,-2 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0',
      mouth: 'M-2,6 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0',
      eyebrows: 'M-7,-8 L-3,-8 M3,-8 L7,-8',
    },
    thinking: {
      eyes: 'M-6,-2 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0 M2,-1 L6,-3',
      mouth: 'M-3,7 Q2,7 4,5',
      eyebrows: 'M-7,-6 L-3,-6 M3,-7 L7,-5',
    },
    confused: {
      eyes: 'M-6,-2 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0 M2,-2 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0',
      mouth: 'M-3,6 Q0,8 3,6 Q4,5 5,6',
      eyebrows: 'M-7,-5 L-3,-7 M3,-6 L7,-6',
    },
    excited: {
      eyes: 'M-7,-2 L-5,0 L-3,-2 M3,-2 L5,0 L7,-2',
      mouth: 'M-5,4 Q0,11 5,4',
      eyebrows: 'M-7,-8 L-3,-6 M3,-6 L7,-8',
    },
    worried: {
      eyes: 'M-6,-1 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0 M2,-1 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0',
      mouth: 'M-4,7 Q0,6 4,7',
      eyebrows: 'M-7,-5 Q-5,-7 -3,-5 M3,-5 Q5,-7 7,-5',
    },
  };
  return features[emotion] || features.neutral;
}

/**
 * Render hair based on style
 */
function renderHair(style: CharacterStyle, scale: number): string {
  const s = scale;
  const color = style.primary;
  
  switch (style.hairStyle) {
    case 'short':
      return `<ellipse cx="0" cy="${-18*s}" rx="${14*s}" ry="${10*s}" fill="${color}"/>`;
    case 'long':
      return `<ellipse cx="0" cy="${-18*s}" rx="${14*s}" ry="${10*s}" fill="${color}"/>
              <path d="M${-14*s},${-12*s} Q${-16*s},${5*s} ${-10*s},${15*s}" stroke="${color}" stroke-width="${6*s}" fill="none" stroke-linecap="round"/>
              <path d="M${14*s},${-12*s} Q${16*s},${5*s} ${10*s},${15*s}" stroke="${color}" stroke-width="${6*s}" fill="none" stroke-linecap="round"/>`;
    case 'bald':
      return '';
    case 'spiky':
      return `<path d="M${-10*s},${-20*s} L${-8*s},${-30*s} L${-4*s},${-22*s} L0,${-32*s} L${4*s},${-22*s} L${8*s},${-30*s} L${10*s},${-20*s}" fill="${color}"/>`;
    case 'curly':
      return `<circle cx="${-8*s}" cy="${-22*s}" r="${6*s}" fill="${color}"/>
              <circle cx="0" cy="${-24*s}" r="${6*s}" fill="${color}"/>
              <circle cx="${8*s}" cy="${-22*s}" r="${6*s}" fill="${color}"/>
              <circle cx="${-12*s}" cy="${-16*s}" r="${5*s}" fill="${color}"/>
              <circle cx="${12*s}" cy="${-16*s}" r="${5*s}" fill="${color}"/>`;
    default:
      return `<ellipse cx="0" cy="${-18*s}" rx="${14*s}" ry="${10*s}" fill="${color}"/>`;
  }
}

/**
 * Render accessory
 */
function renderAccessory(style: CharacterStyle, scale: number): string {
  const s = scale;
  
  switch (style.accessory) {
    case 'glasses':
      return `<rect x="${-9*s}" y="${-6*s}" width="${8*s}" height="${6*s}" rx="${1*s}" fill="none" stroke="#374151" stroke-width="${1.5*s}"/>
              <rect x="${1*s}" y="${-6*s}" width="${8*s}" height="${6*s}" rx="${1*s}" fill="none" stroke="#374151" stroke-width="${1.5*s}"/>
              <line x1="${-1*s}" y1="${-3*s}" x2="${1*s}" y2="${-3*s}" stroke="#374151" stroke-width="${1.5*s}"/>`;
    case 'hat':
      return `<rect x="${-12*s}" y="${-28*s}" width="${24*s}" height="${4*s}" rx="${1*s}" fill="${style.primary}"/>
              <rect x="${-8*s}" y="${-38*s}" width="${16*s}" height="${12*s}" rx="${2*s}" fill="${style.primary}"/>`;
    case 'headphones':
      return `<path d="M${-14*s},${-8*s} Q${-16*s},${-25*s} 0,${-28*s} Q${16*s},${-25*s} ${14*s},${-8*s}" stroke="#374151" stroke-width="${3*s}" fill="none"/>
              <rect x="${-17*s}" y="${-12*s}" width="${6*s}" height="${10*s}" rx="${2*s}" fill="#374151"/>
              <rect x="${11*s}" y="${-12*s}" width="${6*s}" height="${10*s}" rx="${2*s}" fill="#374151"/>`;
    default:
      return '';
  }
}

/**
 * Render a character at position with emotion
 */
export function renderCharacter(
  x: number,
  y: number,
  character: Character,
  emotion: Emotion = 'neutral',
  scale: number = 1,
  facing: 'left' | 'right' = 'right'
): string {
  const s = scale;
  const style = character.style;
  const features = getEmotionFeatures(emotion);
  const flip = facing === 'left' ? -1 : 1;
  
  return `
  <g transform="translate(${x}, ${y}) scale(${flip * s}, ${s})">
    <!-- Body -->
    <rect x="${-15*s}" y="${20*s}" width="${30*s}" height="${35*s}" rx="${8*s}" fill="${style.secondary}"/>
    
    <!-- Head -->
    <circle cx="0" cy="0" r="${16*s}" fill="${style.skin}"/>
    
    <!-- Hair -->
    ${renderHair(style, s)}
    
    <!-- Face features -->
    <g transform="scale(${s})">
      <!-- Eyebrows -->
      <path d="${features.eyebrows}" stroke="#374151" stroke-width="2" fill="none" stroke-linecap="round"/>
      
      <!-- Eyes -->
      <path d="${features.eyes}" fill="#374151"/>
      
      <!-- Mouth -->
      <path d="${features.mouth}" stroke="#374151" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>
    
    <!-- Accessory -->
    ${renderAccessory(style, s)}
    
    <!-- Name tag -->
    <text x="0" y="${65*s}" text-anchor="middle" fill="#9ca3af" font-size="${10*s}" font-family="'SF Mono', monospace">${character.name}</text>
  </g>`;
}

/**
 * Create a character from preset or custom style
 */
export function createCharacter(
  id: string,
  name: string,
  presetOrStyle: string | CharacterStyle = 'dev1'
): Character {
  const style = typeof presetOrStyle === 'string' 
    ? CHARACTER_PRESETS[presetOrStyle] || CHARACTER_PRESETS.dev1
    : presetOrStyle;
    
  return { id, name, style };
}

/**
 * Get available character presets
 */
export function getCharacterPresets(): string[] {
  return Object.keys(CHARACTER_PRESETS);
}

/**
 * Get available emotions
 */
export function getEmotions(): Emotion[] {
  return ['neutral', 'happy', 'sad', 'angry', 'surprised', 'thinking', 'confused', 'excited', 'worried'];
}
