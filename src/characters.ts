/**
 * Character definitions for cartoon strips
 * Improved cartoon-style characters with better proportions and expressions
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
  /** Primary color (hair) */
  primary: string;
  /** Secondary color (shirt/clothing) */
  secondary: string;
  /** Skin tone */
  skin: string;
  /** Hair style */
  hairStyle: 'short' | 'long' | 'bald' | 'spiky' | 'curly' | 'ponytail' | 'mohawk';
  /** Accessory */
  accessory: 'none' | 'glasses' | 'sunglasses' | 'hat' | 'headphones' | 'beanie';
  /** Eye color */
  eyeColor: string;
  /** Shirt style */
  shirtStyle: 'tshirt' | 'hoodie' | 'formal' | 'tank';
}

export interface Character {
  id: string;
  name: string;
  style: CharacterStyle;
}

/**
 * Predefined character styles - diverse and visually distinct
 */
export const CHARACTER_PRESETS: Record<string, CharacterStyle> = {
  alex: {
    primary: '#4f46e5',    // Indigo hair
    secondary: '#3b82f6',  // Blue hoodie
    skin: '#fcd5b8',
    hairStyle: 'short',
    accessory: 'glasses',
    eyeColor: '#1e40af',
    shirtStyle: 'hoodie',
  },
  sam: {
    primary: '#7c3aed',    // Purple curly hair
    secondary: '#10b981',  // Green shirt
    skin: '#d4a574',
    hairStyle: 'curly',
    accessory: 'none',
    eyeColor: '#065f46',
    shirtStyle: 'tshirt',
  },
  jordan: {
    primary: '#f59e0b',    // Blonde/orange long hair
    secondary: '#ef4444',  // Red shirt
    skin: '#fce7d6',
    hairStyle: 'long',
    accessory: 'headphones',
    eyeColor: '#92400e',
    shirtStyle: 'tshirt',
  },
  casey: {
    primary: '#1f2937',    // Dark spiky hair
    secondary: '#8b5cf6',  // Purple hoodie
    skin: '#8d6e4c',
    hairStyle: 'spiky',
    accessory: 'none',
    eyeColor: '#1f2937',
    shirtStyle: 'hoodie',
  },
  riley: {
    primary: '#ec4899',    // Pink hair
    secondary: '#6366f1',  // Indigo shirt
    skin: '#fcd5b8',
    hairStyle: 'ponytail',
    accessory: 'none',
    eyeColor: '#be185d',
    shirtStyle: 'tshirt',
  },
  morgan: {
    primary: '#059669',    // Teal/green hair
    secondary: '#f97316',  // Orange hoodie
    skin: '#e0c8a8',
    hairStyle: 'mohawk',
    accessory: 'sunglasses',
    eyeColor: '#047857',
    shirtStyle: 'hoodie',
  },
  taylor: {
    primary: '#dc2626',    // Red hair
    secondary: '#1f2937',  // Dark formal
    skin: '#fce7d6',
    hairStyle: 'short',
    accessory: 'none',
    eyeColor: '#166534',
    shirtStyle: 'formal',
  },
  robot: {
    primary: '#6b7280',    // Gray metallic
    secondary: '#3b82f6',  // Blue accents
    skin: '#d1d5db',
    hairStyle: 'bald',
    accessory: 'none',
    eyeColor: '#3b82f6',
    shirtStyle: 'tshirt',
  },
};

// Legacy aliases for backward compatibility
CHARACTER_PRESETS.dev1 = CHARACTER_PRESETS.alex;
CHARACTER_PRESETS.dev2 = CHARACTER_PRESETS.sam;
CHARACTER_PRESETS.dev3 = CHARACTER_PRESETS.jordan;
CHARACTER_PRESETS.dev4 = CHARACTER_PRESETS.casey;
CHARACTER_PRESETS.dev5 = CHARACTER_PRESETS.riley;

/**
 * Get facial features based on emotion
 */
