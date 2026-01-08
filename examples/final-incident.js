/**
 * Final Incident Cartoon - Optimized for maximum impact
 * Large characters, clear speech bubbles, no wasted space
 */

import { writeFileSync } from 'fs';
import { generateCartoonStrip } from '../dist/index.js';

console.log('🎨 Generating final incident cartoon...\n');

const strip = generateCartoonStrip({
  title: '💥 The Semicolon Incident',
  theme: 'github-dark',
  width: 1200,
  height: 900,
  layout: '2x3',
  characters: {
    dev: { name: 'Dev', preset: 'alex' },
    ops: { name: 'Ops', preset: 'sam' }
  },
  panels: [
    {
      characters: ['dev'],
      caption: 'Friday 3:47 PM',
      dialogue: [
        { character: 'dev', text: 'Deploying tiny fix...', emotion: 'happy' }
      ]
    },
    {
      characters: ['ops'],
      caption: '3:48 PM',
      dialogue: [
        { character: 'ops', text: 'FIRE!!!', emotion: 'worried', type: 'shout' }
      ]
    },
    {
      characters: ['dev', 'ops'],
      caption: '3:49 PM',
      dialogue: [
        { character: 'dev', text: 'One line!', emotion: 'surprised' },
        { character: 'ops', text: 'BROKE IT!', emotion: 'angry', type: 'shout' }
      ]
    },
    {
      characters: ['dev', 'ops'],
      caption: 'War Room',
      dialogue: [
        { character: 'ops', text: 'Data lost!', emotion: 'thinking' },
        { character: 'dev', text: 'How?!', emotion: 'confused' }
      ]
    },
    {
      characters: ['dev'],
      caption: '4:15 PM',
      dialogue: [
        { character: 'dev', text: 'Missing semicolon...', emotion: 'confused' }
      ]
    },
    {
      characters: ['dev'],
      caption: 'Lesson Learned',
      dialogue: [
        { character: 'dev', text: 'Test locally!', emotion: 'thinking' }
      ]
    }
  ]
});

writeFileSync('examples/output/final-incident.svg', strip);
console.log('✅ Final cartoon generated!');
console.log('📁 Saved to: examples/output/final-incident.svg\n');
console.log('🎯 Layout:');
console.log('   • Canvas: 1200x900 (taller panels)');
console.log('   • Grid: 2x3 (2 columns, 3 rows)');
console.log('   • Character scale: Auto (fills 65% of panel)');
console.log('   • Speech bubbles: Above characters');
console.log('   • No wasted space!\n');
