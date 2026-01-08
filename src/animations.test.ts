/**
 * Tests for Animation Support
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  getAnimationKeyframes,
  getAnimationClass,
  addAnimations,
  staggeredAnimation,
  ANIMATION_PRESETS
} from './animations.js';

describe('getAnimationKeyframes', () => {
  it('should return CSS keyframes string', () => {
    const keyframes = getAnimationKeyframes();
    assert.ok(typeof keyframes === 'string');
    assert.ok(keyframes.includes('@keyframes'));
  });

  it('should include fadeIn animation', () => {
    const keyframes = getAnimationKeyframes();
    assert.ok(keyframes.includes('@keyframes fadeIn'));
    assert.ok(keyframes.includes('opacity: 0'));
    assert.ok(keyframes.includes('opacity: 1'));
  });

  it('should include slideIn animations', () => {
    const keyframes = getAnimationKeyframes();
    assert.ok(keyframes.includes('@keyframes slideInLeft'));
    assert.ok(keyframes.includes('@keyframes slideInRight'));
    assert.ok(keyframes.includes('@keyframes slideInUp'));
  });

  it('should include pulse animation', () => {
    const keyframes = getAnimationKeyframes();
    assert.ok(keyframes.includes('@keyframes pulse'));
    assert.ok(keyframes.includes('scale(1)'));
    assert.ok(keyframes.includes('scale(1.05)'));
  });

  it('should include bounce animation', () => {
    const keyframes = getAnimationKeyframes();
    assert.ok(keyframes.includes('@keyframes bounce'));
    assert.ok(keyframes.includes('translateY'));
  });

  it('should include shake animation', () => {
    const keyframes = getAnimationKeyframes();
    assert.ok(keyframes.includes('@keyframes shake'));
    assert.ok(keyframes.includes('translateX'));
  });

  it('should include glow animation', () => {
    const keyframes = getAnimationKeyframes();
    assert.ok(keyframes.includes('@keyframes glow'));
    assert.ok(keyframes.includes('drop-shadow'));
  });

  it('should include float animation', () => {
    const keyframes = getAnimationKeyframes();
    assert.ok(keyframes.includes('@keyframes float'));
  });

  it('should include spin animation', () => {
    const keyframes = getAnimationKeyframes();
    assert.ok(keyframes.includes('@keyframes spin'));
    assert.ok(keyframes.includes('rotate(0deg)'));
    assert.ok(keyframes.includes('rotate(360deg)'));
  });

  it('should include draw animation', () => {
    const keyframes = getAnimationKeyframes();
    assert.ok(keyframes.includes('@keyframes draw'));
    assert.ok(keyframes.includes('stroke-dashoffset'));
  });

  it('should include typewriter animation', () => {
    const keyframes = getAnimationKeyframes();
    assert.ok(keyframes.includes('@keyframes typewriter'));
  });
});

describe('getAnimationClass', () => {
  it('should return animation CSS property', () => {
    const css = getAnimationClass({ type: 'fadeIn' });
    assert.ok(css.includes('animation:'));
    assert.ok(css.includes('fadeIn'));
  });

  it('should use default duration of 0.5s', () => {
    const css = getAnimationClass({ type: 'fadeIn' });
    assert.ok(css.includes('0.5s'));
  });

  it('should accept custom duration', () => {
    const css = getAnimationClass({ type: 'fadeIn', duration: 2 });
    assert.ok(css.includes('2s'));
  });

  it('should use default delay of 0', () => {
    const css = getAnimationClass({ type: 'fadeIn' });
    assert.ok(css.includes('0s'));
  });

  it('should accept custom delay', () => {
    const css = getAnimationClass({ type: 'fadeIn', delay: 0.5 });
    assert.ok(css.includes('0.5s'));
  });

  it('should use default iterations of 1', () => {
    const css = getAnimationClass({ type: 'fadeIn' });
    assert.ok(css.includes(' 1 '));
  });

  it('should accept infinite iterations', () => {
    const css = getAnimationClass({ type: 'pulse', iterations: 0 });
    assert.ok(css.includes('infinite'));
  });

  it('should accept custom iterations', () => {
    const css = getAnimationClass({ type: 'shake', iterations: 3 });
    assert.ok(css.includes(' 3 '));
  });

  it('should use default easing of ease-out', () => {
    const css = getAnimationClass({ type: 'fadeIn' });
    assert.ok(css.includes('ease-out'));
  });

  it('should accept custom easing', () => {
    const css = getAnimationClass({ type: 'spin', easing: 'linear' });
    assert.ok(css.includes('linear'));
  });

  it('should use default direction of normal', () => {
    const css = getAnimationClass({ type: 'fadeIn' });
    assert.ok(css.includes('normal'));
  });

  it('should accept alternate direction', () => {
    const css = getAnimationClass({ type: 'pulse', direction: 'alternate' });
    assert.ok(css.includes('alternate'));
  });

  it('should handle slideIn type', () => {
    const css = getAnimationClass({ type: 'slideIn' });
    assert.ok(css.includes('slideInUp'));
  });
});

describe('addAnimations', () => {
  const sampleSvg = '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"><rect class="box"/></svg>';

  it('should return original SVG if no animations', () => {
    const result = addAnimations(sampleSvg, []);
    assert.strictEqual(result, sampleSvg);
  });

  it('should add style block to SVG', () => {
    const result = addAnimations(sampleSvg, [
      { selector: '.box', config: { type: 'fadeIn' } }
    ]);
    assert.ok(result.includes('<style>'));
    assert.ok(result.includes('</style>'));
  });

  it('should include keyframes in style block', () => {
    const result = addAnimations(sampleSvg, [
      { selector: '.box', config: { type: 'fadeIn' } }
    ]);
    assert.ok(result.includes('@keyframes'));
  });

  it('should include selector with animation', () => {
    const result = addAnimations(sampleSvg, [
      { selector: '.box', config: { type: 'fadeIn' } }
    ]);
    assert.ok(result.includes('.box'));
    assert.ok(result.includes('animation:'));
  });

  it('should handle multiple animations', () => {
    const result = addAnimations(sampleSvg, [
      { selector: '.box', config: { type: 'fadeIn' } },
      { selector: '.circle', config: { type: 'pulse' } }
    ]);
    assert.ok(result.includes('.box'));
    assert.ok(result.includes('.circle'));
  });

  it('should preserve SVG structure', () => {
    const result = addAnimations(sampleSvg, [
      { selector: '.box', config: { type: 'fadeIn' } }
    ]);
    assert.ok(result.includes('<svg'));
    assert.ok(result.includes('</svg>'));
    assert.ok(result.includes('<rect'));
  });
});

describe('staggeredAnimation', () => {
  it('should return array of animation configs', () => {
    const configs = staggeredAnimation({ type: 'fadeIn' }, 3);
    assert.ok(Array.isArray(configs));
    assert.strictEqual(configs.length, 3);
  });

  it('should apply staggered delays', () => {
    const configs = staggeredAnimation({ type: 'fadeIn' }, 3, 0.1);
    assert.strictEqual(configs[0].delay, 0);
    assert.strictEqual(configs[1].delay, 0.1);
    assert.strictEqual(configs[2].delay, 0.2);
  });

  it('should preserve base config properties', () => {
    const configs = staggeredAnimation({ type: 'fadeIn', duration: 1 }, 2);
    assert.strictEqual(configs[0].type, 'fadeIn');
    assert.strictEqual(configs[0].duration, 1);
    assert.strictEqual(configs[1].type, 'fadeIn');
    assert.strictEqual(configs[1].duration, 1);
  });

  it('should add to existing delay', () => {
    const configs = staggeredAnimation({ type: 'fadeIn', delay: 0.5 }, 3, 0.1);
    assert.strictEqual(configs[0].delay, 0.5);
    assert.strictEqual(configs[1].delay, 0.6);
    assert.strictEqual(configs[2].delay, 0.7);
  });

  it('should use default stagger delay of 0.1', () => {
    const configs = staggeredAnimation({ type: 'fadeIn' }, 3);
    assert.strictEqual(configs[1].delay, 0.1);
    assert.strictEqual(configs[2].delay, 0.2);
  });

  it('should handle count of 1', () => {
    const configs = staggeredAnimation({ type: 'fadeIn' }, 1);
    assert.strictEqual(configs.length, 1);
    assert.strictEqual(configs[0].delay, 0);
  });

  it('should handle count of 0', () => {
    const configs = staggeredAnimation({ type: 'fadeIn' }, 0);
    assert.strictEqual(configs.length, 0);
  });
});

describe('ANIMATION_PRESETS', () => {
  it('should have fadeInSequence preset', () => {
    assert.ok(ANIMATION_PRESETS.fadeInSequence);
    assert.strictEqual(ANIMATION_PRESETS.fadeInSequence.type, 'fadeIn');
  });

  it('should have gentlePulse preset', () => {
    assert.ok(ANIMATION_PRESETS.gentlePulse);
    assert.strictEqual(ANIMATION_PRESETS.gentlePulse.type, 'pulse');
    assert.strictEqual(ANIMATION_PRESETS.gentlePulse.iterations, 0);
  });

  it('should have floatingElement preset', () => {
    assert.ok(ANIMATION_PRESETS.floatingElement);
    assert.strictEqual(ANIMATION_PRESETS.floatingElement.type, 'float');
    assert.strictEqual(ANIMATION_PRESETS.floatingElement.iterations, 0);
  });

  it('should have attentionShake preset', () => {
    assert.ok(ANIMATION_PRESETS.attentionShake);
    assert.strictEqual(ANIMATION_PRESETS.attentionShake.type, 'shake');
    assert.strictEqual(ANIMATION_PRESETS.attentionShake.iterations, 3);
  });

  it('should have glowingHighlight preset', () => {
    assert.ok(ANIMATION_PRESETS.glowingHighlight);
    assert.strictEqual(ANIMATION_PRESETS.glowingHighlight.type, 'glow');
    assert.strictEqual(ANIMATION_PRESETS.glowingHighlight.iterations, 0);
  });

  it('should have spinningLoader preset', () => {
    assert.ok(ANIMATION_PRESETS.spinningLoader);
    assert.strictEqual(ANIMATION_PRESETS.spinningLoader.type, 'spin');
    assert.strictEqual(ANIMATION_PRESETS.spinningLoader.easing, 'linear');
  });

  it('should have bounceIn preset', () => {
    assert.ok(ANIMATION_PRESETS.bounceIn);
    assert.strictEqual(ANIMATION_PRESETS.bounceIn.type, 'bounce');
  });

  it('presets should be usable with getAnimationClass', () => {
    Object.values(ANIMATION_PRESETS).forEach(preset => {
      const css = getAnimationClass(preset);
      assert.ok(css.includes('animation:'));
    });
  });
});

describe('Animation types', () => {
  const allTypes = ['fadeIn', 'slideIn', 'pulse', 'bounce', 'shake', 'glow', 'typewriter', 'draw', 'float', 'spin'] as const;

  allTypes.forEach(type => {
    it(`should handle ${type} animation type`, () => {
      const css = getAnimationClass({ type });
      assert.ok(css.includes('animation:'));
    });
  });
});

describe('Integration', () => {
  it('should work with real SVG content', () => {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect class="card" x="10" y="10" width="80" height="80"/>
  <circle class="dot" cx="50" cy="50" r="10"/>
</svg>`;

    const animated = addAnimations(svg, [
      { selector: '.card', config: { type: 'fadeIn', duration: 0.5 } },
      { selector: '.dot', config: { type: 'pulse', iterations: 0 } }
    ]);

    assert.ok(animated.includes('<style>'));
    assert.ok(animated.includes('.card'));
    assert.ok(animated.includes('.dot'));
    assert.ok(animated.includes('fadeIn'));
    assert.ok(animated.includes('pulse'));
    assert.ok(animated.includes('infinite'));
  });

  it('should create staggered fade-in effect', () => {
    const configs = staggeredAnimation(ANIMATION_PRESETS.fadeInSequence, 5, 0.15);
    
    assert.strictEqual(configs.length, 5);
    assert.strictEqual(configs[0].delay, 0);
    assert.strictEqual(configs[4].delay, 0.6);
    
    configs.forEach(config => {
      assert.strictEqual(config.type, 'fadeIn');
      assert.strictEqual(config.duration, 0.5);
    });
  });
});