function getFace(emotion: Emotion, eyeColor: string): { leftEye: string; rightEye: string; mouth: string; extras: string } {
  const pupil = eyeColor;
  
  const faces: Record<Emotion, { leftEye: string; rightEye: string; mouth: string; extras: string }> = {
    neutral: {
      leftEye: `<ellipse cx="-8" cy="-2" rx="5" ry="6" fill="white" stroke="#374151" stroke-width="1.5"/>
                <circle cx="-8" cy="-1" r="3" fill="${pupil}"/>
                <circle cx="-7" cy="-2" r="1" fill="white"/>`,
      rightEye: `<ellipse cx="8" cy="-2" rx="5" ry="6" fill="white" stroke="#374151" stroke-width="1.5"/>
                 <circle cx="8" cy="-1" r="3" fill="${pupil}"/>
                 <circle cx="9" cy="-2" r="1" fill="white"/>`,
      mouth: `<path d="M-6,10 Q0,14 6,10" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round"/>`,
      extras: '',
    },
    happy: {
      leftEye: `<path d="M-13,-2 Q-8,-6 -3,-2" fill="none" stroke="#374151" stroke-width="2.5" stroke-linecap="round"/>`,
      rightEye: `<path d="M3,-2 Q8,-6 13,-2" fill="none" stroke="#374151" stroke-width="2.5" stroke-linecap="round"/>`,
      mouth: `<path d="M-8,8 Q0,18 8,8" fill="#374151" stroke="#374151" stroke-width="2"/>
              <path d="M-6,10 Q0,8 6,10" fill="#fca5a5" stroke="none"/>`,
      extras: `<path d="M-18,2 L-14,0 M-18,-2 L-14,0" stroke="#f472b6" stroke-width="1.5" stroke-linecap="round"/>
               <path d="M18,2 L14,0 M18,-2 L14,0" stroke="#f472b6" stroke-width="1.5" stroke-linecap="round"/>`,
    },
    sad: {
      leftEye: `<ellipse cx="-8" cy="0" rx="5" ry="5" fill="white" stroke="#374151" stroke-width="1.5"/>
                <circle cx="-8" cy="1" r="3" fill="${pupil}"/>
                <ellipse cx="-8" cy="-4" rx="6" ry="2" fill="none" stroke="#374151" stroke-width="1.5"/>`,
      rightEye: `<ellipse cx="8" cy="0" rx="5" ry="5" fill="white" stroke="#374151" stroke-width="1.5"/>
                 <circle cx="8" cy="1" r="3" fill="${pupil}"/>
                 <ellipse cx="8" cy="-4" rx="6" ry="2" fill="none" stroke="#374151" stroke-width="1.5"/>`,
      mouth: `<path d="M-6,14 Q0,10 6,14" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round"/>`,
      extras: `<path d="M-5,6 Q-6,12 -8,16" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>`,
    },
    angry: {
      leftEye: `<ellipse cx="-8" cy="0" rx="4" ry="5" fill="white" stroke="#374151" stroke-width="1.5"/>
                <circle cx="-8" cy="1" r="2.5" fill="${pupil}"/>
                <path d="M-14,-6 L-3,-3" fill="none" stroke="#374151" stroke-width="2.5" stroke-linecap="round"/>`,
      rightEye: `<ellipse cx="8" cy="0" rx="4" ry="5" fill="white" stroke="#374151" stroke-width="1.5"/>
                 <circle cx="8" cy="1" r="2.5" fill="${pupil}"/>
                 <path d="M3,-3 L14,-6" fill="none" stroke="#374151" stroke-width="2.5" stroke-linecap="round"/>`,
      mouth: `<path d="M-8,12 L0,10 L8,12" fill="none" stroke="#374151" stroke-width="2.5" stroke-linecap="round"/>`,
      extras: `<path d="M-2,-18 L0,-22 L2,-18" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
               <path d="M-6,-16 L-7,-20" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>
               <path d="M6,-16 L7,-20" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>`,
    },
    surprised: {
      leftEye: `<ellipse cx="-8" cy="-1" rx="6" ry="8" fill="white" stroke="#374151" stroke-width="1.5"/>
                <circle cx="-8" cy="0" r="4" fill="${pupil}"/>
                <circle cx="-6" cy="-2" r="1.5" fill="white"/>`,
      rightEye: `<ellipse cx="8" cy="-1" rx="6" ry="8" fill="white" stroke="#374151" stroke-width="1.5"/>
                 <circle cx="8" cy="0" r="4" fill="${pupil}"/>
                 <circle cx="10" cy="-2" r="1.5" fill="white"/>`,
      mouth: `<ellipse cx="0" cy="13" rx="5" ry="6" fill="#374151"/>
              <ellipse cx="0" cy="12" rx="3" ry="4" fill="#fca5a5"/>`,
      extras: `<path d="M-14,-10 L-14,-14" stroke="#374151" stroke-width="2" stroke-linecap="round"/>
               <path d="M14,-10 L14,-14" stroke="#374151" stroke-width="2" stroke-linecap="round"/>`,
    },
    thinking: {
      leftEye: `<ellipse cx="-8" cy="-2" rx="5" ry="6" fill="white" stroke="#374151" stroke-width="1.5"/>
                <circle cx="-6" cy="-1" r="3" fill="${pupil}"/>
                <circle cx="-5" cy="-2" r="1" fill="white"/>`,
      rightEye: `<ellipse cx="8" cy="-2" rx="5" ry="6" fill="white" stroke="#374151" stroke-width="1.5"/>
                 <circle cx="10" cy="-3" r="3" fill="${pupil}"/>
                 <circle cx="11" cy="-4" r="1" fill="white"/>`,
      mouth: `<path d="M-4,12 Q2,12 5,10" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round"/>`,
      extras: `<circle cx="20" cy="-15" r="3" fill="none" stroke="#9ca3af" stroke-width="1.5"/>
               <circle cx="25" cy="-20" r="4" fill="none" stroke="#9ca3af" stroke-width="1.5"/>
               <circle cx="32" cy="-24" r="5" fill="none" stroke="#9ca3af" stroke-width="1.5"/>`,
    },
    confused: {
      leftEye: `<ellipse cx="-8" cy="-2" rx="5" ry="6" fill="white" stroke="#374151" stroke-width="1.5"/>
                <circle cx="-8" cy="-1" r="3" fill="${pupil}"/>
                <path d="M-13,-7 L-3,-5" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round"/>`,
      rightEye: `<ellipse cx="8" cy="0" rx="5" ry="6" fill="white" stroke="#374151" stroke-width="1.5"/>
                 <circle cx="8" cy="1" r="3" fill="${pupil}"/>
                 <path d="M3,-3 L13,-5" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round"/>`,
      mouth: `<path d="M-5,12 Q-2,10 0,12 Q2,14 5,12" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round"/>`,
      extras: `<text x="18" y="-12" font-size="16" fill="#9ca3af" font-family="sans-serif">?</text>`,
    },
    excited: {
      leftEye: `<path d="M-12,-2 L-8,2 L-4,-2" fill="none" stroke="#374151" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`,
      rightEye: `<path d="M4,-2 L8,2 L12,-2" fill="none" stroke="#374151" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`,
      mouth: `<path d="M-10,8 Q0,22 10,8" fill="#374151"/>
              <path d="M-7,12 Q0,10 7,12" fill="#fca5a5"/>`,
      extras: `<path d="M-20,-5 L-16,-3 M-20,-8 L-15,-7" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
               <path d="M20,-5 L16,-3 M20,-8 L15,-7" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
               <circle cx="-15" cy="5" r="4" fill="#fca5a5" opacity="0.5"/>
               <circle cx="15" cy="5" r="4" fill="#fca5a5" opacity="0.5"/>`,
    },
    worried: {
      leftEye: `<ellipse cx="-8" cy="0" rx="5" ry="6" fill="white" stroke="#374151" stroke-width="1.5"/>
                <circle cx="-8" cy="2" r="3" fill="${pupil}"/>
                <path d="M-13,-5 Q-8,-8 -3,-5" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round"/>`,
      rightEye: `<ellipse cx="8" cy="0" rx="5" ry="6" fill="white" stroke="#374151" stroke-width="1.5"/>
                 <circle cx="8" cy="2" r="3" fill="${pupil}"/>
                 <path d="M3,-5 Q8,-8 13,-5" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round"/>`,
      mouth: `<path d="M-6,13 Q0,11 6,13" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round"/>`,
      extras: `<path d="M-12,6 L-10,4 L-8,6" stroke="#60a5fa" stroke-width="1.5" fill="none"/>
               <path d="M12,6 L10,4 L8,6" stroke="#60a5fa" stroke-width="1.5" fill="none"/>`,
    },
  };
  
  return faces[emotion] || faces.neutral;
}

