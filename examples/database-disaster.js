/**
 * Database Disaster Story - When someone runs DELETE without WHERE
 * A classic enterprise horror story
 */

import { writeFileSync } from 'fs';
import { generateCartoonStrip } from '../dist/index.js';

console.log('💾 Generating Database Disaster Story...\n');

const strip = generateCartoonStrip({
  title: '💾 DELETE FROM production; -- The Horror',
  theme: 'dracula',
  width: 1200,
  height: 1000,
  layout: '2x4',
  characters: {
    dba: { name: 'DBA', preset: 'alex' },
    dev: { name: 'Dev', preset: 'sam' },
    pm: { name: 'PM', preset: 'taylor' },
    cto: { name: 'CTO', preset: 'casey' },
    support: { name: 'Support', preset: 'jordan' },
    intern: { name: 'Intern', preset: 'riley' }
  },
  panels: [
    {
      characters: ['intern'],
      caption: 'Friday 4:55 PM',
      dialogue: [
        { character: 'intern', text: 'Quick cleanup query...', emotion: 'happy' }
      ]
    },
    {
      characters: ['intern'],
      caption: '4:56 PM - Oops',
      dialogue: [
        { character: 'intern', text: 'WHERE clause?!', emotion: 'surprised', type: 'shout' }
      ]
    },
    {
      characters: ['dba'],
      caption: '4:57 PM - Monitoring Alert',
      dialogue: [
        { character: 'dba', text: '10M rows deleted?!', emotion: 'surprised', type: 'shout' }
      ]
    },
    {
      characters: ['support', 'pm'],
      caption: '5:00 PM - Chaos Begins',
      dialogue: [
        { character: 'support', text: 'Users screaming!', emotion: 'worried' },
        { character: 'pm', text: 'What happened?!', emotion: 'angry', type: 'shout' }
      ]
    },
    {
      characters: ['cto', 'dba'],
      caption: '5:15 PM - War Room',
      dialogue: [
        { character: 'cto', text: 'Backup status?', emotion: 'worried' },
        { character: 'dba', text: 'Last week...', emotion: 'sad' }
      ]
    },
    {
      characters: ['intern', 'dev'],
      caption: '5:30 PM - The Confession',
      dialogue: [
        { character: 'intern', text: 'I forgot WHERE', emotion: 'sad' },
        { character: 'dev', text: 'Classic rookie...', emotion: 'thinking' }
      ]
    },
    {
      characters: ['dba'],
      caption: '11:00 PM - Recovery',
      dialogue: [
        { character: 'dba', text: 'Restoring backup...', emotion: 'thinking' }
      ]
    },
    {
      characters: ['intern'],
      caption: 'Monday - New Rule',
      dialogue: [
        { character: 'intern', text: 'No prod access!', emotion: 'confused' }
      ]
    }
  ]
});

writeFileSync('examples/output/database-disaster.svg', strip);
console.log('✅ Database Disaster Story generated!');
console.log('📁 Saved to: examples/output/database-disaster.svg\n');
console.log('📖 Story Summary:');
console.log('   Panel 1: Intern runs a "quick cleanup query"');
console.log('   Panel 2: Realizes they forgot the WHERE clause');
console.log('   Panel 3: DBA sees 10 million rows deleted');
console.log('   Panel 4: Support and PM deal with angry users');
console.log('   Panel 5: CTO learns backup is a week old');
console.log('   Panel 6: Intern confesses the classic mistake');
console.log('   Panel 7: DBA works late to restore backup');
console.log('   Panel 8: Intern loses production database access\n');
console.log('💀 Moral: Always use WHERE clause. Always.\n');
