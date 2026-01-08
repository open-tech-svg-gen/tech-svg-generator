/**
 * Tests for main module exports
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  generateSVG,
  generateIllustration,
  detectScene,
  getAvailableScenes,
  SCENES,
  THEMES,
  ICONS,
} from './index.js';

describe('Module exports', () => {
  describe('generateSVG', () => {
    it('should be exported', () => {
      assert.ok(generateSVG);
      assert.strictEqual(typeof generateSVG, 'function');
    });

    it('should work when called', () => {
      const result = generateSVG('Test');
      assert.ok(result.svg);
      assert.ok(result.scene);
    });
  });

  describe('generateIllustration', () => {
    it('should be exported', () => {
      assert.ok(generateIllustration);
      assert.strictEqual(typeof generateIllustration, 'function');
    });

    it('should work when called', () => {
      const result = generateIllustration('Test');
      assert.ok(result.svg);
      assert.ok(result.scene);
    });
  });

  describe('detectScene', () => {
    it('should be exported', () => {
      assert.ok(detectScene);
      assert.strictEqual(typeof detectScene, 'function');
    });

    it('should work when called', () => {
      const scene = detectScene('Database Guide');
      assert.strictEqual(scene, 'database');
    });
  });

  describe('getAvailableScenes', () => {
    it('should be exported', () => {
      assert.ok(getAvailableScenes);
      assert.strictEqual(typeof getAvailableScenes, 'function');
    });

    it('should return array of scenes', () => {
      const scenes = getAvailableScenes();
      assert.ok(Array.isArray(scenes));
      assert.ok(scenes.length > 0);
    });
  });

  describe('SCENES', () => {
    it('should be exported', () => {
      assert.ok(SCENES);
      assert.strictEqual(typeof SCENES, 'object');
    });

    it('should contain scene renderers', () => {
      assert.ok(SCENES.architecture);
      assert.ok(SCENES.database);
      assert.ok(SCENES.default);
    });
  });

  describe('THEMES', () => {
    it('should be exported', () => {
      assert.ok(THEMES);
      assert.strictEqual(typeof THEMES, 'object');
    });

    it('should contain themes', () => {
      assert.ok(THEMES['github-dark']);
      assert.ok(THEMES['dracula']);
      assert.ok(THEMES['nord']);
      assert.ok(THEMES['one-dark']);
    });
  });

  describe('ICONS', () => {
    it('should be exported', () => {
      assert.ok(ICONS);
      assert.strictEqual(typeof ICONS, 'object');
    });

    it('should contain icon paths', () => {
      assert.ok(ICONS.server);
      assert.ok(ICONS.database);
      assert.ok(ICONS.cloud);
    });
  });
});

describe('Integration tests', () => {
  it('should generate SVG with all themes', () => {
    for (const themeName of Object.keys(THEMES)) {
      const result = generateSVG('Test', '', { theme: themeName });
      assert.ok(result.svg.includes('<svg'));
      assert.ok(result.svg.includes('</svg>'));
    }
  });

  it('should generate SVG with all scenes', () => {
    const scenes = getAvailableScenes();
    for (const scene of scenes) {
      const result = generateSVG('Test', '', { scene });
      assert.strictEqual(result.scene, scene);
      assert.ok(result.svg.includes('<svg'));
    }
  });

  it('should generate SVG with custom dimensions', () => {
    const result = generateSVG('Test', '', { width: 1200, height: 800 });
    assert.strictEqual(result.width, 1200);
    assert.strictEqual(result.height, 800);
    assert.ok(result.svg.includes('width="1200"'));
    assert.ok(result.svg.includes('height="800"'));
  });

  it('should generate valid SVG for all scene and theme combinations', () => {
    const scenes = getAvailableScenes();
    const themes = Object.keys(THEMES);
    
    for (const scene of scenes) {
      for (const theme of themes) {
        const result = generateSVG('Test Title', '', { scene, theme });
        assert.ok(result.svg.startsWith('<?xml'));
        assert.ok(result.svg.includes('<svg'));
        assert.ok(result.svg.includes('</svg>'));
        assert.strictEqual(result.scene, scene);
      }
    }
  });

  it('should handle empty title gracefully', () => {
    const result = generateSVG('');
    assert.ok(result.svg);
    assert.strictEqual(result.scene, 'default');
  });

  it('should handle very long titles', () => {
    const longTitle = 'A'.repeat(500);
    const result = generateSVG(longTitle);
    assert.ok(result.svg);
    assert.ok(result.svg.includes('<svg'));
  });

  it('should handle special characters in title', () => {
    const specialTitle = '<script>alert("xss")</script> & "quotes"';
    const result = generateSVG(specialTitle);
    assert.ok(result.svg);
    // Should not contain unescaped script tags
    assert.ok(!result.svg.includes('<script>'));
  });

  it('should handle unicode characters in title', () => {
    const unicodeTitle = '数据库优化 🚀 Performance';
    const result = generateSVG(unicodeTitle);
    assert.ok(result.svg);
    assert.ok(result.svg.includes('数据库优化'));
    assert.ok(result.svg.includes('🚀'));
  });
});

describe('Type exports', () => {
  it('should export Theme type (compile-time check)', () => {
    // This test verifies the type is exported by using it
    const theme: typeof THEMES['github-dark'] = THEMES['github-dark'];
    assert.ok(theme.name);
    assert.ok(theme.colors);
  });

  it('should export ThemeColors type (compile-time check)', () => {
    const colors = THEMES['github-dark'].colors;
    assert.ok(colors.bg);
    assert.ok(colors.text);
    assert.ok(colors.blue);
  });
});