/**
 * Render hair based on style - improved designs
 */
function renderHair(style: CharacterStyle, skinColor: string): string {
  const c = style.primary;
  
  switch (style.hairStyle) {
    case 'short':
      return `
        <ellipse cx="0" cy="-22" rx="22" ry="14" fill="${c}"/>
        <path d="M-20,-10 Q-22,-20 -18,-28 Q-10,-35 0,-36 Q10,-35 18,-28 Q22,-20 20,-10" fill="${c}"/>
        <path d="M-15,-30 Q-10,-34 0,-35 Q10,-34 15,-30" fill="${c}" stroke="${c}" stroke-width="3"/>
      `;
    case 'long':
      return `
        <ellipse cx="0" cy="-22" rx="22" ry="14" fill="${c}"/>
        <path d="M-22,-8 Q-26,15 -20,40 Q-18,45 -15,40 Q-18,20 -20,-5" fill="${c}"/>
        <path d="M22,-8 Q26,15 20,40 Q18,45 15,40 Q18,20 20,-5" fill="${c}"/>
        <path d="M-18,-28 Q0,-38 18,-28" fill="${c}"/>
        <path d="M-8,-32 Q0,-36 8,-32" fill="${c}" stroke="${c}" stroke-width="4"/>
      `;
    case 'bald':
      return `<ellipse cx="0" cy="-24" rx="20" ry="12" fill="${skinColor}" opacity="0.3"/>`;
    case 'spiky':
      return `
        <path d="M-18,-20 L-22,-38 L-12,-28 L-8,-42 L-2,-28 L4,-45 L8,-28 L14,-40 L18,-28 L22,-36 L20,-20" fill="${c}"/>
        <ellipse cx="0" cy="-20" rx="20" ry="10" fill="${c}"/>
      `;
    case 'curly':
      return `
        <circle cx="-14" cy="-28" r="8" fill="${c}"/>
        <circle cx="-4" cy="-32" r="9" fill="${c}"/>
        <circle cx="8" cy="-30" r="8" fill="${c}"/>
        <circle cx="16" cy="-24" r="7" fill="${c}"/>
        <circle cx="-18" cy="-20" r="7" fill="${c}"/>
        <circle cx="0" cy="-26" r="10" fill="${c}"/>
        <circle cx="-20" cy="-12" r="6" fill="${c}"/>
        <circle cx="20" cy="-14" r="6" fill="${c}"/>
      `;
    case 'ponytail':
      return `
        <ellipse cx="0" cy="-22" rx="21" ry="13" fill="${c}"/>
        <path d="M-18,-28 Q0,-38 18,-28" fill="${c}"/>
        <ellipse cx="0" cy="-32" rx="8" ry="5" fill="${c}"/>
        <path d="M0,-36 Q15,-38 20,-30 Q28,-25 25,-10 Q24,0 20,10" fill="${c}" stroke="${c}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="0" cy="-38" r="5" fill="${style.secondary}"/>
      `;
    case 'mohawk':
      return `
        <path d="M-6,-25 L-4,-50 L0,-42 L4,-52 L6,-25" fill="${c}"/>
        <ellipse cx="0" cy="-22" rx="18" ry="8" fill="${skinColor}"/>
        <path d="M-16,-18 Q-18,-22 -14,-26 Q-8,-30 0,-30 Q8,-30 14,-26 Q18,-22 16,-18" fill="${skinColor}"/>
      `;
    default:
      return `<ellipse cx="0" cy="-22" rx="22" ry="14" fill="${c}"/>`;
  }
}

