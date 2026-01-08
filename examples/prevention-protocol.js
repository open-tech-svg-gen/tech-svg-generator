/**
 * Prevention Protocol - Innovative Solutions
 * Unique and cutting-edge ways to prevent production incidents
 */

import { writeFileSync } from 'fs';
import { generateCartoonStrip } from '../dist/index.js';

console.log('🛡️ Generating Prevention Protocol cartoon strip...\n');

const strip = generateCartoonStrip({
  title: '🚀 The Prevention Protocol: Avoiding Disasters',
  theme: 'nord',
  width: 1400,
  height: 700,
  layout: '3x2',
  characters: {
    dev: { name: 'Dev', preset: 'alex' },
    ai: { name: 'AI Guard', preset: 'robot' },
    ops: { name: 'Ops', preset: 'sam' },
    qa: { name: 'QA', preset: 'jordan' },
    pm: { name: 'PM', preset: 'taylor' }
  },
  panels: [
    {
      characters: ['dev', 'ai'],
      caption: 'Solution 1: AI-Powered Pre-Deploy Analysis',
      dialogue: [
        { character: 'dev', text: 'Deploying my fix...', emotion: 'neutral' },
        { character: 'ai', text: 'ALERT: Syntax anomaly detected! Missing semicolon in line 47', emotion: 'thinking', type: 'shout' }
      ]
    },
    {
      characters: ['dev', 'qa'],
      caption: 'Solution 2: Mandatory Peer Review Bot',
      dialogue: [
        { character: 'dev', text: 'Ready to merge?', emotion: 'happy' },
        { character: 'qa', text: 'Bot + Human review required. Both passed! ✓', emotion: 'excited' }
      ]
    },
    {
      characters: ['ops'],
      caption: 'Solution 3: Canary Deployment (1% Traffic)',
      dialogue: [
        { character: 'ops', text: 'Rolling out to 1% first. Monitoring metrics...', emotion: 'thinking', type: 'thought' }
      ]
    },
    {
      characters: ['dev', 'ai'],
      caption: 'Solution 4: Real-time Behavior Anomaly Detection',
      dialogue: [
        { character: 'ai', text: 'Error rate spike detected! Auto-rollback initiated!', emotion: 'worried', type: 'shout' },
        { character: 'dev', text: 'Whoa! That was fast!', emotion: 'surprised' }
      ]
    },
    {
      characters: ['pm', 'ops', 'dev'],
      caption: 'Solution 5: Chaos Engineering + Feature Flags',
      dialogue: [
        { character: 'pm', text: 'Feature flag lets us disable instantly', emotion: 'happy' },
        { character: 'ops', text: 'And chaos tests found edge cases!', emotion: 'excited' },
        { character: 'dev', text: 'No more Friday deploys!', emotion: 'thinking' }
      ]
    },
    {
      characters: ['dev', 'ai', 'ops'],
      caption: 'Result: Zero Incidents! 🎉',
      dialogue: [
        { character: 'dev', text: 'Deploy with confidence!', emotion: 'excited' },
        { character: 'ai', text: 'All systems green', emotion: 'happy' },
        { character: 'ops', text: 'Smooth sailing!', emotion: 'happy' }
      ]
    }
  ]
});

writeFileSync('examples/output/prevention-protocol.svg', strip);
console.log('✅ Prevention Protocol cartoon generated!');
console.log('📁 Saved to: examples/output/prevention-protocol.svg\n');
console.log('🛡️ Innovative Solutions Shown:');
console.log('   1. AI-Powered Pre-Deploy Analysis');
console.log('      → Catches syntax errors, type mismatches before deployment');
console.log('   2. Mandatory Peer Review Bot');
console.log('      → Combines AI + human review for every change');
console.log('   3. Canary Deployment (1% Traffic)');
console.log('      → Gradual rollout to detect issues early');
console.log('   4. Real-time Behavior Anomaly Detection');
console.log('      → Auto-rollback on error rate spikes');
console.log('   5. Chaos Engineering + Feature Flags');
console.log('      → Test edge cases + instant disable capability\n');
