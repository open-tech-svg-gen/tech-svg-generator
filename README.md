# Tech SVG Generator

Generate clean, professional SVG illustrations for technical content. Perfect for blogs, documentation, presentations, and README files.

[![CI](https://github.com/open-tech-svg-gen/tech-svg-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/open-tech-svg-gen/tech-svg-generator/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/tech-svg-generator)](https://www.npmjs.com/package/tech-svg-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/open-tech-svg-gen/tech-svg-generator/pulls)

## Features

- 🎨 **14 Scene Types** - Architecture, scaling, database, deployment, security, debugging, testing, performance, API, monitoring, frontend, success, error, and default
- 🗨️ **Cartoon Strips** - Generate comic-style strips with characters, emotions, and speech bubbles
- 📝 **YAML/JSON Support** - Define scenes and cartoons in declarative format
- 🔍 **Auto-Detection** - Automatically selects the best scene based on title keywords
- 🌙 **Multiple Themes** - GitHub Dark (default), Dracula, Nord, One Dark
- 👤 **6 Character Presets** - Diverse developer characters with customizable styles
- 😀 **9 Emotions** - Neutral, happy, sad, angry, surprised, thinking, confused, excited, worried
- 📦 **Minimal Dependencies** - Only js-yaml for YAML parsing
- 🖼️ **Consistent Style** - Professional, clean illustrations every time
- ✏️ **Monospace Fonts** - All text uses developer-friendly monospace fonts

## Installation

```bash
npm install tech-svg-generator
```

## Quick Start

```typescript
import { generateSVG } from 'tech-svg-generator';

// Auto-detect scene from title
const result = generateSVG('Database Replication Strategies');
console.log(result.svg);   // SVG string
console.log(result.scene); // 'database'

// Save to file
import fs from 'fs';
fs.writeFileSync('illustration.svg', result.svg);
```

## API

### `generateSVG(title, content?, options?)`

Generate an SVG illustration.

**Parameters:**
- `title` (string) - The title/topic for the illustration
- `content` (string, optional) - Additional content for better scene detection
- `options` (object, optional):
  - `width` (number) - SVG width (default: 700)
  - `height` (number) - SVG height (default: 420)
  - `theme` (string) - Theme name: 'github-dark', 'dracula', 'nord', 'one-dark'
  - `scene` (string) - Force a specific scene type

**Returns:** `GenerateResult`
- `svg` (string) - The generated SVG string
- `scene` (string) - The detected/used scene type
- `width` (number) - SVG width
- `height` (number) - SVG height

### `detectScene(title, content?)`

Detect the best scene type for given text.

```typescript
import { detectScene } from 'tech-svg-generator';

detectScene('Kubernetes Pod Scheduling'); // 'scaling'
detectScene('JWT Authentication Flow');   // 'security'
detectScene('React Performance Tips');    // 'frontend'
```

### `getAvailableScenes()`

Get list of all available scene types.

```typescript
import { getAvailableScenes } from 'tech-svg-generator';

console.log(getAvailableScenes());
// ['architecture', 'scaling', 'database', 'deployment', 'security', ...]
```

## Scene Types

| Scene | Keywords | Description |
|-------|----------|-------------|
| `architecture` | architecture, design, pattern, system, microservice | System architecture diagrams |
| `scaling` | scale, kubernetes, docker, cluster, load | Horizontal scaling visualization |
| `database` | database, sql, postgres, redis, cache | Database with replication |
| `deployment` | deploy, ci, cd, pipeline, release | CI/CD pipeline flow |
| `security` | security, auth, jwt, oauth, firewall | Security flow diagram |
| `debugging` | debug, bug, error, fix, trace | Code debugging scene |
| `testing` | test, jest, coverage, unit, e2e | Test results dashboard |
| `performance` | performance, optimize, latency, cpu | Performance metrics |
| `api` | api, rest, graphql, endpoint, http | API request/response |
| `monitoring` | monitor, metric, log, alert, grafana | Monitoring dashboard |
| `frontend` | frontend, react, vue, css, component | Web vitals metrics |
| `success` | success, complete, launch, shipped | Success celebration |
| `error` | fail, crash, outage, incident, 503 | Error/incident scene |
| `default` | - | Generic system overview |

## Themes

```typescript
import { generateSVG, THEMES } from 'tech-svg-generator';

// Use a specific theme
const result = generateSVG('API Gateway Design', '', { theme: 'dracula' });

// Available themes
console.log(Object.keys(THEMES)); // ['github-dark', 'dracula', 'nord', 'one-dark']
```

## Examples

### Blog Post Illustration

```typescript
import { generateSVG } from 'tech-svg-generator';
import fs from 'fs';

const posts = [
  'How Netflix Handles Database Sharding',
  'Implementing Zero Trust Security',
  'React Server Components Deep Dive',
];

posts.forEach((title, i) => {
  const { svg, scene } = generateSVG(title);
  fs.writeFileSync(`post-${i + 1}-${scene}.svg`, svg);
});
```

### Force Specific Scene

```typescript
const result = generateSVG('My Custom Topic', '', { scene: 'architecture' });
```

### Custom Dimensions

```typescript
const result = generateSVG('Wide Banner', '', { 
  width: 1200, 
  height: 300 
});
```

## Output Example

The generated SVGs feature:
- Clean, fixed-grid layouts with no overlapping elements
- Professional GitHub-inspired dark theme
- Contextual icons and metrics
- Multi-line title support for long titles
- Consistent monospace typography

## Cartoon Strips

Generate comic-style strips with characters having conversations!

### Quick Start

```typescript
import { generateCartoonStrip } from 'tech-svg-generator';
import fs from 'fs';

const svg = generateCartoonStrip({
  title: 'The Daily Standup',
  theme: 'github-dark',
  width: 800,
  height: 400,
  layout: '2x1',
  characters: {
    dev: { name: 'Developer', preset: 'dev1' },
    pm: { name: 'PM', preset: 'dev2' }
  },
  panels: [
    {
      characters: ['dev', 'pm'],
      caption: 'Monday morning...',
      dialogue: [
        { character: 'pm', text: 'How is the feature going?', emotion: 'neutral' },
        { character: 'dev', text: 'Almost done!', emotion: 'happy' }
      ]
    },
    {
      characters: ['dev', 'pm'],
      caption: 'Friday...',
      dialogue: [
        { character: 'dev', text: 'Shipped!', emotion: 'excited' },
        { character: 'pm', text: 'Great work!', emotion: 'happy' }
      ]
    }
  ]
});

fs.writeFileSync('standup.svg', svg);
```

### Character Presets

| Preset | Description |
|--------|-------------|
| `dev1` | Indigo hair, blue shirt, glasses |
| `dev2` | Purple curly hair, green shirt |
| `dev3` | Blonde long hair, red shirt, headphones |
| `dev4` | Dark spiky hair, indigo shirt |
| `dev5` | Pink short hair, purple shirt, hat |
| `robot` | Gray robot character |

### Emotions

Characters can express: `neutral`, `happy`, `sad`, `angry`, `surprised`, `thinking`, `confused`, `excited`, `worried`

### Speech Bubble Types

- `speech` (default) - Regular speech bubble
- `thought` - Cloud-style thought bubble
- `shout` - Spiky exclamation bubble

### Layout Options

- `auto` - Automatically arrange panels
- `1x2`, `2x1` - Single row/column
- `2x2` - 2x2 grid
- `3x1`, `1x3` - Three panels in row/column
- `2x3`, `3x2` - Six panel layouts

## YAML/JSON Scene Descriptions

Define scenes and cartoons in declarative YAML or JSON format!

### Scene from YAML

```typescript
import { generateFromYAML } from 'tech-svg-generator';

const yaml = `
type: scene
title: "Database Migration Strategy"
content: "PostgreSQL replication and failover"
scene: database
theme: github-dark
width: 700
height: 420
`;

const svg = generateFromYAML(yaml);
```

### Cartoon from YAML

```typescript
import { generateFromYAML } from 'tech-svg-generator';

const yaml = `
type: cartoon
title: "Code Review"
theme: dracula
layout: "2x1"

characters:
  alice:
    name: Alice
    preset: dev1
  bob:
    name: Bob
    preset: dev2

panels:
  - characters: [alice, bob]
    dialogue:
      - character: alice
        text: "Can you review my PR?"
        emotion: happy
      - character: bob
        text: "Sure!"
        emotion: neutral
`;

const svg = generateFromYAML(yaml);
```

### JSON Support

```typescript
import { generateFromJSON } from 'tech-svg-generator';

const json = JSON.stringify({
  type: 'cartoon',
  title: 'Debugging',
  characters: {
    dev: { name: 'Dev', preset: 'dev1' }
  },
  panels: [{
    characters: ['dev'],
    dialogue: [
      { character: 'dev', text: 'Found it!', emotion: 'excited' }
    ]
  }]
});

const svg = generateFromJSON(json);
```

## License

MIT © Satishkumar Dhule
