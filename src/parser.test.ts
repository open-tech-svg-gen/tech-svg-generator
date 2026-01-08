/**
 * Tests for YAML/JSON parser
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  parseYAML,
  parseJSON,
  generateFromYAML,
  generateFromJSON,
  generateFromDescription,
  SCENE_YAML_EXAMPLE,
  CARTOON_YAML_EXAMPLE,
  CARTOON_JSON_EXAMPLE,
} from './parser.js';

describe('parseYAML', () => {
  it('should parse valid scene YAML', () => {
    const yaml = `
type: scene
title: Test Scene
`;
    const result = parseYAML(yaml);
    assert.strictEqual(result.type, 'scene');
    assert.strictEqual((result as any).title, 'Test Scene');
  });

  it('should parse valid cartoon YAML', () => {
    const yaml = `
type: cartoon
characters:
  test:
    name: Test
    preset: dev1
panels:
  - characters: [test]
    dialogue:
      - character: test
        text: Hello
`;
    const result = parseYAML(yaml);
    assert.strictEqual(result.type, 'cartoon');
  });

  it('should throw on invalid YAML', () => {
    assert.throws(() => parseYAML('not: valid: yaml: here'));
  });

  it('should throw on missing type', () => {
    assert.throws(() => parseYAML('title: Test'), /missing "type"/);
  });

  it('should throw on invalid type', () => {
    assert.throws(() => parseYAML('type: invalid\ntitle: Test'), /Invalid description type/);
  });

  it('should throw on scene without title', () => {
    assert.throws(() => parseYAML('type: scene'), /missing or invalid "title"/);
  });

  it('should throw on cartoon without characters', () => {
    assert.throws(() => parseYAML('type: cartoon\npanels: []'), /missing "characters"/);
  });

  it('should throw on cartoon without panels', () => {
    assert.throws(() => parseYAML('type: cartoon\ncharacters:\n  a:\n    name: A'), /missing or empty "panels"/);
  });
});

describe('parseJSON', () => {
  it('should parse valid scene JSON', () => {
    const json = JSON.stringify({ type: 'scene', title: 'Test' });
    const result = parseJSON(json);
    assert.strictEqual(result.type, 'scene');
  });

  it('should parse valid cartoon JSON', () => {
    const json = JSON.stringify({
      type: 'cartoon',
      characters: { a: { name: 'A' } },
      panels: [{ characters: ['a'], dialogue: [{ character: 'a', text: 'Hi' }] }],
    });
    const result = parseJSON(json);
    assert.strictEqual(result.type, 'cartoon');
  });

  it('should throw on invalid JSON', () => {
    assert.throws(() => parseJSON('not json'), /JSON/);
  });
});

describe('generateFromYAML', () => {
  it('should generate SVG from scene YAML', () => {
    const yaml = `
type: scene
title: Database Migration
scene: database
`;
    const svg = generateFromYAML(yaml);
    assert.ok(svg.startsWith('<?xml'));
    assert.ok(svg.includes('<svg'));
  });

  it('should generate SVG from cartoon YAML', () => {
    const yaml = `
type: cartoon
characters:
  dev:
    name: Developer
    preset: dev1
panels:
  - characters: [dev]
    dialogue:
      - character: dev
        text: Hello World
`;
    const svg = generateFromYAML(yaml);
    assert.ok(svg.startsWith('<?xml'));
    assert.ok(svg.includes('Hello World'));
  });

  it('should handle scene options', () => {
    const yaml = `
type: scene
title: Test
width: 1000
height: 500
theme: dracula
`;
    const svg = generateFromYAML(yaml);
    assert.ok(svg.includes('width="1000"'));
    assert.ok(svg.includes('height="500"'));
  });

  it('should handle cartoon options', () => {
    const yaml = `
type: cartoon
title: Test Strip
width: 900
height: 400
theme: nord
layout: "2x1"
characters:
  a:
    name: A
panels:
  - characters: [a]
    dialogue:
      - character: a
        text: Test
`;
    const svg = generateFromYAML(yaml);
    assert.ok(svg.includes('width="900"'));
    assert.ok(svg.includes('Test Strip'));
  });
});

describe('generateFromJSON', () => {
  it('should generate SVG from scene JSON', () => {
    const json = JSON.stringify({
      type: 'scene',
      title: 'API Design',
      scene: 'api',
    });
    const svg = generateFromJSON(json);
    assert.ok(svg.startsWith('<?xml'));
  });

  it('should generate SVG from cartoon JSON', () => {
    const json = JSON.stringify({
      type: 'cartoon',
      characters: { dev: { name: 'Dev', preset: 'dev1' } },
      panels: [{
        characters: ['dev'],
        dialogue: [{ character: 'dev', text: 'JSON works!' }],
      }],
    });
    const svg = generateFromJSON(json);
    assert.ok(svg.includes('JSON works!'));
  });
});

describe('generateFromDescription', () => {
  it('should handle scene description', () => {
    const desc = {
      type: 'scene' as const,
      title: 'Test Scene',
    };
    const svg = generateFromDescription(desc);
    assert.ok(svg.includes('<svg'));
  });

  it('should handle cartoon description', () => {
    const desc = {
      type: 'cartoon' as const,
      characters: { a: { name: 'A' } },
      panels: [{ characters: ['a'], dialogue: [{ character: 'a', text: 'Hi' }] }],
    };
    const svg = generateFromDescription(desc);
    assert.ok(svg.includes('<svg'));
  });
});

describe('Example constants', () => {
  it('SCENE_YAML_EXAMPLE should be valid', () => {
    const result = parseYAML(SCENE_YAML_EXAMPLE);
    assert.strictEqual(result.type, 'scene');
  });

  it('CARTOON_YAML_EXAMPLE should be valid', () => {
    const result = parseYAML(CARTOON_YAML_EXAMPLE);
    assert.strictEqual(result.type, 'cartoon');
  });

  it('CARTOON_JSON_EXAMPLE should be valid', () => {
    const result = parseJSON(CARTOON_JSON_EXAMPLE);
    assert.strictEqual(result.type, 'cartoon');
  });

  it('should generate SVG from SCENE_YAML_EXAMPLE', () => {
    const svg = generateFromYAML(SCENE_YAML_EXAMPLE);
    assert.ok(svg.includes('<svg'));
  });

  it('should generate SVG from CARTOON_YAML_EXAMPLE', () => {
    const svg = generateFromYAML(CARTOON_YAML_EXAMPLE);
    assert.ok(svg.includes('<svg'));
  });

  it('should generate SVG from CARTOON_JSON_EXAMPLE', () => {
    const svg = generateFromJSON(CARTOON_JSON_EXAMPLE);
    assert.ok(svg.includes('<svg'));
  });
});

describe('Validation edge cases', () => {
  it('should reject null description', () => {
    assert.throws(() => parseJSON('null'), /must be an object/);
  });

  it('should reject array description', () => {
    assert.throws(() => parseJSON('[]'), /missing "type"/);
  });

  it('should reject panel without characters array', () => {
    const yaml = `
type: cartoon
characters:
  a:
    name: A
panels:
  - dialogue:
      - character: a
        text: Hi
`;
    assert.throws(() => parseYAML(yaml), /missing "characters" array/);
  });

  it('should reject panel without dialogue array', () => {
    const yaml = `
type: cartoon
characters:
  a:
    name: A
panels:
  - characters: [a]
`;
    assert.throws(() => parseYAML(yaml), /missing "dialogue" array/);
  });

  it('should reject dialogue without character', () => {
    const yaml = `
type: cartoon
characters:
  a:
    name: A
panels:
  - characters: [a]
    dialogue:
      - text: Hi
`;
    assert.throws(() => parseYAML(yaml), /missing "character" field/);
  });

  it('should reject dialogue without text', () => {
    const yaml = `
type: cartoon
characters:
  a:
    name: A
panels:
  - characters: [a]
    dialogue:
      - character: a
`;
    assert.throws(() => parseYAML(yaml), /missing "text" field/);
  });
});
