/**
 * WhatsApp-Style Incident Cartoon
 * Clean chat-based dialogue for maximum readability
 */

import { writeFileSync } from 'fs';
import { generateCartoonStrip } from '../dist/index.js';

console.log('💬 Generating WhatsApp-style incident cartoon...\n');

const strip = generateCartoonStrip({
  title: '💥 The Great Production Incident - WhatsApp Edition',
  theme: 'github-dark',
  width: 1400,
  height: 800,
  layout: '2x3',
  characters: {
    dev: { name: 'Dev', preset: 'alex' },
    ops: { name: 'Ops', preset: 'sam' }
  },
  panels: [
    {
      characters: ['dev'],
      caption: '3:47 PM - Friday',
      dialogue: [
        { character: 'dev', text: 'Deploying tiny fix now', emotion: 'happy' }
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
      caption: '3:49 PM - Slack Explodes',
      dialogue: [
        { character: 'dev', text: 'What? I only changed one line!', emotion: 'surprised' },
        { character: 'ops', text: 'ONE LINE BROKE PRODUCTION!', emotion: 'angry', type: 'shout' }
      ]
    },
    {
      characters: ['dev', 'ops'],
      caption: '3:50 PM - War Room',
      dialogue: [
        { character: 'ops', text: 'We lost 47 minutes of data', emotion: 'thinking' },
        { character: 'dev', text: 'How is that possible?', emotion: 'confused' }
      ]
    },
    {
      characters: ['dev', 'ops'],
      caption: '4:15 PM - The Realization',
      dialogue: [
        { character: 'dev', text: 'Wait... I forgot a semicolon', emotion: 'confused' },
        { character: 'ops', text: 'A SEMICOLON?!?!', emotion: 'angry', type: 'shout' }
      ]
    },
    {
      characters: ['dev'],
      caption: '4:16 PM - Lessons Learned',
      dialogue: [
        { character: 'dev', text: 'I will test locally from now on...', emotion: 'thinking', type: 'thought' }
      ]
    }
  ]
});

writeFileSync('examples/output/whatsapp-incident.svg', strip);
console.log('✅ WhatsApp-style cartoon generated!');
console.log('📁 Saved to: examples/output/whatsapp-incident.svg\n');
console.log('💬 Features:');
console.log('   ✓ WhatsApp-style message bubbles');
console.log('   ✓ Left/right alignment based on character');
console.log('   ✓ Clean, readable chat interface');
console.log('   ✓ No overlapping elements');
console.log('   ✓ Professional appearance');
console.log('   ✓ Easy to follow narrative\n');
