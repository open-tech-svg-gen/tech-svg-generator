/**
 * MegaCorp Goofup Story - A hilarious tale of enterprise chaos
 * When a junior dev accidentally emails the entire company
 */

import { writeFileSync } from 'fs';
import { generateCartoonStrip } from '../dist/index.js';

console.log('🏢 Generating MegaCorp Goofup Story...\n');

const strip = generateCartoonStrip({
  title: '🏢 The Reply-All Apocalypse at MegaCorp',
  theme: 'github-dark',
  width: 1200,
  height: 1000,
  layout: '2x4',
  characters: {
    junior: { name: 'Junior Dev', preset: 'riley' },
    senior: { name: 'Senior Dev', preset: 'alex' },
    manager: { name: 'Manager', preset: 'taylor' },
    ceo: { name: 'CEO', preset: 'casey' },
    hr: { name: 'HR', preset: 'jordan' },
    it: { name: 'IT Guy', preset: 'sam' }
  },
  panels: [
    {
      characters: ['junior'],
      caption: 'Monday 9:00 AM',
      dialogue: [
        { character: 'junior', text: 'Forwarding this to my team...', emotion: 'happy' }
      ]
    },
    {
      characters: ['junior'],
      caption: '9:01 AM - The Mistake',
      dialogue: [
        { character: 'junior', text: 'Wait... ALL-STAFF?!', emotion: 'surprised', type: 'shout' }
      ]
    },
    {
      characters: ['senior', 'manager'],
      caption: '9:02 AM - Slack Explodes',
      dialogue: [
        { character: 'senior', text: '50,000 employees?!', emotion: 'surprised' },
        { character: 'manager', text: 'WHO DID THIS?!', emotion: 'angry', type: 'shout' }
      ]
    },
    {
      characters: ['ceo'],
      caption: '9:05 AM - CEO Office',
      dialogue: [
        { character: 'ceo', text: 'Why is my inbox on fire?', emotion: 'confused' }
      ]
    },
    {
      characters: ['hr', 'it'],
      caption: '9:10 AM - Crisis Mode',
      dialogue: [
        { character: 'hr', text: 'Reply-all storm!', emotion: 'worried' },
        { character: 'it', text: 'Server melting!', emotion: 'worried', type: 'shout' }
      ]
    },
    {
      characters: ['junior', 'senior'],
      caption: '9:15 AM - The Confession',
      dialogue: [
        { character: 'junior', text: 'It was me...', emotion: 'sad' },
        { character: 'senior', text: 'We know.', emotion: 'angry' }
      ]
    },
    {
      characters: ['ceo', 'junior'],
      caption: '10:00 AM - CEO Meeting',
      dialogue: [
        { character: 'ceo', text: 'You crashed email!', emotion: 'angry' },
        { character: 'junior', text: 'Sorry...', emotion: 'worried' }
      ]
    },
    {
      characters: ['junior'],
      caption: 'Tuesday - New Policy',
      dialogue: [
        { character: 'junior', text: 'Reply-all now disabled!', emotion: 'thinking' }
      ]
    }
  ]
});

writeFileSync('examples/output/mega-corp-goofup.svg', strip);
console.log('✅ MegaCorp Goofup Story generated!');
console.log('📁 Saved to: examples/output/mega-corp-goofup.svg\n');
console.log('📖 Story Summary:');
console.log('   Panel 1: Junior dev tries to forward an email');
console.log('   Panel 2: Realizes they hit "Reply All" to 50,000 employees');
console.log('   Panel 3: Senior dev and manager discover the chaos');
console.log('   Panel 4: CEO\'s inbox explodes');
console.log('   Panel 5: HR and IT scramble to contain the damage');
console.log('   Panel 6: Junior confesses to the crime');
console.log('   Panel 7: Awkward meeting with the CEO');
console.log('   Panel 8: Company disables Reply-All forever\n');
console.log('🎭 Characters: Junior Dev, Senior Dev, Manager, CEO, HR, IT Guy');
console.log('🏢 Setting: MegaCorp - 50,000 employees\n');
