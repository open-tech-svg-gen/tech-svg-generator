/**
 * Tech SVG Generator
 * Generate clean, professional SVG illustrations for technical content
 * 
 * @packageDocumentation
 */

// Core generation
export { generateSVG, generateIllustration, detectScene, getAvailableScenes } from './generator.js';
export { SCENES } from './scenes.js';
export { THEMES, getTheme, type Theme, type ThemeColors } from './themes.js';
export { ICONS } from './icons.js';
export type { GenerateOptions, GenerateResult, SceneType } from './types.js';

// Cartoon strip generation
export { generateCartoonStrip, type CartoonStripConfig, type CartoonPanel, type DialogLine } from './cartoon.js';
export { 
  renderCharacter, 
  createCharacter, 
  getCharacterPresets, 
  getEmotions,
  CHARACTER_PRESETS,
  type Character, 
  type CharacterStyle, 
  type Emotion 
} from './characters.js';

// Sequence diagrams
export {
  generateSequenceDiagram,
  type SequenceDiagramConfig,
  type Participant,
  type Message,
} from './sequence.js';

// Flowcharts
export {
  generateFlowchart,
  type FlowchartConfig,
  type FlowNode,
  type FlowEdge,
  type NodeType,
} from './flowchart.js';

// Animations
export {
  addAnimations,
  getAnimationKeyframes,
  getAnimationClass,
  staggeredAnimation,
  ANIMATION_PRESETS,
  type AnimationType,
  type AnimationConfig,
} from './animations.js';

// YAML/JSON parsing
export {
  parseYAML,
  parseJSON,
  generateFromYAML,
  generateFromJSON,
  generateFromDescription,
  SCENE_YAML_EXAMPLE,
  CARTOON_YAML_EXAMPLE,
  CARTOON_JSON_EXAMPLE,
  type SceneDescription,
  type CartoonDescription,
  type Description,
} from './parser.js';
