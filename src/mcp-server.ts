#!/usr/bin/env node
/**
 * MCP Server for Tech SVG Generator
 * Exposes SVG generation capabilities via Model Context Protocol
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { generateSVG, detectScene, getAvailableScenes } from './generator.js';
import { generateCartoonStrip } from './cartoon.js';
import { generateFromYAML, generateFromJSON } from './parser.js';
import { generateSequenceDiagram } from './sequence.js';
import { generateFlowchart } from './flowchart.js';
import { getCharacterPresets, getEmotions } from './characters.js';
import { THEMES } from './themes.js';

const server = new Server(
  {
    name: 'tech-svg-generator',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'generate_tech_illustration',
        description: 'Generate a technical SVG illustration based on a title/topic. Auto-detects the best scene type (architecture, database, deployment, security, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'The title or topic for the illustration (e.g., "Database Replication", "CI/CD Pipeline")',
            },
            content: {
              type: 'string',
              description: 'Optional additional content for better scene detection',
            },
            scene: {
              type: 'string',
              description: 'Force a specific scene type',
              enum: getAvailableScenes(),
            },
            theme: {
              type: 'string',
              description: 'Color theme',
              enum: Object.keys(THEMES),
            },
            width: { type: 'number', description: 'SVG width (default: 700)' },
            height: { type: 'number', description: 'SVG height (default: 420)' },
          },
          required: ['title'],
        },
      },
      {
        name: 'generate_cartoon_strip',
        description: 'Generate a comic-style cartoon strip with characters having conversations. Great for explaining concepts, showing dialogues, or creating fun technical content.',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Title of the cartoon strip' },
            characters: {
              type: 'object',
              description: 'Character definitions. Keys are IDs, values have name and preset.',
              additionalProperties: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  preset: { 
                    type: 'string',
                    enum: getCharacterPresets(),
                  },
                },
                required: ['name'],
              },
            },
            panels: {
              type: 'array',
              description: 'Array of panels with characters and dialogue',
              items: {
                type: 'object',
                properties: {
                  characters: { type: 'array', items: { type: 'string' } },
                  caption: { type: 'string' },
                  dialogue: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        character: { type: 'string' },
                        text: { type: 'string' },
                        emotion: { type: 'string', enum: getEmotions() },
                        type: { type: 'string', enum: ['speech', 'thought', 'shout'] },
                      },
                      required: ['character', 'text'],
                    },
                  },
                },
                required: ['characters', 'dialogue'],
              },
            },
            layout: { type: 'string', description: 'Grid layout (auto, 2x1, 2x2, 3x1, etc.)' },
            theme: { type: 'string', enum: Object.keys(THEMES) },
            width: { type: 'number' },
            height: { type: 'number' },
          },
          required: ['characters', 'panels'],
        },
      },
      {
        name: 'generate_sequence_diagram',
        description: 'Generate a UML-style sequence diagram showing interactions between participants (services, actors, databases, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Diagram title' },
            participants: {
              type: 'array',
              description: 'List of participants in the sequence',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'Unique identifier' },
                  name: { type: 'string', description: 'Display name' },
                  type: { 
                    type: 'string', 
                    enum: ['actor', 'service', 'database', 'queue', 'external'],
                    description: 'Participant type affects the icon',
                  },
                },
                required: ['id', 'name'],
              },
            },
            messages: {
              type: 'array',
              description: 'Messages/calls between participants',
              items: {
                type: 'object',
                properties: {
                  from: { type: 'string', description: 'Source participant ID' },
                  to: { type: 'string', description: 'Target participant ID' },
                  text: { type: 'string', description: 'Message label' },
                  type: { 
                    type: 'string', 
                    enum: ['sync', 'async', 'reply', 'self'],
                    description: 'Message type affects arrow style',
                  },
                  note: { type: 'string', description: 'Optional note below message' },
                },
                required: ['from', 'to', 'text'],
              },
            },
            theme: { type: 'string', enum: Object.keys(THEMES) },
            width: { type: 'number' },
            height: { type: 'number' },
          },
          required: ['participants', 'messages'],
        },
      },
      {
        name: 'generate_from_yaml',
        description: 'Generate SVG from a YAML description. Supports both scene illustrations and cartoon strips.',
        inputSchema: {
          type: 'object',
          properties: {
            yaml: {
              type: 'string',
              description: 'YAML string describing the scene or cartoon. Use type: scene or type: cartoon.',
            },
          },
          required: ['yaml'],
        },
      },
      {
        name: 'generate_flowchart',
        description: 'Generate a flowchart or decision tree diagram with various node types (start, end, process, decision, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Flowchart title' },
            nodes: {
              type: 'array',
              description: 'List of nodes in the flowchart',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'Unique node ID' },
                  type: { 
                    type: 'string', 
                    enum: ['start', 'end', 'process', 'decision', 'io', 'subprocess', 'database', 'delay'],
                  },
                  label: { type: 'string', description: 'Node label' },
                  sublabel: { type: 'string', description: 'Optional sublabel' },
                },
                required: ['id', 'type', 'label'],
              },
            },
            edges: {
              type: 'array',
              description: 'Connections between nodes',
              items: {
                type: 'object',
                properties: {
                  from: { type: 'string', description: 'Source node ID' },
                  to: { type: 'string', description: 'Target node ID' },
                  label: { type: 'string', description: 'Edge label' },
                  type: { type: 'string', enum: ['default', 'yes', 'no', 'error'] },
                },
                required: ['from', 'to'],
              },
            },
            direction: { type: 'string', enum: ['TB', 'LR'], description: 'Layout direction (TB=top-bottom, LR=left-right)' },
            theme: { type: 'string', enum: Object.keys(THEMES) },
            width: { type: 'number' },
            height: { type: 'number' },
          },
          required: ['nodes', 'edges'],
        },
      },
      {
        name: 'generate_from_json',
        description: 'Generate SVG from a JSON description. Supports both scene illustrations and cartoon strips.',
        inputSchema: {
          type: 'object',
          properties: {
            json: {
              type: 'string',
              description: 'JSON string describing the scene or cartoon.',
            },
          },
          required: ['json'],
        },
      },
      {
        name: 'detect_scene',
        description: 'Detect the best scene type for a given title/content without generating SVG.',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Title to analyze' },
            content: { type: 'string', description: 'Additional content' },
          },
          required: ['title'],
        },
      },
      {
        name: 'list_resources',
        description: 'List available themes, scenes, character presets, and emotions.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'generate_tech_illustration': {
        const { title, content, scene, theme, width, height } = args as any;
        const result = generateSVG(title, content || '', { scene, theme, width, height });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                svg: result.svg,
                scene: result.scene,
                width: result.width,
                height: result.height,
              }),
            },
          ],
        };
      }

      case 'generate_cartoon_strip': {
        const svg = generateCartoonStrip(args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify({ svg }) }],
        };
      }

      case 'generate_sequence_diagram': {
        const svg = generateSequenceDiagram(args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify({ svg }) }],
        };
      }

      case 'generate_flowchart': {
        const svg = generateFlowchart(args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify({ svg }) }],
        };
      }

      case 'generate_from_yaml': {
        const { yaml } = args as any;
        const svg = generateFromYAML(yaml);
        return {
          content: [{ type: 'text', text: JSON.stringify({ svg }) }],
        };
      }

      case 'generate_from_json': {
        const { json } = args as any;
        const svg = generateFromJSON(json);
        return {
          content: [{ type: 'text', text: JSON.stringify({ svg }) }],
        };
      }

      case 'detect_scene': {
        const { title, content } = args as any;
        const scene = detectScene(title, content || '');
        return {
          content: [{ type: 'text', text: JSON.stringify({ scene }) }],
        };
      }

      case 'list_resources': {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                themes: Object.keys(THEMES),
                scenes: getAvailableScenes(),
                characterPresets: getCharacterPresets(),
                emotions: getEmotions(),
                participantTypes: ['actor', 'service', 'database', 'queue', 'external'],
                messageTypes: ['sync', 'async', 'reply', 'self'],
                speechTypes: ['speech', 'thought', 'shout'],
              }),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Tech SVG Generator MCP Server running on stdio');
}

main().catch(console.error);
