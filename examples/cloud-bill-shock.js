/**
 * Cloud Bill Shock Story - When someone forgets to stop instances
 * The $500,000 AWS bill nightmare
 */

import { writeFileSync } from 'fs';
import { generateCartoonStrip } from '../dist/index.js';

console.log('☁️ Generating Cloud Bill Shock Story...\n');

const strip = generateCartoonStrip({
  title: '☁️ The $500K AWS Bill Nightmare',
  theme: 'nord',
  width: 1200,
  height: 1000,
  layout: '2x4',
  characters: {
    dev: { name: 'Dev', preset: 'alex' },
    finance: { name: 'Finance', preset: 'taylor' },
    cto: { name: 'CTO', preset: 'casey' },
    ceo: { name: 'CEO', preset: 'sam' },
    devops: { name: 'DevOps', preset: 'jordan' },
    manager: { name: 'Manager', preset: 'riley' }
  },
  panels: [
    {
      characters: ['dev'],
      caption: 'Last Month',
      dialogue: [
        { character: 'dev', text: 'Testing with 100 GPUs!', emotion: 'excited' }
      ]
    },
    {
      characters: ['dev'],
      caption: 'Friday 5 PM',
      dialogue: [
        { character: 'dev', text: 'Cleanup on Monday...', emotion: 'happy' }
      ]
    },
    {
      characters: ['finance'],
      caption: 'This Month - Bill Arrives',
      dialogue: [
        { character: 'finance', text: '$500,000?!?!', emotion: 'surprised', type: 'shout' }
      ]
    },
    {
      characters: ['ceo', 'cto'],
      caption: 'Emergency Meeting',
      dialogue: [
        { character: 'ceo', text: 'HALF A MILLION?!', emotion: 'angry', type: 'shout' },
        { character: 'cto', text: 'Investigating...', emotion: 'worried' }
      ]
    },
    {
      characters: ['devops', 'dev'],
      caption: 'The Investigation',
      dialogue: [
        { character: 'devops', text: '100 GPUs running!', emotion: 'surprised' },
        { character: 'dev', text: 'For 30 days?!', emotion: 'worried', type: 'shout' }
      ]
    },
    {
      characters: ['dev', 'manager'],
      caption: 'The Confession',
      dialogue: [
        { character: 'dev', text: 'I forgot to stop...', emotion: 'sad' },
        { character: 'manager', text: 'Your bonus is gone', emotion: 'angry' }
      ]
    },
    {
      characters: ['cto'],
      caption: 'Damage Control',
      dialogue: [
        { character: 'cto', text: 'AWS credits please?', emotion: 'thinking' }
      ]
    },
    {
      characters: ['dev'],
      caption: 'New Policy',
      dialogue: [
        { character: 'dev', text: 'Auto-shutdown enabled!', emotion: 'thinking' }
      ]
    }
  ]
});

writeFileSync('examples/output/cloud-bill-shock.svg', strip);
console.log('✅ Cloud Bill Shock Story generated!');
console.log('📁 Saved to: examples/output/cloud-bill-shock.svg\n');
console.log('📖 Story Summary:');
console.log('   Panel 1: Dev spins up 100 GPU instances for testing');
console.log('   Panel 2: Leaves for weekend, plans to cleanup Monday');
console.log('   Panel 3: Finance discovers $500K AWS bill');
console.log('   Panel 4: CEO and CTO have emergency meeting');
console.log('   Panel 5: DevOps finds 100 GPUs running for 30 days');
console.log('   Panel 6: Dev confesses, loses bonus');
console.log('   Panel 7: CTO begs AWS for credits');
console.log('   Panel 8: Company enables auto-shutdown policy\n');
console.log('💸 Moral: Always set auto-shutdown on cloud resources!\n');
