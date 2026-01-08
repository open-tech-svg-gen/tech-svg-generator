/**
 * Tests for Sequence Diagram Generator
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateSequenceDiagram } from './sequence.js';

describe('generateSequenceDiagram', () => {
  it('should return valid SVG string', () => {
    const svg = generateSequenceDiagram({
      participants: [
        { id: 'a', name: 'Client' },
        { id: 'b', name: 'Server' }
      ],
      messages: [
        { from: 'a', to: 'b', text: 'Request' }
      ]
    });
    assert.ok(svg.includes('<?xml version="1.0"'));
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('</svg>'));
  });

  it('should include title when provided', () => {
    const svg = generateSequenceDiagram({
      title: 'API Flow',
      participants: [{ id: 'a', name: 'Client' }],
      messages: []
    });
    assert.ok(svg.includes('API Flow'));
  });

  it('should include participant names', () => {
    const svg = generateSequenceDiagram({
      participants: [
        { id: 'client', name: 'Web Client' },
        { id: 'server', name: 'API Server' }
      ],
      messages: []
    });
    assert.ok(svg.includes('Web Client'));
    assert.ok(svg.includes('API Server'));
  });

  it('should include message text', () => {
    const svg = generateSequenceDiagram({
      participants: [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' }
      ],
      messages: [
        { from: 'a', to: 'b', text: 'POST /login' }
      ]
    });
    assert.ok(svg.includes('POST /login'));
  });

  it('should use default dimensions', () => {
    const svg = generateSequenceDiagram({
      participants: [{ id: 'a', name: 'A' }],
      messages: []
    });
    assert.ok(svg.includes('width="800"'));
  });

  it('should accept custom dimensions', () => {
    const svg = generateSequenceDiagram({
      participants: [{ id: 'a', name: 'A' }],
      messages: [],
      width: 1000,
      height: 800
    });
    assert.ok(svg.includes('width="1000"'));
  });

  it('should accept theme option', () => {
    const svg = generateSequenceDiagram({
      participants: [{ id: 'a', name: 'A' }],
      messages: [],
      theme: 'dracula'
    });
    assert.ok(svg.includes('<svg'));
  });
});

describe('Participant types', () => {
  it('should render actor type', () => {
    const svg = generateSequenceDiagram({
      participants: [{ id: 'user', name: 'User', type: 'actor' }],
      messages: []
    });
    assert.ok(svg.includes('participant'));
    assert.ok(svg.includes('User'));
  });

  it('should render service type', () => {
    const svg = generateSequenceDiagram({
      participants: [{ id: 'api', name: 'API', type: 'service' }],
      messages: []
    });
    assert.ok(svg.includes('API'));
  });

  it('should render database type', () => {
    const svg = generateSequenceDiagram({
      participants: [{ id: 'db', name: 'Database', type: 'database' }],
      messages: []
    });
    assert.ok(svg.includes('Database'));
    assert.ok(svg.includes('ellipse')); // Database uses ellipse for cylinder top
  });

  it('should render queue type', () => {
    const svg = generateSequenceDiagram({
      participants: [{ id: 'q', name: 'Queue', type: 'queue' }],
      messages: []
    });
    assert.ok(svg.includes('Queue'));
  });

  it('should render external type', () => {
    const svg = generateSequenceDiagram({
      participants: [{ id: 'ext', name: 'External', type: 'external' }],
      messages: []
    });
    assert.ok(svg.includes('External'));
    assert.ok(svg.includes('stroke-dasharray')); // External uses dashed border
  });

  it('should handle mixed participant types', () => {
    const svg = generateSequenceDiagram({
      participants: [
        { id: 'user', name: 'User', type: 'actor' },
        { id: 'api', name: 'API', type: 'service' },
        { id: 'db', name: 'DB', type: 'database' }
      ],
      messages: []
    });
    assert.ok(svg.includes('User'));
    assert.ok(svg.includes('API'));
    assert.ok(svg.includes('DB'));
  });
});

describe('Message types', () => {
  it('should render sync message', () => {
    const svg = generateSequenceDiagram({
      participants: [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' }
      ],
      messages: [
        { from: 'a', to: 'b', text: 'Call', type: 'sync' }
      ]
    });
    assert.ok(svg.includes('Call'));
    assert.ok(svg.includes('marker'));
  });

  it('should render async message with dashed line', () => {
    const svg = generateSequenceDiagram({
      participants: [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' }
      ],
      messages: [
        { from: 'a', to: 'b', text: 'Async', type: 'async' }
      ]
    });
    assert.ok(svg.includes('Async'));
    assert.ok(svg.includes('stroke-dasharray'));
  });

  it('should render reply message', () => {
    const svg = generateSequenceDiagram({
      participants: [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' }
      ],
      messages: [
        { from: 'b', to: 'a', text: 'Response', type: 'reply' }
      ]
    });
    assert.ok(svg.includes('Response'));
  });

  it('should render self message', () => {
    const svg = generateSequenceDiagram({
      participants: [
        { id: 'a', name: 'A' }
      ],
      messages: [
        { from: 'a', to: 'a', text: 'Process', type: 'self' }
      ]
    });
    assert.ok(svg.includes('Process'));
    assert.ok(svg.includes('path')); // Self-call uses path for loop
  });

  it('should handle message notes', () => {
    const svg = generateSequenceDiagram({
      participants: [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' }
      ],
      messages: [
        { from: 'a', to: 'b', text: 'Request', note: 'With auth token' }
      ]
    });
    assert.ok(svg.includes('Request'));
    assert.ok(svg.includes('With auth token'));
  });
});

describe('Lifelines', () => {
  it('should render lifelines for participants', () => {
    const svg = generateSequenceDiagram({
      participants: [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' }
      ],
      messages: [
        { from: 'a', to: 'b', text: 'Test' }
      ]
    });
    // Lifelines are dashed vertical lines
    const lifelineMatches = svg.match(/stroke-dasharray="4,4"/g);
    assert.ok(lifelineMatches && lifelineMatches.length >= 2);
  });
});

describe('Complex scenarios', () => {
  it('should handle authentication flow', () => {
    const svg = generateSequenceDiagram({
      title: 'Authentication Flow',
      participants: [
        { id: 'client', name: 'Client', type: 'actor' },
        { id: 'api', name: 'API Gateway', type: 'service' },
        { id: 'auth', name: 'Auth Service', type: 'service' },
        { id: 'db', name: 'User DB', type: 'database' }
      ],
      messages: [
        { from: 'client', to: 'api', text: 'POST /login' },
        { from: 'api', to: 'auth', text: 'Validate' },
        { from: 'auth', to: 'db', text: 'Query user' },
        { from: 'db', to: 'auth', text: 'User data', type: 'reply' },
        { from: 'auth', to: 'api', text: 'JWT token', type: 'reply' },
        { from: 'api', to: 'client', text: '200 OK', type: 'reply' }
      ]
    });
    assert.ok(svg.includes('Authentication Flow'));
    assert.ok(svg.includes('Client'));
    assert.ok(svg.includes('POST /login'));
    assert.ok(svg.includes('JWT token'));
  });

  it('should handle many participants', () => {
    const svg = generateSequenceDiagram({
      participants: [
        { id: 'a', name: 'Service A' },
        { id: 'b', name: 'Service B' },
        { id: 'c', name: 'Service C' },
        { id: 'd', name: 'Service D' },
        { id: 'e', name: 'Service E' }
      ],
      messages: [
        { from: 'a', to: 'b', text: 'M1' },
        { from: 'b', to: 'c', text: 'M2' },
        { from: 'c', to: 'd', text: 'M3' },
        { from: 'd', to: 'e', text: 'M4' }
      ]
    });
    assert.ok(svg.includes('Service A'));
    assert.ok(svg.includes('Service E'));
  });

  it('should handle many messages', () => {
    const messages = [];
    for (let i = 0; i < 10; i++) {
      messages.push({ from: 'a', to: 'b', text: `Message ${i}` });
    }
    const svg = generateSequenceDiagram({
      participants: [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' }
      ],
      messages
    });
    assert.ok(svg.includes('Message 0'));
    assert.ok(svg.includes('Message 9'));
  });
});

describe('Edge cases', () => {
  it('should handle empty title', () => {
    const svg = generateSequenceDiagram({
      title: '',
      participants: [{ id: 'a', name: 'A' }],
      messages: []
    });
    assert.ok(svg.includes('<svg'));
  });

  it('should handle no messages', () => {
    const svg = generateSequenceDiagram({
      participants: [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' }
      ],
      messages: []
    });
    assert.ok(svg.includes('A'));
    assert.ok(svg.includes('B'));
  });

  it('should handle special characters in text', () => {
    const svg = generateSequenceDiagram({
      participants: [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' }
      ],
      messages: [
        { from: 'a', to: 'b', text: 'GET /api?foo=bar&baz=1' }
      ]
    });
    assert.ok(svg.includes('&amp;')); // Escaped ampersand
  });

  it('should handle bidirectional messages', () => {
    const svg = generateSequenceDiagram({
      participants: [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' }
      ],
      messages: [
        { from: 'a', to: 'b', text: 'Request' },
        { from: 'b', to: 'a', text: 'Response', type: 'reply' }
      ]
    });
    assert.ok(svg.includes('Request'));
    assert.ok(svg.includes('Response'));
  });
});
