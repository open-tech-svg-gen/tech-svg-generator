/**
 * Tests for character system
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  renderCharacter,
  createCharacter,
  getCharacterPresets,
  getEmotions,
  CHARACTER_PRESETS,
  type Emotion,
} from './characters.js';

describe('CHARACTER_PRESETS', () => {
  it('should have at least 5 presets', () => {
    assert.ok(Object.keys(CHARACTER_PRESETS).length >= 5);
  });

  it('should have dev1 preset', () => {
    assert.ok(CHARACTER_PRESETS.dev1);
  });

  it('should have robot preset', () => {
    assert.ok(CHARACTER_PRESETS.robot);
  });

  it('each preset should have required properties', () => {
    for (const [name, style] of Object.entries(CHARACTER_PRESETS)) {
      assert.ok(style.primary, `${name} missing primary`);
      assert.ok(style.secondary, `${name} missing secondary`);
      assert.ok(style.skin, `${name} missing skin`);
      assert.ok(style.hairStyle, `${name} missing hairStyle`);
      assert.ok(style.accessory !== undefined, `${name} missing accessory`);
    }
  });
});

describe('createCharacter', () => {
  it('should create character with preset', () => {
    const char = createCharacter('test', 'Test User', 'dev1');
    assert.strictEqual(char.id, 'test');
    assert.strictEqual(char.name, 'Test User');
    assert.deepStrictEqual(char.style, CHARACTER_PRESETS.dev1);
  });

  it('should use alex as default preset', () => {
    const char = createCharacter('test', 'Test');
    assert.deepStrictEqual(char.style, CHARACTER_PRESETS.alex);
  });

  it('should fallback to alex for unknown preset', () => {
    const char = createCharacter('test', 'Test', 'unknown-preset');
    assert.deepStrictEqual(char.style, CHARACTER_PRESETS.alex);
  });

  it('should accept custom style object', () => {
    const customStyle = {
      primary: '#ff0000',
      secondary: '#00ff00',
      skin: '#ffcc99',
      hairStyle: 'spiky' as const,
      accessory: 'glasses' as const,
      eyeColor: '#0000ff',
      shirtStyle: 'tshirt' as const,
    };
    const char = createCharacter('test', 'Test', customStyle);
    assert.deepStrictEqual(char.style, customStyle);
  });
});

describe('renderCharacter', () => {
  it('should return SVG string', () => {
    const char = createCharacter('test', 'Test', 'dev1');
    const svg = renderCharacter(100, 100, char);
    assert.ok(typeof svg === 'string');
    assert.ok(svg.length > 0);
  });

  it('should include character name', () => {
    const char = createCharacter('test', 'Alice', 'dev1');
    const svg = renderCharacter(100, 100, char);
    assert.ok(svg.includes('Alice'));
  });

  it('should include transform with position', () => {
    const char = createCharacter('test', 'Test', 'dev1');
    const svg = renderCharacter(150, 200, char);
    assert.ok(svg.includes('translate(150, 200)'));
  });

  it('should handle different emotions', () => {
    const char = createCharacter('test', 'Test', 'dev1');
    const emotions: Emotion[] = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'thinking', 'confused', 'excited', 'worried'];
    
    for (const emotion of emotions) {
      const svg = renderCharacter(100, 100, char, emotion);
      assert.ok(svg.length > 0, `Failed for emotion: ${emotion}`);
    }
  });

  it('should handle facing direction', () => {
    const char = createCharacter('test', 'Test', 'dev1');
    const leftSvg = renderCharacter(100, 100, char, 'neutral', 1, 'left');
    const rightSvg = renderCharacter(100, 100, char, 'neutral', 1, 'right');
    
    assert.ok(leftSvg.includes('scale(-1'));
    assert.ok(rightSvg.includes('scale(1'));
  });

  it('should handle scale parameter', () => {
    const char = createCharacter('test', 'Test', 'dev1');
    const svg = renderCharacter(100, 100, char, 'neutral', 0.5);
    assert.ok(svg.includes('0.5'));
  });
});

describe('getCharacterPresets', () => {
  it('should return array of preset names', () => {
    const presets = getCharacterPresets();
    assert.ok(Array.isArray(presets));
    assert.ok(presets.length >= 5);
  });

  it('should include dev1', () => {
    const presets = getCharacterPresets();
    assert.ok(presets.includes('dev1'));
  });

  it('should include robot', () => {
    const presets = getCharacterPresets();
    assert.ok(presets.includes('robot'));
  });
});

describe('getEmotions', () => {
  it('should return array of emotions', () => {
    const emotions = getEmotions();
    assert.ok(Array.isArray(emotions));
    assert.ok(emotions.length >= 9);
  });

  it('should include neutral', () => {
    const emotions = getEmotions();
    assert.ok(emotions.includes('neutral'));
  });

  it('should include happy', () => {
    const emotions = getEmotions();
    assert.ok(emotions.includes('happy'));
  });

  it('should include all expected emotions', () => {
    const emotions = getEmotions();
    const expected = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'thinking', 'confused', 'excited', 'worried'];
    for (const e of expected) {
      assert.ok(emotions.includes(e as Emotion), `Missing emotion: ${e}`);
    }
  });
});