/**
 * Render accessory - improved designs
 */
function renderAccessory(style: CharacterStyle): string {
  switch (style.accessory) {
    case 'glasses':
      return `
        <rect x="-14" y="-6" width="12" height="10" rx="2" fill="none" stroke="#374151" stroke-width="2"/>
        <rect x="2" y="-6" width="12" height="10" rx="2" fill="none" stroke="#374151" stroke-width="2"/>
        <path d="M-2,-1 L2,-1" stroke="#374151" stroke-width="2"/>
        <path d="M-14,-1 L-18,-3" stroke="#374151" stroke-width="2"/>
        <path d="M14,-1 L18,-3" stroke="#374151" stroke-width="2"/>
      `;
    case 'sunglasses':
      return `
        <path d="M-16,-4 L-14,-6 L-2,-6 L-2,4 L-14,4 L-16,-4" fill="#1f2937" stroke="#374151" stroke-width="1.5"/>
        <path d="M16,-4 L14,-6 L2,-6 L2,4 L14,4 L16,-4" fill="#1f2937" stroke="#374151" stroke-width="1.5"/>
        <path d="M-2,-2 L2,-2" stroke="#374151" stroke-width="2"/>
        <path d="M-16,-2 L-20,-4" stroke="#374151" stroke-width="2"/>
        <path d="M16,-2 L20,-4" stroke="#374151" stroke-width="2"/>
        <path d="M-12,-4 L-6,-2" stroke="#60a5fa" stroke-width="1" opacity="0.5"/>
        <path d="M4,-4 L10,-2" stroke="#60a5fa" stroke-width="1" opacity="0.5"/>
      `;
    case 'hat':
      return `
        <ellipse cx="0" cy="-32" rx="26" ry="6" fill="${style.primary}"/>
        <path d="M-18,-32 L-18,-48 Q-18,-56 0,-56 Q18,-56 18,-48 L18,-32" fill="${style.primary}"/>
        <rect x="-18" y="-38" width="36" height="4" fill="${style.secondary}"/>
      `;
    case 'headphones':
      return `
        <path d="M-22,-8 Q-26,-30 0,-34 Q26,-30 22,-8" stroke="#374151" stroke-width="4" fill="none"/>
        <rect x="-28" y="-14" width="10" height="16" rx="3" fill="#374151"/>
        <rect x="18" y="-14" width="10" height="16" rx="3" fill="#374151"/>
        <rect x="-26" y="-12" width="6" height="12" rx="2" fill="#1f2937"/>
        <rect x="20" y="-12" width="6" height="12" rx="2" fill="#1f2937"/>
      `;
    case 'beanie':
      return `
        <path d="M-20,-18 Q-22,-32 0,-36 Q22,-32 20,-18" fill="${style.secondary}"/>
        <path d="M-20,-18 L20,-18" stroke="${style.secondary}" stroke-width="6"/>
        <circle cx="0" cy="-38" r="5" fill="${style.secondary}"/>
        <path d="M-18,-22 L18,-22" stroke="${style.primary}" stroke-width="2" opacity="0.5"/>
        <path d="M-16,-26 L16,-26" stroke="${style.primary}" stroke-width="2" opacity="0.5"/>
      `;
    default:
      return '';
  }
}

