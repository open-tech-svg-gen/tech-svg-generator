/**
 * Funny Incident Cartoon Strip - Improved Layout
 * Better dialogue distribution and clearer readability
 */

import { writeFileSync } from 'fs';
import { generateCartoonStrip } from '../dist/index.js';

console.log('🎨 Generating improved funny incident cartoon strip...\n');

const strip = generateCartoonStrip({
  title: '💥 The Great Production Incident of 2026',
  theme: 'github-dark',
  width: 1400,
  height: 700,
  layout: '3x2',
  characters: {
    dev: { name: 'Dev', preset: 'alex' },
    ops: { name: 'Ops', preset: 'sam' },
    pm: { name: 'PM', preset: 'taylor' },
    cto: { name: 'CTO', preset: 'casey' }
  },
  panels: [
    {
      characters: ['dev'],
      caption: '3:47 PM - Friday Afternoon',
      dialogue: [
        { character: 'dev', text: 'Just deploying this tiny fix...', emotion: 'happy' }
      ]
    },
    {
      characters: ['ops'],
      caption: '3:48 PM - Monitoring Dashboard',
      dialogue: [
        { character: 'ops', text: 'EVERYTHING IS ON FIRE!!!', emotion: 'worried', type: 'shout' }
      ]
    },
    {
      characters: ['dev', 'ops'],
      caption: '3:49 PM - Slack Explodes',
      dialogue: [
        { character: 'dev', text: 'What? I only changed one line!', emotion: 'surprised' },
        { character: 'ops', text: 'ONE LINE BROKE PRODUCTION!', emotion: 'angry', type: 'shout' }
      ]
    },
    {
      characters: ['pm', 'cto'],
      caption: '3:50 PM - War Room',
      dialogue: [
        { character: 'pm', text: 'How bad is it?', emotion: 'worried' },
        { character: 'cto', text: 'We lost 47 minutes of data', emotion: 'thinking' }
      ]
    },
    {
      characters: ['dev'],
      caption: '4:15 PM - The Realization',
      dialogue: [
        { character: 'dev', text: 'Wait... I forgot a semicolon', emotion: 'confused' }
      ]
    },
    {
      characters: ['dev'],
      caption: '4:16 PM - Lessons Learned',
      dialogue: [
        { character: 'dev', text: 'I will now test locally...', emotion: 'thinking', type: 'thought' }
      ]
    }
  ]
});

writeFileSync('examples/output/funny-incident-improved.svg', strip);
console.log('✅ Improved cartoon strip generated!');
console.log('📁 Saved to: examples/output/funny-incident-improved.svg\n');
console.log('✨ Improvements Made:');
console.log('   ✓ Better dialogue spacing - no overlaps');
console.log('   ✓ Clearer character positioning');
console.log('   ✓ Optimized bubble sizing for readability');
console.log('   ✓ Grouped dialogue by character');
console.log('   ✓ Improved text wrapping and font sizing');
console.log('   ✓ Better vertical spacing between panels\n');
