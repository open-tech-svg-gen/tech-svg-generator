/**
 * Tests for theme definitions and utilities
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { THEMES, getTheme, type Theme, type ThemeColors } from './themes.js';

describe('THEMES', () => {
  it('should have github-dark theme', () => {
    assert.ok(THEMES['github-dark']);
    assert.strictEqual(THEMES['github-dark'].name, 'github-dark');
  });

  it('should have dracula theme', () => {
    assert.ok(THEMES['dracula']);
    assert.strictEqual(THEMES['dracula'].name, 'dracula');
  });

  it('should have nord theme', () => {
    assert.ok(THEMES['nord']);
    assert.strictEqual(THEMES['nord'].name, 'nord');
  });

  it('should have one-dark theme', () => {
    assert.ok(THEMES['one-dark']);
    assert.strictEqual(THEMES['one-dark'].name, 'one-dark');
  });

  it('should have exactly 4 themes', () => {
    assert.strictEqual(Object.keys(THEMES).length, 4);
  });
});

describe('Theme structure', () => {
  const requiredColorKeys: (keyof ThemeColors)[] = [
    'bg', 'card', 'elevated', 'border', 'text', 'muted', 'dim',
    'blue', 'purple', 'green', 'cyan', 'orange', 'red', 'pink'
  ];

  for (const [themeName, theme] of Object.entries(THEMES)) {
    describe(`${themeName} theme`, () => {
      it('should have a name property', () => {
        assert.ok(theme.name);
        assert.strictEqual(typeof theme.name, 'string');
      });

      it('should have a colors object', () => {
        assert.ok(theme.colors);
        assert.strictEqual(typeof theme.colors, 'object');
      });

      for (const colorKey of requiredColorKeys) {
        it(`should have ${colorKey} color`, () => {
          assert.ok(theme.colors[colorKey], `Missing ${colorKey} in ${themeName}`);
          assert.strictEqual(typeof theme.colors[colorKey], 'string');
        });

        it(`${colorKey} should be a valid hex color`, () => {
          const color = theme.colors[colorKey];
          assert.ok(/^#[0-9a-fA-F]{6}$/.test(color), `Invalid hex color: ${color}`);
        });
      }
    });
  }
});

describe('getTheme', () => {
  it('should return github-dark theme by default when no name provided', () => {
    const theme = getTheme();
    assert.strictEqual(theme.name, 'github-dark');
  });

  it('should return github-dark theme when undefined is passed', () => {
    const theme = getTheme(undefined);
    assert.strictEqual(theme.name, 'github-dark');
  });

  it('should return github-dark theme when empty string is passed', () => {
    const theme = getTheme('');
    assert.strictEqual(theme.name, 'github-dark');
  });

  it('should return github-dark theme for unknown theme name', () => {
    const theme = getTheme('nonexistent-theme');
    assert.strictEqual(theme.name, 'github-dark');
  });

  it('should return dracula theme when requested', () => {
    const theme = getTheme('dracula');
    assert.strictEqual(theme.name, 'dracula');
  });

  it('should return nord theme when requested', () => {
    const theme = getTheme('nord');
    assert.strictEqual(theme.name, 'nord');
  });

  it('should return one-dark theme when requested', () => {
    const theme = getTheme('one-dark');
    assert.strictEqual(theme.name, 'one-dark');
  });

  it('should return github-dark theme when requested', () => {
    const theme = getTheme('github-dark');
    assert.strictEqual(theme.name, 'github-dark');
  });

  it('should return a complete theme object', () => {
    const theme = getTheme('dracula');
    assert.ok(theme.name);
    assert.ok(theme.colors);
    assert.ok(theme.colors.bg);
    assert.ok(theme.colors.text);
  });
});

describe('Theme color contrast', () => {
  // Helper to convert hex to RGB
  function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  // Helper to calculate relative luminance
  function getLuminance(hex: string): number {
    const { r, g, b } = hexToRgb(hex);
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  for (const [themeName, theme] of Object.entries(THEMES)) {
    it(`${themeName} should have darker background than text`, () => {
      const bgLuminance = getLuminance(theme.colors.bg);
      const textLuminance = getLuminance(theme.colors.text);
      assert.ok(textLuminance > bgLuminance, 
        `Text should be lighter than background in ${themeName}`);
    });

    it(`${themeName} should have card color different from background`, () => {
      assert.notStrictEqual(theme.colors.bg, theme.colors.card,
        `Card and background should be different in ${themeName}`);
    });
  }
});
