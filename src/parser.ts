/**
 * YAML/JSON scene description parser
 * Allows defining scenes and cartoon strips in declarative format
 */

import yaml from 'js-yaml';
import { generateSVG } from './generator.js';
import type { GenerateOptions } from './types.js';
import { generateCartoonStrip, type CartoonStripConfig } from './cartoon.js';
import type { SceneType } from './types.js';

/**
 * Scene description format for technical illustrations
 */
export interface SceneDescription {
  type: 'scene';
  title: string;
  content?: string;
  scene?: SceneType;
  theme?: string;
  width?: number;
  height?: number;
}

/**
 * Cartoon strip description format
 */
export interface CartoonDescription {
  type: 'cartoon';
  title?: string;
  theme?: string;
  width?: number;
  height?: number;
  layout?: string;
  characters: Record<string, {
    name: string;
    preset?: string;
    style?: {
      primary?: string;
      secondary?: string;
      skin?: string;
      hairStyle?: 'short' | 'long' | 'bald' | 'spiky' | 'curly';
      accessory?: 'none' | 'glasses' | 'hat' | 'headphones';
    };
  }>;
  panels: Array<{
    characters: string[];
    caption?: string;
    dialogue: Array<{
      character: string;
      text: string;
      emotion?: string;
      type?: 'speech' | 'thought' | 'shout';
    }>;
  }>;
}

export type Description = SceneDescription | CartoonDescription;

/**
 * Parse YAML string into description object
 */
export function parseYAML(yamlString: string): Description {
  const parsed = yaml.load(yamlString) as Description;
  validateDescription(parsed);
  return parsed;
}

/**
 * Parse JSON string into description object
 */
export function parseJSON(jsonString: string): Description {
  const parsed = JSON.parse(jsonString) as Description;
  validateDescription(parsed);
  return parsed;
}

/**
 * Validate description object
 */
function validateDescription(desc: any): asserts desc is Description {
  if (!desc || typeof desc !== 'object') {
    throw new Error('Invalid description: must be an object');
  }
  
  if (!desc.type) {
    throw new Error('Invalid description: missing "type" field (must be "scene" or "cartoon")');
  }
  
  if (desc.type === 'scene') {
    if (!desc.title || typeof desc.title !== 'string') {
      throw new Error('Invalid scene description: missing or invalid "title" field');
    }
  } else if (desc.type === 'cartoon') {
    if (!desc.characters || typeof desc.characters !== 'object') {
      throw new Error('Invalid cartoon description: missing "characters" field');
    }
    if (!Array.isArray(desc.panels) || desc.panels.length === 0) {
      throw new Error('Invalid cartoon description: missing or empty "panels" array');
    }
    
    // Validate panels
    for (let i = 0; i < desc.panels.length; i++) {
      const panel = desc.panels[i];
      if (!Array.isArray(panel.characters)) {
        throw new Error(`Invalid panel ${i}: missing "characters" array`);
      }
      if (!Array.isArray(panel.dialogue)) {
        throw new Error(`Invalid panel ${i}: missing "dialogue" array`);
      }
      
      // Validate dialogue
      for (let j = 0; j < panel.dialogue.length; j++) {
        const line = panel.dialogue[j];
        if (!line.character || typeof line.character !== 'string') {
          throw new Error(`Invalid dialogue in panel ${i}, line ${j}: missing "character" field`);
        }
        if (!line.text || typeof line.text !== 'string') {
          throw new Error(`Invalid dialogue in panel ${i}, line ${j}: missing "text" field`);
        }
      }
    }
  } else {
    throw new Error(`Invalid description type: "${desc.type}" (must be "scene" or "cartoon")`);
  }
}

/**
 * Generate SVG from description object
 */
export function generateFromDescription(desc: Description): string {
  if (desc.type === 'scene') {
    const options: GenerateOptions = {
      width: desc.width,
      height: desc.height,
      theme: desc.theme,
      scene: desc.scene,
    };
    return generateSVG(desc.title, desc.content || '', options).svg;
  } else if (desc.type === 'cartoon') {
    const config: CartoonStripConfig = {
      title: desc.title,
      theme: desc.theme,
      width: desc.width,
      height: desc.height,
      layout: desc.layout,
      characters: desc.characters,
      panels: desc.panels.map(p => ({
        characters: p.characters,
        caption: p.caption,
        dialogue: p.dialogue.map(d => ({
          character: d.character,
          text: d.text,
          emotion: d.emotion as any,
          type: d.type,
        })),
      })),
    };
    return generateCartoonStrip(config);
  }
  
  throw new Error('Unknown description type');
}

/**
 * Generate SVG from YAML string
 */
export function generateFromYAML(yamlString: string): string {
  const desc = parseYAML(yamlString);
  return generateFromDescription(desc);
}

/**
 * Generate SVG from JSON string
 */
export function generateFromJSON(jsonString: string): string {
  const desc = parseJSON(jsonString);
  return generateFromDescription(desc);
}

/**
 * Example YAML for a scene
 */
export const SCENE_YAML_EXAMPLE = `
type: scene
title: "Database Migration Strategy"
content: "PostgreSQL replication and failover"
scene: database
theme: github-dark
width: 700
height: 420
`.trim();

/**
 * Example YAML for a cartoon strip
 */
export const CARTOON_YAML_EXAMPLE = `
type: cartoon
title: "The Code Review"
theme: github-dark
width: 800
height: 500
layout: "2x1"

characters:
  alice:
    name: Alice
    preset: dev1
  bob:
    name: Bob
    preset: dev2

panels:
  - characters: [alice, bob]
    caption: "Monday morning..."
    dialogue:
      - character: alice
        text: "Did you see the PR I submitted?"
        emotion: neutral
      - character: bob
        text: "The one with 2000 lines?"
        emotion: surprised

  - characters: [alice, bob]
    caption: "Later..."
    dialogue:
      - character: bob
        text: "Maybe we should split this up?"
        emotion: thinking
      - character: alice
        text: "Good idea!"
        emotion: happy
`.trim();

/**
 * Example JSON for a cartoon strip
 */
export const CARTOON_JSON_EXAMPLE = JSON.stringify({
  type: 'cartoon',
  title: 'Debugging Session',
  theme: 'dracula',
  width: 800,
  height: 400,
  layout: '2x1',
  characters: {
    dev: { name: 'Dev', preset: 'dev1' },
    rubber: { name: 'Rubber Duck', preset: 'robot' }
  },
  panels: [
    {
      characters: ['dev', 'rubber'],
      dialogue: [
        { character: 'dev', text: "Why isn't this working?!", emotion: 'angry' },
        { character: 'rubber', text: '...', emotion: 'neutral' }
      ]
    },
    {
      characters: ['dev', 'rubber'],
      dialogue: [
        { character: 'dev', text: 'Oh wait, I see it now!', emotion: 'excited' },
        { character: 'rubber', text: '...', emotion: 'neutral' }
      ]
    }
  ]
}, null, 2);