/**
 * Render body/clothing - improved designs
 */
function renderBody(style: CharacterStyle): string {
  const c = style.secondary;
  
  switch (style.shirtStyle) {
    case 'hoodie':
      return `
        <path d="M-24,25 Q-28,30 -30,50 L-30,70 L30,70 L30,50 Q28,30 24,25" fill="${c}"/>
        <path d="M-24,25 Q-20,35 0,38 Q20,35 24,25" fill="${c}" stroke="${c}" stroke-width="2"/>
        <path d="M-8,28 Q0,32 8,28" fill="none" stroke="${style.skin}" stroke-width="3"/>
        <ellipse cx="0" cy="50" rx="12" ry="8" fill="${c}" stroke="${darken(c, 20)}" stroke-width="1"/>
        <path d="M-6,46 L-6,54 M6,46 L6,54" stroke="${darken(c, 20)}" stroke-width="1"/>
      `;
    case 'formal':
      return `
        <path d="M-24,25 L-28,70 L28,70 L24,25" fill="${c}"/>
        <path d="M-24,25 Q-15,30 0,32 Q15,30 24,25" fill="white"/>
        <path d="M0,32 L0,70" stroke="${darken(c, 30)}" stroke-width="1"/>
        <path d="M-3,35 L0,32 L3,35" fill="${style.primary}"/>
        <circle cx="-2" cy="45" r="2" fill="${darken(c, 30)}"/>
        <circle cx="-2" cy="55" r="2" fill="${darken(c, 30)}"/>
        <path d="M-24,25 L-20,28 L-16,25" fill="${c}"/>
        <path d="M24,25 L20,28 L16,25" fill="${c}"/>
      `;
    case 'tank':
      return `
        <path d="M-16,25 L-18,70 L18,70 L16,25" fill="${c}"/>
        <path d="M-16,25 Q0,30 16,25" fill="${c}"/>
        <ellipse cx="0" cy="28" rx="10" ry="4" fill="${style.skin}"/>
      `;
    case 'tshirt':
    default:
      return `
        <path d="M-22,25 Q-26,35 -28,50 L-28,70 L28,70 L28,50 Q26,35 22,25" fill="${c}"/>
        <path d="M-22,25 Q-12,32 0,34 Q12,32 22,25" fill="${c}"/>
        <ellipse cx="0" cy="30" rx="8" ry="4" fill="${style.skin}"/>
      `;
  }
}

