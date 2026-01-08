/**
 * Animation support for SVG illustrations
 * Add CSS animations and transitions to make SVGs come alive
 */

export type AnimationType = 
  | 'fadeIn'
  | 'slideIn'
  | 'pulse'
  | 'bounce'
  | 'shake'
  | 'glow'
  | 'typewriter'
  | 'draw'
  | 'float'
  | 'spin';

export interface AnimationConfig {
  /** Animation type */
  type: AnimationType;
  /** Duration in seconds */
  duration?: number;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Number of iterations (0 = infinite) */
  iterations?: number;
  /** Easing function */
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  /** Direction */
  direction?: 'normal' | 'reverse' | 'alternate';
}

/**
 * Generate CSS keyframes for animations
 */
export function getAnimationKeyframes(): string {
  return `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideInLeft {
      from { transform: translateX(-50px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideInRight {
      from { transform: translateX(50px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideInUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    
    @keyframes glow {
      0%, 100% { filter: drop-shadow(0 0 2px currentColor); }
      50% { filter: drop-shadow(0 0 10px currentColor); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes draw {
      to { stroke-dashoffset: 0; }
    }
    
    @keyframes typewriter {
      from { width: 0; }
      to { width: 100%; }
    }
  `;
}

/**
 * Generate animation CSS class
 */
export function getAnimationClass(config: AnimationConfig): string {
  const {
    type,
    duration = 0.5,
    delay = 0,
    iterations = 1,
    easing = 'ease-out',
    direction = 'normal',
  } = config;

  const iterationValue = iterations === 0 ? 'infinite' : iterations;
  
  let animationName: string = type;
  if (type === 'slideIn') {
    animationName = 'slideInUp';
  }

  return `animation: ${animationName} ${duration}s ${easing} ${delay}s ${iterationValue} ${direction};`;
}

/**
 * Wrap SVG content with animation styles
 */
export function addAnimations(
  svgContent: string,
  animations: { selector: string; config: AnimationConfig }[]
): string {
  if (animations.length === 0) return svgContent;

  const styles = animations.map(({ selector, config }) => {
    return `${selector} { ${getAnimationClass(config)} }`;
  }).join('\n    ');

  const styleBlock = `
  <style>
    ${getAnimationKeyframes()}
    ${styles}
  </style>`;

  // Insert style block after opening svg tag
  return svgContent.replace(/<svg([^>]*)>/, `<svg$1>${styleBlock}`);
}

/**
 * Create staggered animation delays for multiple elements
 */
export function staggeredAnimation(
  baseConfig: AnimationConfig,
  count: number,
  staggerDelay: number = 0.1
): AnimationConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    ...baseConfig,
    delay: (baseConfig.delay || 0) + i * staggerDelay,
  }));
}

/**
 * Preset animation configurations
 */
export const ANIMATION_PRESETS = {
  fadeInSequence: { type: 'fadeIn' as const, duration: 0.5, easing: 'ease-out' as const },
  gentlePulse: { type: 'pulse' as const, duration: 2, iterations: 0, easing: 'ease-in-out' as const },
  floatingElement: { type: 'float' as const, duration: 3, iterations: 0, easing: 'ease-in-out' as const },
  attentionShake: { type: 'shake' as const, duration: 0.5, iterations: 3 },
  glowingHighlight: { type: 'glow' as const, duration: 1.5, iterations: 0 },
  spinningLoader: { type: 'spin' as const, duration: 1, iterations: 0, easing: 'linear' as const },
  bounceIn: { type: 'bounce' as const, duration: 0.6, easing: 'ease-out' as const },
};
