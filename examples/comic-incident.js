/**
 * Comic-Style Incident - Traditional comic strip layout
 * Speech bubbles directly above characters
 */

import { writeFileSync } from 'fs';
import { generateCartoonStrip } from '../dist/index.js';

console.log('🎨 Generating comic-style incident cartoon...\n');

const strip = generateCartoonStrip({
  title: '💥 The Semicolon Incident',
  theme: 'github-dark',
  width: 1400,
  height: 700,
  layout: '3x2',
  characters: {
    dev: { name: 'Dev', preset: 'alex' },
    ops: { name: 'Ops', preset: 'sam' }
  },
  panels: [
    {
      characters: ['dev'],
      caption: 'Friday 3:47 PM',
      dialogue: [
        { character: 'dev', text: 'Just a tiny fix...', emotion: 'happy' }
      ]
    },
    {
      characters: ['ops'],
      caption: '3:48 PM',
      dialogue: [
        { character: 'ops', text: 'EVERYTHING IS ON FIRE!!!', emotion: 'worried', type: 'shout' }
      ]
    },
    {
      characters: ['dev', 'ops'],
      caption: '3:49 PM',
      dialogue: [
        { character: 'dev', text: 'I only changed one line!', emotion: 'surprised' },
        { character: 'ops', text: 'ONE LINE BROKE IT ALL!', emotion: 'angry', type: 'shout' }
      ]
    },
    {
      characters: ['dev', 'ops'],
      caption: 'War Room',
      dialogue: [
        { character: 'ops', text: '47 minutes of data lost', emotion: 'thinking' },
        { character: 'dev', text: 'How is that possible?', emotion: 'confused' }
      ]
    },
    {
      characters: ['dev'],
      caption: '4:15 PM - The Truth',
      dialogue: [
        { character: 'dev', text: 'I forgot a semicolon...', emotion: 'confused' }
      ]
    },
    {
      characters: ['dev'],
      caption: 'Lesson Learned',
      dialogue: [
        { character: 'dev', text: 'Always test locally first!', emotion: 'thinking' }
      ]
    }
  ]
});

writeFileSync('examples/output/comic-incident.svg', strip);
console.log('✅ Comic-style cartoon generated!');
console.log('📁 Saved to: examples/output/comic-incident.svg\n');
console.log('🎬 Features:');
console.log('   ✓ Full-size characters (scale 1.0)');
console.log('   ✓ Speech bubbles above characters');
console.log('   ✓ Traditional comic strip layout');
console.log('   ✓ Clear visual hierarchy');
console.log('   ✓ No wasted space\n');