/**
 * Darken a hex color
 */
function darken(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
  const B = Math.max((num & 0x0000FF) - amt, 0);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

/**
 * Render a character at position with emotion - completely redesigned
 */
export function renderCharacter(
  x: number,
  y: number,
  character: Character,
  emotion: Emotion = 'neutral',
  scale: number = 1,
  facing: 'left' | 'right' = 'right'
): string {
  const style = character.style;
  const face = getFace(emotion, style.eyeColor);
  const flip = facing === 'left' ? -1 : 1;
  
  return `
  <g transform="translate(${x}, ${y}) scale(${flip * scale}, ${scale})">
    <!-- Shadow -->
    <ellipse cx="0" cy="72" rx="20" ry="5" fill="#000" opacity="0.1"/>
    
    <!-- Body -->
    ${renderBody(style)}
    
    <!-- Neck -->
    <rect x="-8" y="18" width="16" height="12" fill="${style.skin}"/>
    
    <!-- Head shape -->
    <ellipse cx="0" cy="0" rx="24" ry="26" fill="${style.skin}"/>
    
    <!-- Ears -->
    <ellipse cx="-23" cy="0" rx="5" ry="7" fill="${style.skin}"/>
    <ellipse cx="23" cy="0" rx="5" ry="7" fill="${style.skin}"/>
    <ellipse cx="-23" cy="0" rx="3" ry="4" fill="${darken(style.skin, 10)}"/>
    <ellipse cx="23" cy="0" rx="3" ry="4" fill="${darken(style.skin, 10)}"/>
    
    <!-- Hair (back layer for some styles) -->
    ${style.hairStyle === 'long' || style.hairStyle === 'ponytail' ? `<path d="M-22,0 Q-24,20 -20,35" fill="${style.primary}" stroke="${style.primary}" stroke-width="6"/>
    <path d="M22,0 Q24,20 20,35" fill="${style.primary}" stroke="${style.primary}" stroke-width="6"/>` : ''}
    
    <!-- Hair -->
    ${renderHair(style, style.skin)}
    
    <!-- Face -->
    <g class="face">
      ${face.leftEye}
      ${face.rightEye}
      
      <!-- Nose -->
      <path d="M0,2 Q2,6 0,8" fill="none" stroke="${darken(style.skin, 15)}" stroke-width="1.5" stroke-linecap="round"/>
      
      ${face.mouth}
      ${face.extras}
    </g>
    
    <!-- Accessory -->
    ${renderAccessory(style)}
    
    <!-- Name tag -->
    <text x="0" y="85" text-anchor="middle" fill="#9ca3af" font-size="11" font-family="'SF Mono', Menlo, monospace" font-weight="500">${character.name}</text>
  </g>`;
}

/**
 * Create a character from preset or custom style
 */
export function createCharacter(
  id: string,
  name: string,
  presetOrStyle: string | CharacterStyle = 'alex'
): Character {
  const style = typeof presetOrStyle === 'string' 
    ? CHARACTER_PRESETS[presetOrStyle] || CHARACTER_PRESETS.alex
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
