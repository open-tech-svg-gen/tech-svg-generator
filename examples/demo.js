/**
 * Demo script for tech-svg-generator
 * Run with: node examples/demo.js
 */

import { generateSVG, detectScene, getAvailableScenes, THEMES } from '../dist/index.js';
import fs from 'fs';
import path from 'path';

// Ensure output directory exists
const outputDir = path.join(import.meta.dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎨 Tech SVG Generator Demo\n');

// Show available scenes
console.log('Available scenes:', getAvailableScenes().join(', '));
console.log('Available themes:', Object.keys(THEMES).join(', '));
console.log('');

// Demo titles for each scene type
const demoTitles = [
  'Microservices Architecture Patterns',
  'Kubernetes Auto-Scaling Deep Dive',
  'PostgreSQL Replication Strategies',
  'CI/CD Pipeline Best Practices',
  'Zero Trust Security Implementation',
  'Debugging Memory Leaks in Node.js',
  'Unit Testing React Components',
  'Performance Optimization Techniques',
  'REST API Design Guidelines',
  'Observability and Monitoring Setup',
  'React Server Components Guide',
  'Successful Product Launch',
  'Incident Response: Database Outage',
  'System Overview Dashboard',
];

console.log('Generating illustrations...\n');

demoTitles.forEach((title, i) => {
  const detected = detectScene(title);
  const result = generateSVG(title);
  
  const filename = `${String(i + 1).padStart(2, '0')}-${result.scene}.svg`;
  const filepath = path.join(outputDir, filename);
  
  fs.writeFileSync(filepath, result.svg);
  console.log(`✅ ${filename} - "${title.substring(0, 40)}..."`);
});

console.log('\n📁 Output saved to:', outputDir);

// Generate theme comparison
console.log('\n🎨 Generating theme comparison...');
const themeTitle = 'System Architecture Overview';

Object.keys(THEMES).forEach(themeName => {
  const result = generateSVG(themeTitle, '', { theme: themeName });
  const filename = `theme-${themeName}.svg`;
  fs.writeFileSync(path.join(outputDir, filename), result.svg);
  console.log(`✅ ${filename}`);
});

console.log('\n✨ Demo complete!');
