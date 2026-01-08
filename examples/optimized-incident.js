/**
 * Optimized Incident Cartoon - Maximum Space Utilization
 * Larger characters, compact messages, better layout
 */

import { writeFileSync } from 'fs';
import { generateCartoonStrip } from '../dist/index.js';

console.log('🎨 Generating optimized incident cartoon...\n');

const strip = generateCartoonStrip({
  title: '💥 Production Incident - Optimized Layout',
  theme: 'github-dark',
  width: 1600,
  height: 900,
  layout: '2x3',
  characters: {
    dev: { name: 'Dev', preset: 'alex' },
    ops: { name: 'Ops', preset: 'sam' }
  },
  panels: [
    {
      characters: ['dev'],
      caption: '3:47 PM',
      dialogue: [
        { character: 'dev', text: 'Deploying fix', emotion: 'happy' }
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
      caption: '3:50 PM',
      dialogue: [
        { character: 'ops', text: 'Data lost', emotion: 'thinking' },
        { character: 'dev', text: 'How?', emotion: 'confused' }
      ]
    },
    {
      characters: ['dev', 'ops'],
      caption: '4:15 PM',
      dialogue: [
        { character: 'dev', text: 'Missing ;', emotion: 'confused' },
        { character: 'ops', text: 'A SEMICOLON?!', emotion: 'angry', type: 'shout' }
      ]
    },
    {
      characters: ['dev'],
      caption: '4:16 PM',
      dialogue: [
        { character: 'dev', text: 'Test locally...', emotion: 'thinking', type: 'thought' }
      ]
    }
  ]
});

writeFileSync('examples/output/optimized-incident.svg', strip);
console.log('✅ Optimized cartoon generated!');
console.log('📁 Saved to: examples/output/optimized-incident.svg\n');
console.log('🎯 Optimizations Applied:');
console.log('   ✓ Character scale: 0.75 (75% larger)');
console.log('   ✓ Layout: 50% chat + 50% characters');
console.log('   ✓ Message spacing: 28px (compact)');
console.log('   ✓ Message width: 55% of panel');
console.log('   ✓ Minimal caption height');
console.log('   ✓ Better space utilization\n');
