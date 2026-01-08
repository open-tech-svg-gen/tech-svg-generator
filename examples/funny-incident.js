/**
 * Funny Incident Cartoon Strip
 * A hilarious tale of a production incident
 */

import { writeFileSync } from 'fs';
import { generateCartoonStrip } from '../dist/index.js';

console.log('🎨 Generating funny incident cartoon strip...\n');

const strip = generateCartoonStrip({
  title: '💥 The Great Production Incident of 2026',
  theme: 'github-dark',
  width: 1200,
  height: 600,
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
      caption: '3:47 PM - Friday',
      dialogue: [
        { character: 'dev', text: 'Just deploying this tiny fix...', emotion: 'happy' }
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
      characters: ['dev', 'ops', 'pm'],
      caption: '4:15 PM - The Realization',
      dialogue: [
        { character: 'dev', text: 'Wait... I forgot a semicolon', emotion: 'confused' },
        { character: 'ops', text: '...', emotion: 'angry' },
        { character: 'pm', text: 'A SEMICOLON?!', emotion: 'surprised', type: 'shout' }
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

writeFileSync('examples/output/funny-incident.svg', strip);
console.log('✅ Cartoon strip generated!');
console.log('📁 Saved to: examples/output/funny-incident.svg\n');
console.log('🎬 Scene Summary:');
console.log('   Panel 1: Dev confidently deploys a "tiny fix" on Friday');
console.log('   Panel 2: Ops discovers production is on fire');
console.log('   Panel 3: Dev claims it was just one line change');
console.log('   Panel 4: CTO reports massive data loss in war room');
console.log('   Panel 5: The shocking truth - a missing semicolon!');
console.log('   Panel 6: Dev vows to test locally next time\n');
