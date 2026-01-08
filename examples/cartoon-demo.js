/**
 * Cartoon Strip Demo
 * Demonstrates the new cartoon strip generation feature
 */

import { writeFileSync } from 'fs';
import { 
  generateCartoonStrip, 
  generateFromYAML,
  CARTOON_YAML_EXAMPLE,
  getCharacterPresets,
  getEmotions
} from '../dist/index.js';

console.log('🎨 Tech SVG Generator - Cartoon Strip Demo\n');

// Show available presets and emotions
console.log('Available character presets:', getCharacterPresets().join(', '));
console.log('Available emotions:', getEmotions().join(', '));
console.log('');

// Example 1: Programmatic API
console.log('1. Generating cartoon strip via API...');
const strip1 = generateCartoonStrip({
  title: 'The Daily Standup',
  theme: 'github-dark',
  width: 1000,
  height: 450,
  layout: '3x1',
  characters: {
    pm: { name: 'PM', preset: 'taylor' },
    dev: { name: 'Dev', preset: 'alex' },
    qa: { name: 'QA', preset: 'jordan' }
  },
  panels: [
    {
      characters: ['pm', 'dev'],
      caption: '9:00 AM',
      dialogue: [
        { character: 'pm', text: 'How is the feature going?', emotion: 'neutral' },
        { character: 'dev', text: "Almost done, just fixing a small bug", emotion: 'thinking' }
      ]
    },
    {
      characters: ['dev', 'qa'],
      caption: '2:00 PM',
      dialogue: [
        { character: 'qa', text: 'I found 47 issues...', emotion: 'worried' },
        { character: 'dev', text: 'WHAT?!', emotion: 'surprised', type: 'shout' }
      ]
    },
    {
      characters: ['pm', 'dev', 'qa'],
      caption: '6:00 PM',
      dialogue: [
        { character: 'dev', text: 'All fixed! Ship it!', emotion: 'excited' },
        { character: 'pm', text: 'Great work team!', emotion: 'happy' }
      ]
    }
  ]
});

writeFileSync('examples/output/cartoon-standup.svg', strip1);
console.log('   ✓ Saved to examples/output/cartoon-standup.svg\n');

// Example 2: YAML-based generation
console.log('2. Generating cartoon strip from YAML...');
const yamlConfig = `
type: cartoon
title: "Rubber Duck Debugging"
theme: dracula
width: 800
height: 400
layout: "2x1"

characters:
  dev:
    name: Developer
    preset: casey
  duck:
    name: Duck
    preset: robot

panels:
  - characters: [dev, duck]
    caption: "The bug hunt begins..."
    dialogue:
      - character: dev
        text: "So the API returns 500 when..."
        emotion: confused
      - character: duck
        text: "..."
        emotion: neutral

  - characters: [dev, duck]
    caption: "Enlightenment!"
    dialogue:
      - character: dev
        text: "OH! I forgot to await the promise!"
        emotion: excited
        type: shout
      - character: duck
        text: "..."
        emotion: neutral
`;

const strip2 = generateFromYAML(yamlConfig);
writeFileSync('examples/output/cartoon-rubber-duck.svg', strip2);
console.log('   ✓ Saved to examples/output/cartoon-rubber-duck.svg\n');

// Example 3: Code Review scenario
console.log('3. Generating code review cartoon...');
const strip3 = generateCartoonStrip({
  title: 'The Code Review',
  theme: 'nord',
  width: 900,
  height: 550,
  layout: '2x2',
  characters: {
    senior: { name: 'Senior Dev', preset: 'sam' },
    junior: { name: 'Junior Dev', preset: 'riley' }
  },
  panels: [
    {
      characters: ['junior', 'senior'],
      caption: 'PR Submitted',
      dialogue: [
        { character: 'junior', text: 'Can you review my PR?', emotion: 'happy' },
        { character: 'senior', text: 'Sure, let me take a look', emotion: 'neutral' }
      ]
    },
    {
      characters: ['senior'],
      caption: '5 minutes later...',
      dialogue: [
        { character: 'senior', text: 'Why is there a TODO from 2019?', emotion: 'confused' }
      ]
    },
    {
      characters: ['junior', 'senior'],
      caption: 'The Discussion',
      dialogue: [
        { character: 'junior', text: "It was already there!", emotion: 'worried' },
        { character: 'senior', text: "Let's fix it anyway", emotion: 'thinking' }
      ]
    },
    {
      characters: ['junior', 'senior'],
      caption: 'Approved!',
      dialogue: [
        { character: 'senior', text: 'LGTM! Great work!', emotion: 'happy' },
        { character: 'junior', text: 'Thanks!', emotion: 'excited' }
      ]
    }
  ]
});

writeFileSync('examples/output/cartoon-code-review.svg', strip3);
console.log('   ✓ Saved to examples/output/cartoon-code-review.svg\n');

// Example 4: Using the example YAML
console.log('4. Generating from built-in YAML example...');
const strip4 = generateFromYAML(CARTOON_YAML_EXAMPLE);
writeFileSync('examples/output/cartoon-example.svg', strip4);
console.log('   ✓ Saved to examples/output/cartoon-example.svg\n');

console.log('✅ All cartoon strips generated successfully!');
console.log('\nOpen the SVG files in a browser to view them.');
