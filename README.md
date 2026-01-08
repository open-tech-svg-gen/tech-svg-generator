# Tech SVG Generator

Generate clean, professional SVG illustrations, cartoon strips, sequence diagrams, and flowcharts for technical content. Perfect for blogs, documentation, presentations, and AI-powered applications.

[![CI](https://github.com/open-tech-svg-gen/tech-svg-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/open-tech-svg-gen/tech-svg-generator/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@svg-gen/tech-svg-generator)](https://www.npmjs.com/package/@svg-gen/tech-svg-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ What's New in v2.0

- 🤖 **MCP Server** - Run as a Model Context Protocol server for AI integration
- 📊 **Sequence Diagrams** - UML-style sequence diagrams with multiple participant types
- 🔀 **Flowcharts** - Decision trees and process flows with auto-layout
- 🎬 **Animations** - CSS animations for SVG elements (fade, pulse, bounce, etc.)
- 🎨 **Enhanced Characters** - 8 unique presets with 9 emotions

## Features

- 🎨 **14 Scene Types** - Architecture, scaling, database, deployment, security, debugging, testing, performance, API, monitoring, frontend, success, error, and default
- 🗨️ **Cartoon Strips** - Comic-style strips with characters, emotions, and speech bubbles
- 📊 **Sequence Diagrams** - UML-style diagrams for API flows and interactions
- 🔀 **Flowcharts** - Decision trees and process flows
- 📝 **YAML/JSON Support** - Define diagrams in declarative format
- 🤖 **MCP Server** - AI integration via Model Context Protocol
- 🎬 **Animations** - CSS animations for dynamic SVGs
- 🌙 **Multiple Themes** - GitHub Dark, Dracula, Nord, One Dark

## Installation

```bash
npm install @svg-gen/tech-svg-generator
```

## Quick Start

```typescript
import { generateSVG, generateCartoonStrip, generateSequenceDiagram, generateFlowchart } from '@svg-gen/tech-svg-generator';

// Technical illustration (auto-detects scene)
const illustration = generateSVG('Database Replication Strategies');

// Cartoon strip
const cartoon = generateCartoonStrip({
  title: 'Code Review',
  characters: {
    dev: { name: 'Developer', preset: 'alex' },
    reviewer: { name: 'Reviewer', preset: 'sam' }
  },
  panels: [{
    characters: ['dev', 'reviewer'],
    dialogue: [
      { character: 'dev', text: 'Can you review my PR?', emotion: 'happy' },
      { character: 'reviewer', text: 'LGTM!', emotion: 'excited' }
    ]
  }]
});

// Sequence diagram
const sequence = generateSequenceDiagram({
  title: 'API Authentication Flow',
  participants: [
    { id: 'client', name: 'Client', type: 'actor' },
    { id: 'api', name: 'API Gateway', type: 'service' },
    { id: 'auth', name: 'Auth Service', type: 'service' },
    { id: 'db', name: 'Database', type: 'database' }
  ],
  messages: [
    { from: 'client', to: 'api', text: 'POST /login' },
    { from: 'api', to: 'auth', text: 'Validate credentials' },
    { from: 'auth', to: 'db', text: 'Query user' },
    { from: 'db', to: 'auth', text: 'User data', type: 'reply' },
    { from: 'auth', to: 'api', text: 'JWT token', type: 'reply' },
    { from: 'api', to: 'client', text: '200 OK + token', type: 'reply' }
  ]
});

// Flowchart
const flowchart = generateFlowchart({
  title: 'CI/CD Pipeline',
  nodes: [
    { id: 'start', type: 'start', label: 'Push' },
    { id: 'build', type: 'process', label: 'Build' },
    { id: 'test', type: 'process', label: 'Test' },
    { id: 'check', type: 'decision', label: 'Pass?' },
    { id: 'deploy', type: 'process', label: 'Deploy' },
    { id: 'end', type: 'end', label: 'Done' },
    { id: 'fail', type: 'end', label: 'Failed' }
  ],
  edges: [
    { from: 'start', to: 'build' },
    { from: 'build', to: 'test' },
    { from: 'test', to: 'check' },
    { from: 'check', to: 'deploy', label: 'Yes', type: 'yes' },
    { from: 'check', to: 'fail', label: 'No', type: 'no' },
    { from: 'deploy', to: 'end' }
  ]
});
```

## 🤖 MCP Server

Run as a Model Context Protocol server for AI integration (Claude, etc.):

### Configuration

Add to your MCP settings (e.g., `~/.kiro/settings/mcp.json`):

```json
{
  "mcpServers": {
    "tech-svg-generator": {
      "command": "npx",
      "args": ["@svg-gen/tech-svg-generator/mcp"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "tech-svg-generator": {
      "command": "tech-svg-mcp"
    }
  }
}
```

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `generate_tech_illustration` | Generate technical SVG from title/topic |
| `generate_cartoon_strip` | Create comic-style strips with characters |
| `generate_sequence_diagram` | UML sequence diagrams |
| `generate_flowchart` | Flowcharts and decision trees |
| `generate_from_yaml` | Generate from YAML description |
| `generate_from_json` | Generate from JSON description |
| `detect_scene` | Detect best scene type for content |
| `list_resources` | List available themes, presets, etc. |

## Sequence Diagrams

```typescript
import { generateSequenceDiagram } from '@svg-gen/tech-svg-generator';

const svg = generateSequenceDiagram({
  title: 'Order Processing',
  participants: [
    { id: 'user', name: 'User', type: 'actor' },
    { id: 'api', name: 'API', type: 'service' },
    { id: 'queue', name: 'Queue', type: 'queue' },
    { id: 'worker', name: 'Worker', type: 'service' },
    { id: 'db', name: 'Database', type: 'database' }
  ],
  messages: [
    { from: 'user', to: 'api', text: 'Create Order' },
    { from: 'api', to: 'queue', text: 'Enqueue', type: 'async' },
    { from: 'api', to: 'user', text: 'Order ID', type: 'reply' },
    { from: 'queue', to: 'worker', text: 'Process' },
    { from: 'worker', to: 'db', text: 'Save' },
    { from: 'worker', to: 'worker', text: 'Notify', type: 'self' }
  ],
  theme: 'github-dark'
});
```

### Participant Types

| Type | Description |
|------|-------------|
| `actor` | Human user (stick figure) |
| `service` | Service/API (rectangle) |
| `database` | Database (cylinder) |
| `queue` | Message queue (striped box) |
| `external` | External system (dashed) |

### Message Types

| Type | Description |
|------|-------------|
| `sync` | Synchronous call (solid arrow) |
| `async` | Asynchronous call (dashed arrow) |
| `reply` | Response (dashed, open arrow) |
| `self` | Self-call loop |

## Flowcharts

```typescript
import { generateFlowchart } from '@svg-gen/tech-svg-generator';

const svg = generateFlowchart({
  title: 'Error Handling',
  direction: 'TB', // or 'LR' for left-to-right
  nodes: [
    { id: 'start', type: 'start', label: 'Request' },
    { id: 'validate', type: 'process', label: 'Validate' },
    { id: 'valid', type: 'decision', label: 'Valid?' },
    { id: 'process', type: 'process', label: 'Process' },
    { id: 'error', type: 'io', label: 'Error Response' },
    { id: 'success', type: 'end', label: 'Success' }
  ],
  edges: [
    { from: 'start', to: 'validate' },
    { from: 'validate', to: 'valid' },
    { from: 'valid', to: 'process', label: 'Yes', type: 'yes' },
    { from: 'valid', to: 'error', label: 'No', type: 'no' },
    { from: 'process', to: 'success' }
  ]
});
```

### Node Types

| Type | Shape | Use Case |
|------|-------|----------|
| `start` | Oval (green) | Entry point |
| `end` | Oval (red) | Exit point |
| `process` | Rectangle | Action/step |
| `decision` | Diamond | Yes/No branch |
| `io` | Parallelogram | Input/Output |
| `subprocess` | Double-bordered rect | Sub-process |
| `database` | Cylinder | Data storage |
| `delay` | Half-rounded rect | Wait/delay |

## Cartoon Strips

Create comic-style strips with expressive characters:

```typescript
import { generateCartoonStrip } from '@svg-gen/tech-svg-generator';

const svg = generateCartoonStrip({
  title: 'The Bug Hunt',
  characters: {
    dev: { name: 'Alex', preset: 'alex' },
    qa: { name: 'Sam', preset: 'sam' },
    bot: { name: 'CI Bot', preset: 'robot' }
  },
  panels: [
    {
      characters: ['dev', 'qa'],
      caption: 'Monday morning...',
      dialogue: [
        { character: 'dev', text: 'The tests are passing!', emotion: 'happy' },
        { character: 'qa', text: 'Did you check prod?', emotion: 'skeptical' }
      ]
    },
    {
      characters: ['dev', 'bot'],
      dialogue: [
        { character: 'bot', text: 'Build failed', emotion: 'neutral' },
        { character: 'dev', text: 'WHAT?!', emotion: 'surprised', type: 'shout' }
      ]
    }
  ],
  layout: '2x1',
  theme: 'github-dark'
});
```

### Character Presets

| Preset | Description |
|--------|-------------|
| `alex` | Professional developer |
| `sam` | Friendly colleague |
| `jordan` | Tech lead |
| `casey` | Designer |
| `riley` | Junior dev |
| `morgan` | DevOps engineer |
| `taylor` | Product manager |
| `robot` | AI/Bot character |

### Emotions

`neutral`, `happy`, `sad`, `angry`, `surprised`, `thinking`, `excited`, `confused`, `skeptical`

### Speech Types

| Type | Style |
|------|-------|
| `speech` | Normal speech bubble |
| `thought` | Cloud-style thought bubble |
| `shout` | Spiky exclamation bubble |

## Animations

Add CSS animations to make SVGs dynamic:

```typescript
import { addAnimations, staggeredAnimation, ANIMATION_PRESETS } from '@svg-gen/tech-svg-generator';

// Add animations to existing SVG
const animatedSvg = addAnimations(svg, [
  { selector: '.card', config: { type: 'fadeIn', duration: 0.5, delay: 0 } },
  { selector: '.icon', config: { type: 'pulse', iterations: 0 } },
  { selector: '.arrow', config: { type: 'draw', duration: 1 } }
]);

// Create staggered animations for multiple elements
const configs = staggeredAnimation(ANIMATION_PRESETS.fadeInSequence, 5, 0.15);
// Returns 5 configs with delays: 0, 0.15, 0.3, 0.45, 0.6

// Use presets
const presets = {
  fadeInSequence: { type: 'fadeIn', duration: 0.5 },
  gentlePulse: { type: 'pulse', duration: 2, iterations: 0 },
  floatingElement: { type: 'float', duration: 3, iterations: 0 },
  attentionShake: { type: 'shake', duration: 0.5, iterations: 3 },
  glowingHighlight: { type: 'glow', duration: 1.5, iterations: 0 },
  spinningLoader: { type: 'spin', duration: 1, iterations: 0 },
  bounceIn: { type: 'bounce', duration: 0.6 }
};
```

### Animation Types

| Type | Effect |
|------|--------|
| `fadeIn` | Fade from transparent |
| `slideIn` | Slide up with fade |
| `pulse` | Scale up and down |
| `bounce` | Vertical bounce |
| `shake` | Horizontal shake |
| `glow` | Pulsing glow effect |
| `float` | Gentle floating motion |
| `spin` | 360° rotation |
| `draw` | SVG path drawing |
| `typewriter` | Text reveal |

## YAML/JSON Support

Define diagrams declaratively:

```typescript
import { generateFromYAML, generateFromJSON } from '@svg-gen/tech-svg-generator';

// From YAML
const yamlSvg = generateFromYAML(`
type: scene
title: Microservices Architecture
scene: architecture
theme: github-dark
width: 800
height: 500
`);

// Cartoon from YAML
const cartoonYaml = generateFromYAML(`
type: cartoon
title: Code Review
characters:
  dev:
    name: Developer
    preset: alex
  reviewer:
    name: Reviewer
    preset: sam
panels:
  - characters: [dev, reviewer]
    dialogue:
      - character: dev
        text: Can you review my PR?
        emotion: happy
      - character: reviewer
        text: LGTM!
        emotion: excited
`);

// From JSON
const jsonSvg = generateFromJSON(JSON.stringify({
  type: 'scene',
  title: 'Database Scaling',
  scene: 'database',
  theme: 'dracula'
}));
```

## Themes

Four built-in dark themes:

| Theme | Description |
|-------|-------------|
| `github-dark` | GitHub's dark theme (default) |
| `dracula` | Popular Dracula color scheme |
| `nord` | Arctic, north-bluish palette |
| `one-dark` | Atom One Dark inspired |

```typescript
import { generateSVG, THEMES, getTheme } from '@svg-gen/tech-svg-generator';

// Use theme by name
const svg = generateSVG('My Diagram', '', { theme: 'dracula' });

// Access theme colors
const theme = getTheme('nord');
console.log(theme.colors.blue); // #88C0D0

// List all themes
console.log(Object.keys(THEMES)); // ['github-dark', 'dracula', 'nord', 'one-dark']
```

## Technical Illustrations

Auto-detect scene type from title:

```typescript
import { generateSVG, detectScene, getAvailableScenes } from '@svg-gen/tech-svg-generator';

// Auto-detection
const result = generateSVG('Kubernetes Deployment Strategy');
console.log(result.scene); // 'scaling'

// Manual scene selection
const svg = generateSVG('My Custom Title', '', { scene: 'security' });

// Detect without generating
const scene = detectScene('OAuth2 Authentication Flow');
console.log(scene); // 'security'

// List all scenes
console.log(getAvailableScenes());
// ['architecture', 'scaling', 'database', 'deployment', 'security', 
//  'debugging', 'testing', 'performance', 'api', 'monitoring', 
//  'frontend', 'success', 'error', 'default']
```

## API Reference

### Core Functions

| Function | Description |
|----------|-------------|
| `generateSVG(title, content?, options?)` | Generate technical illustration |
| `generateCartoonStrip(config)` | Generate cartoon strip |
| `generateSequenceDiagram(config)` | Generate sequence diagram |
| `generateFlowchart(config)` | Generate flowchart |
| `generateFromYAML(yaml)` | Generate from YAML string |
| `generateFromJSON(json)` | Generate from JSON string |
| `detectScene(title, content?)` | Detect best scene type |
| `getAvailableScenes()` | List all scene types |
| `addAnimations(svg, animations)` | Add CSS animations |
| `getTheme(name?)` | Get theme by name |

### Types

```typescript
interface GenerateOptions {
  scene?: SceneType;
  theme?: string;
  width?: number;
  height?: number;
}

interface GenerateResult {
  svg: string;
  scene: SceneType;
  width: number;
  height: number;
}
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Satishkumar Dhule](https://github.com/satishkumar-dhule)
