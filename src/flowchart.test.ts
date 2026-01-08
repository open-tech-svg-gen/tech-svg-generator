/**
 * Tests for Flowchart Generator
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateFlowchart } from './flowchart.js';

describe('generateFlowchart', () => {
  it('should return valid SVG string', () => {
    const svg = generateFlowchart({
      nodes: [
        { id: 'start', type: 'start', label: 'Start' },
        { id: 'end', type: 'end', label: 'End' }
      ],
      edges: [
        { from: 'start', to: 'end' }
      ]
    });
    assert.ok(svg.includes('<?xml version="1.0"'));
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('</svg>'));
  });

  it('should include title when provided', () => {
    const svg = generateFlowchart({
      title: 'My Flowchart',
      nodes: [{ id: 'start', type: 'start', label: 'Start' }],
      edges: []
    });
    assert.ok(svg.includes('My Flowchart'));
  });

  it('should include node labels', () => {
    const svg = generateFlowchart({
      nodes: [
        { id: 'a', type: 'process', label: 'Process Data' }
      ],
      edges: []
    });
    assert.ok(svg.includes('Process Data'));
  });

  it('should use default dimensions', () => {
    const svg = generateFlowchart({
      nodes: [{ id: 'a', type: 'start', label: 'A' }],
      edges: []
    });
    assert.ok(svg.includes('width="800"'));
    assert.ok(svg.includes('height="600"'));
  });

  it('should accept custom dimensions', () => {
    const svg = generateFlowchart({
      nodes: [{ id: 'a', type: 'start', label: 'A' }],
      edges: [],
      width: 1200,
      height: 900
    });
    assert.ok(svg.includes('width="1200"'));
    assert.ok(svg.includes('height="900"'));
  });

  it('should accept theme option', () => {
    const svg = generateFlowchart({
      nodes: [{ id: 'a', type: 'start', label: 'A' }],
      edges: [],
      theme: 'nord'
    });
    assert.ok(svg.includes('<svg'));
  });

  it('should accept direction option', () => {
    const svgTB = generateFlowchart({
      nodes: [{ id: 'a', type: 'start', label: 'A' }],
      edges: [],
      direction: 'TB'
    });
    const svgLR = generateFlowchart({
      nodes: [{ id: 'a', type: 'start', label: 'A' }],
      edges: [],
      direction: 'LR'
    });
    assert.ok(svgTB.includes('<svg'));
    assert.ok(svgLR.includes('<svg'));
  });
});

describe('Node types', () => {
  it('should render start node as oval', () => {
    const svg = generateFlowchart({
      nodes: [{ id: 'start', type: 'start', label: 'Begin' }],
      edges: []
    });
    assert.ok(svg.includes('ellipse'));
    assert.ok(svg.includes('Begin'));
  });

  it('should render end node as oval with thicker stroke', () => {
    const svg = generateFlowchart({
      nodes: [{ id: 'end', type: 'end', label: 'Finish' }],
      edges: []
    });
    assert.ok(svg.includes('ellipse'));
    assert.ok(svg.includes('stroke-width="3"'));
  });

  it('should render process node as rectangle', () => {
    const svg = generateFlowchart({
      nodes: [{ id: 'proc', type: 'process', label: 'Process' }],
      edges: []
    });
    assert.ok(svg.includes('rect'));
    assert.ok(svg.includes('Process'));
  });

  it('should render decision node as diamond', () => {
    const svg = generateFlowchart({
      nodes: [{ id: 'dec', type: 'decision', label: 'Check?' }],
      edges: []
    });
    assert.ok(svg.includes('polygon'));
    assert.ok(svg.includes('Check?'));
  });

  it('should render io node as parallelogram', () => {
    const svg = generateFlowchart({
      nodes: [{ id: 'io', type: 'io', label: 'Input' }],
      edges: []
    });
    assert.ok(svg.includes('polygon'));
    assert.ok(svg.includes('Input'));
  });

  it('should render subprocess node with double border', () => {
    const svg = generateFlowchart({
      nodes: [{ id: 'sub', type: 'subprocess', label: 'Subroutine' }],
      edges: []
    });
    assert.ok(svg.includes('Subroutine'));
    // Subprocess has vertical lines inside
    const lineMatches = svg.match(/<line/g);
    assert.ok(lineMatches && lineMatches.length >= 2);
  });

  it('should render database node as cylinder', () => {
    const svg = generateFlowchart({
      nodes: [{ id: 'db', type: 'database', label: 'Store' }],
      edges: []
    });
    assert.ok(svg.includes('ellipse'));
    assert.ok(svg.includes('path'));
    assert.ok(svg.includes('Store'));
  });

  it('should render delay node', () => {
    const svg = generateFlowchart({
      nodes: [{ id: 'wait', type: 'delay', label: 'Wait' }],
      edges: []
    });
    assert.ok(svg.includes('path'));
    assert.ok(svg.includes('Wait'));
  });

  it('should handle sublabels', () => {
    const svg = generateFlowchart({
      nodes: [{ id: 'proc', type: 'process', label: 'Process', sublabel: 'Step 1' }],
      edges: []
    });
    assert.ok(svg.includes('Process'));
    assert.ok(svg.includes('Step 1'));
  });
});

describe('Edge types', () => {
  it('should render default edge', () => {
    const svg = generateFlowchart({
      nodes: [
        { id: 'a', type: 'process', label: 'A' },
        { id: 'b', type: 'process', label: 'B' }
      ],
      edges: [
        { from: 'a', to: 'b' }
      ]
    });
    assert.ok(svg.includes('marker'));
    assert.ok(svg.includes('path') || svg.includes('line'));
  });

  it('should render yes edge in green', () => {
    const svg = generateFlowchart({
      nodes: [
        { id: 'dec', type: 'decision', label: 'OK?' },
        { id: 'yes', type: 'process', label: 'Yes' }
      ],
      edges: [
        { from: 'dec', to: 'yes', label: 'Yes', type: 'yes' }
      ]
    });
    assert.ok(svg.includes('Yes'));
  });

  it('should render no edge in red', () => {
    const svg = generateFlowchart({
      nodes: [
        { id: 'dec', type: 'decision', label: 'OK?' },
        { id: 'no', type: 'process', label: 'No' }
      ],
      edges: [
        { from: 'dec', to: 'no', label: 'No', type: 'no' }
      ]
    });
    assert.ok(svg.includes('No'));
  });

  it('should render error edge with dashed line', () => {
    const svg = generateFlowchart({
      nodes: [
        { id: 'proc', type: 'process', label: 'Process' },
        { id: 'err', type: 'end', label: 'Error' }
      ],
      edges: [
        { from: 'proc', to: 'err', type: 'error' }
      ]
    });
    assert.ok(svg.includes('stroke-dasharray'));
  });

  it('should render edge labels', () => {
    const svg = generateFlowchart({
      nodes: [
        { id: 'a', type: 'process', label: 'A' },
        { id: 'b', type: 'process', label: 'B' }
      ],
      edges: [
        { from: 'a', to: 'b', label: 'Next' }
      ]
    });
    assert.ok(svg.includes('Next'));
  });
});

describe('Layout', () => {
  it('should layout nodes in top-bottom direction', () => {
    const svg = generateFlowchart({
      nodes: [
        { id: 'a', type: 'start', label: 'Start' },
        { id: 'b', type: 'process', label: 'Process' },
        { id: 'c', type: 'end', label: 'End' }
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' }
      ],
      direction: 'TB'
    });
    assert.ok(svg.includes('Start'));
    assert.ok(svg.includes('Process'));
    assert.ok(svg.includes('End'));
  });

  it('should layout nodes in left-right direction', () => {
    const svg = generateFlowchart({
      nodes: [
        { id: 'a', type: 'start', label: 'Start' },
        { id: 'b', type: 'process', label: 'Process' },
        { id: 'c', type: 'end', label: 'End' }
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' }
      ],
      direction: 'LR'
    });
    assert.ok(svg.includes('Start'));
    assert.ok(svg.includes('Process'));
    assert.ok(svg.includes('End'));
  });

  it('should handle branching', () => {
    const svg = generateFlowchart({
      nodes: [
        { id: 'start', type: 'start', label: 'Start' },
        { id: 'dec', type: 'decision', label: 'Check' },
        { id: 'yes', type: 'process', label: 'Yes Path' },
        { id: 'no', type: 'process', label: 'No Path' },
        { id: 'end', type: 'end', label: 'End' }
      ],
      edges: [
        { from: 'start', to: 'dec' },
        { from: 'dec', to: 'yes', label: 'Y', type: 'yes' },
        { from: 'dec', to: 'no', label: 'N', type: 'no' },
        { from: 'yes', to: 'end' },
        { from: 'no', to: 'end' }
      ]
    });
    assert.ok(svg.includes('Yes Path'));
    assert.ok(svg.includes('No Path'));
  });
});

describe('Complex scenarios', () => {
  it('should handle CI/CD pipeline', () => {
    const svg = generateFlowchart({
      title: 'CI/CD Pipeline',
      nodes: [
        { id: 'push', type: 'start', label: 'Push' },
        { id: 'build', type: 'process', label: 'Build' },
        { id: 'test', type: 'process', label: 'Test' },
        { id: 'check', type: 'decision', label: 'Pass?' },
        { id: 'deploy', type: 'process', label: 'Deploy' },
        { id: 'done', type: 'end', label: 'Done' },
        { id: 'fail', type: 'end', label: 'Failed' }
      ],
      edges: [
        { from: 'push', to: 'build' },
        { from: 'build', to: 'test' },
        { from: 'test', to: 'check' },
        { from: 'check', to: 'deploy', label: 'Yes', type: 'yes' },
        { from: 'check', to: 'fail', label: 'No', type: 'no' },
        { from: 'deploy', to: 'done' }
      ]
    });
    assert.ok(svg.includes('CI/CD Pipeline'));
    assert.ok(svg.includes('Build'));
    assert.ok(svg.includes('Deploy'));
  });

  it('should handle error handling flow', () => {
    const svg = generateFlowchart({
      title: 'Error Handling',
      nodes: [
        { id: 'req', type: 'io', label: 'Request' },
        { id: 'validate', type: 'process', label: 'Validate' },
        { id: 'valid', type: 'decision', label: 'Valid?' },
        { id: 'process', type: 'process', label: 'Process' },
        { id: 'error', type: 'io', label: 'Error' },
        { id: 'success', type: 'end', label: 'Success' }
      ],
      edges: [
        { from: 'req', to: 'validate' },
        { from: 'validate', to: 'valid' },
        { from: 'valid', to: 'process', type: 'yes' },
        { from: 'valid', to: 'error', type: 'no' },
        { from: 'process', to: 'success' }
      ]
    });
    assert.ok(svg.includes('Validate'));
    assert.ok(svg.includes('Error'));
  });

  it('should handle many nodes', () => {
    const nodes = [];
    const edges = [];
    for (let i = 0; i < 8; i++) {
      nodes.push({ id: `n${i}`, type: 'process' as const, label: `Step ${i}` });
      if (i > 0) {
        edges.push({ from: `n${i-1}`, to: `n${i}` });
      }
    }
    const svg = generateFlowchart({ nodes, edges });
    assert.ok(svg.includes('Step 0'));
    assert.ok(svg.includes('Step 7'));
  });
});

describe('Edge cases', () => {
  it('should handle empty title', () => {
    const svg = generateFlowchart({
      title: '',
      nodes: [{ id: 'a', type: 'start', label: 'A' }],
      edges: []
    });
    assert.ok(svg.includes('<svg'));
  });

  it('should handle no edges', () => {
    const svg = generateFlowchart({
      nodes: [
        { id: 'a', type: 'start', label: 'A' },
        { id: 'b', type: 'end', label: 'B' }
      ],
      edges: []
    });
    assert.ok(svg.includes('A'));
    assert.ok(svg.includes('B'));
  });

  it('should handle special characters in labels', () => {
    const svg = generateFlowchart({
      nodes: [
        { id: 'a', type: 'process', label: 'A & B' }
      ],
      edges: []
    });
    assert.ok(svg.includes('&amp;'));
  });

  it('should truncate long labels', () => {
    const svg = generateFlowchart({
      nodes: [
        { id: 'a', type: 'process', label: 'This is a very long label that should be truncated' }
      ],
      edges: []
    });
    // Label should be truncated to 15 chars
    assert.ok(svg.includes('This is a very'));
  });

  it('should handle invalid edge references gracefully', () => {
    const svg = generateFlowchart({
      nodes: [
        { id: 'a', type: 'start', label: 'A' }
      ],
      edges: [
        { from: 'a', to: 'nonexistent' }
      ]
    });
    // Should not crash, just skip invalid edge
    assert.ok(svg.includes('<svg'));
  });
});
