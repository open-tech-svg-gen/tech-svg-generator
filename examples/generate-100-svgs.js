/**
 * Generate 100 diverse SVGs and analyze them for issues
 */

import { 
  generateSVG, 
  generateCartoonStrip, 
  generateSequenceDiagram, 
  generateFlowchart,
  generateFromYAML,
  addAnimations,
  ANIMATION_PRESETS
} from '../dist/index.js';
import fs from 'fs';
import path from 'path';

const outputDir = './examples/output/analysis';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const issues = [];
const results = [];

function analyze(svg, name, type) {
  const result = { name, type, issues: [], warnings: [] };
  
  // Check basic SVG validity
  if (!svg.includes('<?xml') && !svg.includes('<svg')) {
    result.issues.push('Missing XML declaration or SVG tag');
  }

  if (!svg.includes('</svg>')) {
    result.issues.push('Missing closing SVG tag');
  }
  
  // Check for common SVG issues
  if (svg.includes('NaN')) {
    result.issues.push('Contains NaN values');
  }
  // Check for undefined - but ignore if it's in text content (like error messages)
  // Look for undefined in attributes like fill="undefined" or as raw value
  if (svg.match(/\s(?:x|y|cx|cy|r|rx|ry|width|height|fill|stroke|d)="undefined"|=undefined\b/)) {
    result.issues.push('Contains undefined values in SVG attributes');
  }
  if (svg.includes('null')) {
    result.warnings.push('Contains null string');
  }
  
  // Check for empty/broken elements
  const emptyGroups = (svg.match(/<g[^>]*>\s*<\/g>/g) || []).length;
  if (emptyGroups > 3) {
    result.warnings.push(`${emptyGroups} empty group elements`);
  }
  
  // Check text truncation issues - look for "..." that's not part of JSON or code
  if (svg.includes('...') && svg.includes('text') && !svg.includes('[...]')) {
    result.warnings.push('Text truncation detected');
  }
  
  // Check for overlapping coordinates (potential layout issues)
  const transforms = svg.match(/transform="translate\(([^)]+)\)"/g) || [];
  const positions = transforms.map(t => {
    const match = t.match(/translate\(([^,]+),?\s*([^)]*)\)/);
    return match ? { x: parseFloat(match[1]), y: parseFloat(match[2] || 0) } : null;
  }).filter(Boolean);

  // Check for negative coordinates outside of ANY group (potential clipping)
  // Negative coords inside groups are fine (relative positioning)
  const lines = svg.split('\n');
  let groupDepth = 0;
  let negativeOutsideGroup = 0;
  
  lines.forEach(line => {
    // Count opening groups
    const openGroups = (line.match(/<g[^>]*>/g) || []).length;
    groupDepth += openGroups;
    
    // Count closing groups
    const closeGroups = (line.match(/<\/g>/g) || []).length;
    groupDepth = Math.max(0, groupDepth - closeGroups);
    
    // Check for negative coords only when NOT in any group
    if (groupDepth === 0 && line.match(/<(?!g)[^>]*[xy]="-\d+/)) {
      negativeOutsideGroup++;
    }
  });
  
  if (negativeOutsideGroup > 0) {
    result.warnings.push(`Negative coordinates outside groups: ${negativeOutsideGroup}`);
  }
  
  // Check viewBox
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  if (!viewBoxMatch) {
    result.issues.push('Missing viewBox');
  }
  
  // Check for proper escaping - look for & not followed by amp; gt; lt; quot; apos; or #
  const unescapedAmp = svg.match(/&(?!(amp|gt|lt|quot|apos|#);)/g);
  if (unescapedAmp && unescapedAmp.length > 0) {
    result.warnings.push(`Unescaped ampersands: ${unescapedAmp.length}`);
  }
  
  // File size check
  const sizeKB = Buffer.byteLength(svg, 'utf8') / 1024;
  if (sizeKB > 100) {
    result.warnings.push(`Large file size: ${sizeKB.toFixed(1)}KB`);
  }
  
  result.sizeKB = sizeKB.toFixed(2);
  result.valid = result.issues.length === 0;
  
  return result;
}

// Test data generators
const titles = [
  'Microservices Architecture',
  'Database Replication',
  'CI/CD Pipeline',
  'OAuth2 Authentication',
  'Kubernetes Deployment',
  'API Gateway Pattern',
  'Event-Driven Architecture',
  'Load Balancer Setup',
  'Redis Cache Layer',
  'GraphQL Federation',
  'Zero Trust Security',
  'Monitoring Dashboard',
  'Error Handling Flow',
  'Test Coverage Report',
  'Performance Optimization',
  'React Component Tree',
  'Docker Compose Setup',
  'AWS Lambda Functions',
  'Message Queue System',
  'Service Mesh Pattern'
];

const themes = ['github-dark', 'dracula', 'nord', 'one-dark'];
const emotions = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'thinking', 'excited', 'confused', 'skeptical'];
const presets = ['alex', 'sam', 'jordan', 'casey', 'riley', 'morgan', 'taylor', 'robot'];

console.log('Generating 100 SVGs...\n');

// 1-20: Technical illustrations with various themes
for (let i = 0; i < 20; i++) {
  const title = titles[i % titles.length];
  const theme = themes[i % themes.length];
  try {
    const result = generateSVG(title, '', { theme, width: 700 + (i * 10), height: 420 + (i * 5) });
    const analysis = analyze(result.svg, `illustration-${i+1}`, 'illustration');
    results.push(analysis);
    fs.writeFileSync(`${outputDir}/illustration-${i+1}.svg`, result.svg);
  } catch (e) {
    results.push({ name: `illustration-${i+1}`, type: 'illustration', issues: [`Error: ${e.message}`], valid: false });
  }
}
console.log('✓ Generated 20 technical illustrations');

// 21-40: Cartoon strips with various configurations
for (let i = 0; i < 20; i++) {
  const numPanels = (i % 4) + 1;
  const numChars = (i % 3) + 1;
  const chars = {};
  for (let c = 0; c < numChars; c++) {
    chars[`char${c}`] = { name: `Character ${c}`, preset: presets[c % presets.length] };
  }
  
  const panels = [];
  for (let p = 0; p < numPanels; p++) {
    const charIds = Object.keys(chars).slice(0, Math.min(2, numChars));
    panels.push({
      characters: charIds,
      caption: p === 0 ? 'Scene ' + (p + 1) : undefined,
      dialogue: charIds.map((cid, idx) => ({
        character: cid,
        text: `This is dialogue ${idx + 1} for panel ${p + 1}. Testing longer text here.`,
        emotion: emotions[(i + p + idx) % emotions.length],
        type: idx === 0 ? 'speech' : (p % 3 === 0 ? 'thought' : 'speech')
      }))
    });
  }
  
  try {
    const svg = generateCartoonStrip({
      title: `Cartoon Strip ${i + 1}`,
      characters: chars,
      panels,
      theme: themes[i % themes.length],
      layout: numPanels > 2 ? '2x2' : `${numPanels}x1`
    });
    const analysis = analyze(svg, `cartoon-${i+1}`, 'cartoon');
    results.push(analysis);
    fs.writeFileSync(`${outputDir}/cartoon-${i+1}.svg`, svg);
  } catch (e) {
    results.push({ name: `cartoon-${i+1}`, type: 'cartoon', issues: [`Error: ${e.message}`], valid: false });
  }
}
console.log('✓ Generated 20 cartoon strips');

// 41-60: Sequence diagrams with various configurations
const participantTypes = ['actor', 'service', 'database', 'queue', 'external'];
const messageTypes = ['sync', 'async', 'reply', 'self'];

for (let i = 0; i < 20; i++) {
  const numParticipants = (i % 5) + 2;
  const numMessages = (i % 8) + 3;
  
  const participants = [];
  for (let p = 0; p < numParticipants; p++) {
    participants.push({
      id: `p${p}`,
      name: `Participant ${p}`,
      type: participantTypes[p % participantTypes.length]
    });
  }
  
  const messages = [];
  for (let m = 0; m < numMessages; m++) {
    const fromIdx = m % numParticipants;
    let toIdx = (m + 1) % numParticipants;
    const msgType = messageTypes[m % messageTypes.length];
    
    if (msgType === 'self') toIdx = fromIdx;
    
    messages.push({
      from: `p${fromIdx}`,
      to: `p${toIdx}`,
      text: `Message ${m + 1}`,
      type: msgType,
      note: m % 3 === 0 ? `Note for message ${m + 1}` : undefined
    });
  }
  
  try {
    const svg = generateSequenceDiagram({
      title: `Sequence Diagram ${i + 1}`,
      participants,
      messages,
      theme: themes[i % themes.length],
      width: 800 + (i * 20),
      height: 600 + (numMessages * 30)
    });
    const analysis = analyze(svg, `sequence-${i+1}`, 'sequence');
    results.push(analysis);
    fs.writeFileSync(`${outputDir}/sequence-${i+1}.svg`, svg);
  } catch (e) {
    results.push({ name: `sequence-${i+1}`, type: 'sequence', issues: [`Error: ${e.message}`], valid: false });
  }
}
console.log('✓ Generated 20 sequence diagrams');

// 61-80: Flowcharts with various configurations
const nodeTypes = ['start', 'end', 'process', 'decision', 'io', 'subprocess', 'database', 'delay'];
const edgeTypes = ['default', 'yes', 'no', 'error'];

for (let i = 0; i < 20; i++) {
  const numNodes = (i % 6) + 4;
  const direction = i % 2 === 0 ? 'TB' : 'LR';
  
  const nodes = [];
  nodes.push({ id: 'start', type: 'start', label: 'Start' });
  
  for (let n = 1; n < numNodes - 1; n++) {
    const type = nodeTypes[(n + i) % nodeTypes.length];
    nodes.push({
      id: `n${n}`,
      type: type === 'start' || type === 'end' ? 'process' : type,
      label: `Step ${n}`,
      sublabel: n % 2 === 0 ? `Sublabel ${n}` : undefined
    });
  }
  nodes.push({ id: 'end', type: 'end', label: 'End' });
  
  const edges = [];
  edges.push({ from: 'start', to: 'n1' });
  
  for (let e = 1; e < numNodes - 2; e++) {
    const fromNode = nodes[e];
    if (fromNode.type === 'decision' && e < numNodes - 2) {
      edges.push({ from: `n${e}`, to: `n${e+1}`, label: 'Yes', type: 'yes' });
      if (e + 2 < numNodes - 1) {
        edges.push({ from: `n${e}`, to: `n${e+2}`, label: 'No', type: 'no' });
      } else {
        edges.push({ from: `n${e}`, to: 'end', label: 'No', type: 'no' });
      }
    } else {
      edges.push({ from: `n${e}`, to: `n${e+1}` });
    }
  }
  edges.push({ from: `n${numNodes-2}`, to: 'end' });

  try {
    const svg = generateFlowchart({
      title: `Flowchart ${i + 1}`,
      nodes,
      edges,
      direction,
      theme: themes[i % themes.length],
      width: 800 + (i * 15),
      height: 600 + (numNodes * 40)
    });
    const analysis = analyze(svg, `flowchart-${i+1}`, 'flowchart');
    results.push(analysis);
    fs.writeFileSync(`${outputDir}/flowchart-${i+1}.svg`, svg);
  } catch (e) {
    results.push({ name: `flowchart-${i+1}`, type: 'flowchart', issues: [`Error: ${e.message}`], valid: false });
  }
}
console.log('✓ Generated 20 flowcharts');

// 81-90: Edge cases and stress tests
const edgeCases = [
  { name: 'empty-title', fn: () => generateSVG('', '') },
  { name: 'very-long-title', fn: () => generateSVG('A'.repeat(200), '') },
  { name: 'special-chars', fn: () => generateSVG('Test <>&"\'', '') },
  { name: 'unicode', fn: () => generateSVG('测试 🚀 Тест', '') },
  { name: 'numbers-only', fn: () => generateSVG('12345', '') },
  { name: 'min-dimensions', fn: () => generateSVG('Test', '', { width: 100, height: 100 }) },
  { name: 'max-dimensions', fn: () => generateSVG('Test', '', { width: 2000, height: 1500 }) },
  { name: 'single-panel-cartoon', fn: () => generateCartoonStrip({
    characters: { a: { name: 'A', preset: 'alex' } },
    panels: [{ characters: ['a'], dialogue: [{ character: 'a', text: 'Hi' }] }]
  })},
  { name: 'empty-dialogue', fn: () => generateCartoonStrip({
    characters: { a: { name: 'A', preset: 'alex' } },
    panels: [{ characters: ['a'], dialogue: [] }]
  })},
  { name: 'many-characters', fn: () => generateCartoonStrip({
    characters: Object.fromEntries(presets.map((p, i) => [`c${i}`, { name: `Char ${i}`, preset: p }])),
    panels: [{ characters: presets.map((_, i) => `c${i}`).slice(0, 3), dialogue: [{ character: 'c0', text: 'Hi' }] }]
  })}
];

for (let i = 0; i < edgeCases.length; i++) {
  const { name, fn } = edgeCases[i];
  try {
    const result = fn();
    const svg = typeof result === 'string' ? result : result.svg;
    const analysis = analyze(svg, `edge-${name}`, 'edge-case');
    results.push(analysis);
    fs.writeFileSync(`${outputDir}/edge-${name}.svg`, svg);
  } catch (e) {
    results.push({ name: `edge-${name}`, type: 'edge-case', issues: [`Error: ${e.message}`], valid: false });
  }
}
console.log('✓ Generated 10 edge case tests');

// 91-100: Animation tests
const animationTests = [
  { name: 'fadeIn', config: { type: 'fadeIn' } },
  { name: 'pulse', config: { type: 'pulse', iterations: 0 } },
  { name: 'bounce', config: { type: 'bounce' } },
  { name: 'shake', config: { type: 'shake', iterations: 3 } },
  { name: 'glow', config: { type: 'glow', iterations: 0 } },
  { name: 'float', config: { type: 'float', iterations: 0 } },
  { name: 'spin', config: { type: 'spin', iterations: 0 } },
  { name: 'slideIn', config: { type: 'slideIn' } },
  { name: 'combined', config: ANIMATION_PRESETS.fadeInSequence },
  { name: 'all-presets', config: ANIMATION_PRESETS.gentlePulse }
];

for (let i = 0; i < animationTests.length; i++) {
  const { name, config } = animationTests[i];
  try {
    const base = generateSVG('Animation Test', '');
    const svg = addAnimations(base.svg, [
      { selector: '.card', config },
      { selector: 'rect', config: { ...config, delay: 0.2 } }
    ]);
    const analysis = analyze(svg, `animation-${name}`, 'animation');
    results.push(analysis);
    fs.writeFileSync(`${outputDir}/animation-${name}.svg`, svg);
  } catch (e) {
    results.push({ name: `animation-${name}`, type: 'animation', issues: [`Error: ${e.message}`], valid: false });
  }
}
console.log('✓ Generated 10 animation tests');

// Analysis summary
console.log('\n' + '='.repeat(60));
console.log('ANALYSIS SUMMARY');
console.log('='.repeat(60));

const byType = {};
const allIssues = [];
const allWarnings = [];

results.forEach(r => {
  if (!byType[r.type]) byType[r.type] = { total: 0, valid: 0, issues: 0, warnings: 0 };
  byType[r.type].total++;
  if (r.valid) byType[r.type].valid++;
  if (r.issues?.length) {
    byType[r.type].issues += r.issues.length;
    r.issues.forEach(issue => allIssues.push({ name: r.name, issue }));
  }
  if (r.warnings?.length) {
    byType[r.type].warnings += r.warnings.length;
    r.warnings.forEach(warning => allWarnings.push({ name: r.name, warning }));
  }
});

console.log('\nBy Type:');
Object.entries(byType).forEach(([type, stats]) => {
  console.log(`  ${type}: ${stats.valid}/${stats.total} valid, ${stats.issues} issues, ${stats.warnings} warnings`);
});

console.log(`\nTotal: ${results.filter(r => r.valid).length}/${results.length} valid`);

if (allIssues.length > 0) {
  console.log('\n' + '-'.repeat(60));
  console.log('ISSUES (must fix):');
  allIssues.forEach(({ name, issue }) => {
    console.log(`  ❌ ${name}: ${issue}`);
  });
}

if (allWarnings.length > 0) {
  console.log('\n' + '-'.repeat(60));
  console.log('WARNINGS (should review):');
  const warningCounts = {};
  allWarnings.forEach(({ name, warning }) => {
    warningCounts[warning] = (warningCounts[warning] || 0) + 1;
  });
  Object.entries(warningCounts).sort((a, b) => b[1] - a[1]).forEach(([warning, count]) => {
    console.log(`  ⚠️  ${warning}: ${count} occurrences`);
  });
}

// Save detailed report
fs.writeFileSync(`${outputDir}/analysis-report.json`, JSON.stringify({ results, byType, allIssues, allWarnings }, null, 2));
console.log(`\n✓ Detailed report saved to ${outputDir}/analysis-report.json`);
