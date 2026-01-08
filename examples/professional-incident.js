/**
 * Professional Incident Cartoon - Optimized Layout
 * Uses simplified dialogue and better spacing
 */

import { writeFileSync } from 'fs';
import { generateCartoonStrip } from '../dist/index.js';

console.log('🎨 Generating professional incident cartoon strip...\n');

const strip = generateCartoonStrip({
  title: '💥 Production Incident: The Missing Semicolon',
  theme: 'github-dark',
  width: 1600,
  height: 800,
  layout: '2x3',
  characters: {
    dev: { name: 'Dev', preset: 'alex' },
    ops: { name: 'Ops', preset: 'sam' }
  },
  panels: [
    {
      characters: ['dev'],
      caption: 'Panel 1: Friday 3:47 PM',
      dialogue: [
        { character: 'dev', text: 'Deploying fix', emotion: 'happy' }
      ]
    },
    {
      characters: ['ops'],
      caption: 'Panel 2: 3:48 PM',
      dialogue: [
        { character: 'ops', text: 'FIRE!!!', emotion: 'worried', type: 'shout' }
      ]
    },
    {
      characters: ['dev', 'ops'],
      caption: 'Panel 3: 3:49 PM',
      dialogue: [
        { character: 'dev', text: 'One line!', emotion: 'surprised' },
        { character: 'ops', text: 'BROKE IT!', emotion: 'angry', type: 'shout' }
      ]
    },
    {
      characters: ['dev'],
      caption: 'Panel 4: 4:15 PM',
      dialogue: [
        { character: 'dev', text: 'Missing ;', emotion: 'confused' }
      ]
    },
    {
      characters: ['ops'],
      caption: 'Panel 5: War Room',
      dialogue: [
        { character: 'ops', text: 'Data lost', emotion: 'thinking' }
      ]
    },
    {
      characters: ['dev'],
      caption: 'Panel 6: Lesson',
      dialogue: [
        { character: 'dev', text: 'Test local', emotion: 'thinking', type: 'thought' }
      ]
    }
  ]
});

writeFileSync('examples/output/professional-incident.svg', strip);
console.log('✅ Professional cartoon generated!');
console.log('📁 Saved to: examples/output/professional-incident.svg\n');
console.log('📊 Layout Features:');
console.log('   • 2x3 grid (2 columns, 3 rows)');
console.log('   • Larger canvas (1600x800)');
console.log('   • Simplified dialogue (1-2 words per bubble)');
console.log('   • Clear separation of dialogue and characters');
console.log('   • Professional comic strip format\n');
