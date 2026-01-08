/**
 * Tests for cartoon strip generator
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateCartoonStrip, type CartoonStripConfig } from './cartoon.js';

describe('generateCartoonStrip', () => {
  const basicConfig: CartoonStripConfig = {
    title: 'Test Strip',
    characters: {
      alice: { name: 'Alice', preset: 'dev1' },
      bob: { name: 'Bob', preset: 'dev2' },
    },
    panels: [
      {
        characters: ['alice', 'bob'],
        dialogue: [
          { character: 'alice', text: 'Hello!', emotion: 'happy' },
          { character: 'bob', text: 'Hi there!', emotion: 'neutral' },
        ],
      },
    ],
  };

  it('should return valid SVG string', () => {
    const svg = generateCartoonStrip(basicConfig);
    assert.ok(typeof svg === 'string');
    assert.ok(svg.startsWith('<?xml'));
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('</svg>'));
  });

  it('should include title', () => {
    const svg = generateCartoonStrip(basicConfig);
    assert.ok(svg.includes('Test Strip'));
  });

  it('should include character names', () => {
    const svg = generateCartoonStrip(basicConfig);
    assert.ok(svg.includes('Alice'));
    assert.ok(svg.includes('Bob'));
  });

  it('should include dialogue text', () => {
    const svg = generateCartoonStrip(basicConfig);
    assert.ok(svg.includes('Hello!'));
    assert.ok(svg.includes('Hi there!'));
  });

  it('should use default dimensions', () => {
    const svg = generateCartoonStrip(basicConfig);
    assert.ok(svg.includes('width="800"'));
    assert.ok(svg.includes('height="600"'));
  });

  it('should accept custom dimensions', () => {
    const svg = generateCartoonStrip({
      ...basicConfig,
      width: 1000,
      height: 500,
    });
    assert.ok(svg.includes('width="1000"'));
    assert.ok(svg.includes('height="500"'));
  });

  it('should accept theme option', () => {
    const svg = generateCartoonStrip({
      ...basicConfig,
      theme: 'dracula',
    });
    assert.ok(svg.includes('#282a36')); // Dracula bg color
  });

  it('should handle multiple panels', () => {
    const svg = generateCartoonStrip({
      ...basicConfig,
      panels: [
        {
          characters: ['alice'],
          dialogue: [{ character: 'alice', text: 'Panel 1' }],
        },
        {
          characters: ['bob'],
          dialogue: [{ character: 'bob', text: 'Panel 2' }],
        },
        {
          characters: ['alice', 'bob'],
          dialogue: [{ character: 'alice', text: 'Panel 3' }],
        },
      ],
    });
    assert.ok(svg.includes('Panel 1'));
    assert.ok(svg.includes('Panel 2'));
    assert.ok(svg.includes('Panel 3'));
  });

  it('should handle panel captions', () => {
    const svg = generateCartoonStrip({
      ...basicConfig,
      panels: [
        {
          characters: ['alice'],
          caption: 'Monday morning...',
          dialogue: [{ character: 'alice', text: 'Hello' }],
        },
      ],
    });
    assert.ok(svg.includes('Monday morning...'));
  });

  it('should handle different speech types', () => {
    const svg = generateCartoonStrip({
      ...basicConfig,
      panels: [
        {
          characters: ['alice', 'bob'],
          dialogue: [
            { character: 'alice', text: 'Normal', type: 'speech' },
            { character: 'bob', text: 'Thinking...', type: 'thought' },
          ],
        },
      ],
    });
    assert.ok(svg.includes('Normal'));
    assert.ok(svg.includes('Thinking...'));
  });

  it('should handle shout type', () => {
    const svg = generateCartoonStrip({
      ...basicConfig,
      panels: [
        {
          characters: ['alice'],
          dialogue: [
            { character: 'alice', text: 'WHAT?!', type: 'shout', emotion: 'surprised' },
          ],
        },
      ],
    });
    assert.ok(svg.includes('WHAT?!'));
  });

  it('should handle layout option', () => {
    const svg = generateCartoonStrip({
      ...basicConfig,
      layout: '2x2',
      panels: [
        { characters: ['alice'], dialogue: [{ character: 'alice', text: '1' }] },
        { characters: ['bob'], dialogue: [{ character: 'bob', text: '2' }] },
        { characters: ['alice'], dialogue: [{ character: 'alice', text: '3' }] },
        { characters: ['bob'], dialogue: [{ character: 'bob', text: '4' }] },
      ],
    });
    assert.ok(svg.includes('1'));
    assert.ok(svg.includes('4'));
  });

  it('should handle empty title', () => {
    const svg = generateCartoonStrip({
      characters: basicConfig.characters,
      panels: basicConfig.panels,
    });
    assert.ok(svg.includes('<svg'));
  });

  it('should handle single character panel', () => {
    const svg = generateCartoonStrip({
      ...basicConfig,
      panels: [
        {
          characters: ['alice'],
          dialogue: [{ character: 'alice', text: 'Solo!' }],
        },
      ],
    });
    assert.ok(svg.includes('Solo!'));
  });

  it('should handle three characters', () => {
    const svg = generateCartoonStrip({
      characters: {
        a: { name: 'A', preset: 'dev1' },
        b: { name: 'B', preset: 'dev2' },
        c: { name: 'C', preset: 'dev3' },
      },
      panels: [
        {
          characters: ['a', 'b', 'c'],
          dialogue: [
            { character: 'a', text: 'First' },
            { character: 'b', text: 'Second' },
            { character: 'c', text: 'Third' },
          ],
        },
      ],
    });
    assert.ok(svg.includes('First'));
    assert.ok(svg.includes('Second'));
    assert.ok(svg.includes('Third'));
  });
});

describe('generateCartoonStrip emotions', () => {
  it('should handle all emotions', () => {
    const emotions = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'thinking', 'confused', 'excited', 'worried'];
    
    for (const emotion of emotions) {
      const svg = generateCartoonStrip({
        characters: { test: { name: 'Test', preset: 'dev1' } },
        panels: [{
          characters: ['test'],
          dialogue: [{ character: 'test', text: `Feeling ${emotion}`, emotion: emotion as any }],
        }],
      });
      assert.ok(svg.includes(`Feeling ${emotion}`), `Failed for emotion: ${emotion}`);
    }
  });
});

describe('generateCartoonStrip character presets', () => {
  it('should handle all presets', () => {
    const presets = ['dev1', 'dev2', 'dev3', 'dev4', 'dev5', 'robot'];
    
    for (const preset of presets) {
      const svg = generateCartoonStrip({
        characters: { test: { name: 'Test', preset } },
        panels: [{
          characters: ['test'],
          dialogue: [{ character: 'test', text: 'Hello' }],
        }],
      });
      assert.ok(svg.includes('Hello'), `Failed for preset: ${preset}`);
    }
  });
});
