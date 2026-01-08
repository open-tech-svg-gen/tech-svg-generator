/**
 * Tests for SVG primitive components
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  escapeHtml,
  icon,
  card,
  metric,
  status,
  arrow,
  codeSnippet,
  terminalBlock,
  titleBar,
} from './primitives.js';
import type { ThemeColors } from './themes.js';

// Mock theme colors for testing
const mockColors: ThemeColors = {
  bg: '#0d1117',
  card: '#161b22',
  elevated: '#21262d',
  border: '#30363d',
  text: '#e6edf3',
  muted: '#8b949e',
  dim: '#6e7681',
  blue: '#58a6ff',
  purple: '#a371f7',
  green: '#3fb950',
  cyan: '#39c5cf',
  orange: '#d29922',
  red: '#f85149',
  pink: '#f778ba',
};

describe('escapeHtml', () => {
  it('should escape ampersands', () => {
    assert.strictEqual(escapeHtml('foo & bar'), 'foo &amp; bar');
  });

  it('should escape less than signs', () => {
    assert.strictEqual(escapeHtml('a < b'), 'a &lt; b');
  });

  it('should escape greater than signs', () => {
    assert.strictEqual(escapeHtml('a > b'), 'a &gt; b');
  });

  it('should escape multiple special characters', () => {
    assert.strictEqual(escapeHtml('<script>alert("xss")</script>'), '&lt;script&gt;alert("xss")&lt;/script&gt;');
  });

  it('should handle null input', () => {
    assert.strictEqual(escapeHtml(null), '');
  });

  it('should handle undefined input', () => {
    assert.strictEqual(escapeHtml(undefined), '');
  });

  it('should handle empty string', () => {
    assert.strictEqual(escapeHtml(''), '');
  });

  it('should preserve normal text', () => {
    assert.strictEqual(escapeHtml('Hello World'), 'Hello World');
  });
});

describe('icon', () => {
  it('should render a valid icon', () => {
    const result = icon('server', 100, 100, 24, '#ffffff');
    assert.ok(result.includes('<g transform='));
    assert.ok(result.includes('<path'));
    assert.ok(result.includes('stroke="#ffffff"'));
  });

  it('should return empty string for unknown icon', () => {
    const result = icon('nonexistent-icon', 100, 100, 24, '#ffffff');
    assert.strictEqual(result, '');
  });

  it('should scale icon based on size parameter', () => {
    const result = icon('server', 100, 100, 48, '#ffffff');
    assert.ok(result.includes('scale(2)'));
  });

  it('should position icon correctly', () => {
    const result = icon('server', 200, 150, 24, '#ffffff');
    assert.ok(result.includes('translate(188, 138)'));
  });

  it('should use default size of 24', () => {
    const result = icon('server', 100, 100, undefined as any, '#ffffff');
    // Default size 24, scale should be 1
    assert.ok(result.includes('scale(1)'));
  });
});

describe('card', () => {
  it('should render a card with icon and label', () => {
    const result = card(50, 50, 120, 100, 'server', 'My Server', mockColors);
    assert.ok(result.includes('<rect'));
    assert.ok(result.includes('rx="12"'));
    assert.ok(result.includes('My Server'));
    assert.ok(result.includes(`fill="${mockColors.card}"`));
  });

  it('should use custom accent color when provided', () => {
    const result = card(50, 50, 120, 100, 'server', 'Server', mockColors, '#ff0000');
    assert.ok(result.includes('stroke="#ff0000"'));
  });

  it('should default to blue accent color', () => {
    const result = card(50, 50, 120, 100, 'server', 'Server', mockColors);
    assert.ok(result.includes(`stroke="${mockColors.blue}"`));
  });

  it('should render sublabel when provided', () => {
    const result = card(50, 50, 120, 100, 'server', 'Server', mockColors, undefined, 'v1.0.0');
    assert.ok(result.includes('v1.0.0'));
    assert.ok(result.includes(`fill="${mockColors.muted}"`));
  });

  it('should truncate long labels', () => {
    const result = card(50, 50, 120, 100, 'server', 'VeryLongServerName', mockColors);
    assert.ok(result.includes('VeryLongServ'));
    assert.ok(!result.includes('VeryLongServerName'));
  });

  it('should truncate long sublabels', () => {
    const result = card(50, 50, 120, 100, 'server', 'Server', mockColors, undefined, 'VeryLongSublabelText');
    assert.ok(result.includes('VeryLongSublabe'));
    assert.ok(!result.includes('VeryLongSublabelText'));
  });
});

describe('metric', () => {
  it('should render a metric box with label and value', () => {
    const result = metric(100, 100, 'Latency', '12', mockColors);
    assert.ok(result.includes('<rect'));
    assert.ok(result.includes('Latency'));
    assert.ok(result.includes('12'));
  });

  it('should include unit when provided', () => {
    const result = metric(100, 100, 'Latency', '12', mockColors, 'ms');
    assert.ok(result.includes('ms'));
  });

  it('should use custom accent color', () => {
    const result = metric(100, 100, 'Latency', '12', mockColors, '', '#ff0000');
    assert.ok(result.includes('fill="#ff0000"'));
  });

  it('should have fixed dimensions', () => {
    const result = metric(100, 100, 'Test', '42', mockColors);
    assert.ok(result.includes('width="110"'));
    assert.ok(result.includes('height="60"'));
  });

  it('should truncate long labels', () => {
    const result = metric(100, 100, 'VeryLongLabelName', '42', mockColors);
    assert.ok(result.includes('VeryLongLabe'));
  });
});


describe('status', () => {
  it('should render ok status with green color', () => {
    const result = status(100, 100, 'ok', 'All good', mockColors);
    assert.ok(result.includes(`fill="${mockColors.green}"`));
    assert.ok(result.includes('All good'));
  });

  it('should render warn status with orange color', () => {
    const result = status(100, 100, 'warn', 'Warning', mockColors);
    assert.ok(result.includes(`fill="${mockColors.orange}"`));
  });

  it('should render error status with red color', () => {
    const result = status(100, 100, 'error', 'Error occurred', mockColors);
    assert.ok(result.includes(`fill="${mockColors.red}"`));
  });

  it('should render info status with cyan color', () => {
    const result = status(100, 100, 'info', 'Information', mockColors);
    assert.ok(result.includes(`fill="${mockColors.cyan}"`));
  });

  it('should render circle indicator', () => {
    const result = status(100, 100, 'ok', 'Test', mockColors);
    assert.ok(result.includes('<circle'));
    assert.ok(result.includes('r="6"'));
  });

  it('should truncate long text', () => {
    const longText = 'This is a very long status message that should be truncated';
    const result = status(100, 100, 'ok', longText, mockColors);
    // Status truncates at 30 characters
    assert.ok(result.includes('This is a very long status mes'));
  });
});

describe('arrow', () => {
  it('should render an arrow between two points', () => {
    const result = arrow(100, 100, 200, 100, '#ffffff');
    assert.ok(result.includes('<line'));
    assert.ok(result.includes('x1="100"'));
    assert.ok(result.includes('y1="100"'));
    assert.ok(result.includes('x2="200"'));
    assert.ok(result.includes('y2="100"'));
  });

  it('should include arrow marker', () => {
    const result = arrow(100, 100, 200, 100, '#ffffff');
    assert.ok(result.includes('<marker'));
    assert.ok(result.includes('marker-end="url(#'));
  });

  it('should render label when provided', () => {
    const result = arrow(100, 100, 200, 100, '#ffffff', 'HTTP', false, mockColors);
    assert.ok(result.includes('HTTP'));
    assert.ok(result.includes('<rect'));
  });

  it('should render dashed line when dashed is true', () => {
    const result = arrow(100, 100, 200, 100, '#ffffff', '', true);
    assert.ok(result.includes('stroke-dasharray="6 4"'));
  });

  it('should not render dashed line when dashed is false', () => {
    const result = arrow(100, 100, 200, 100, '#ffffff', '', false);
    assert.ok(!result.includes('stroke-dasharray'));
  });

  it('should truncate long labels', () => {
    const result = arrow(100, 100, 200, 100, '#ffffff', 'VeryLongLabel', false, mockColors);
    assert.ok(result.includes('VeryLong'));
    assert.ok(!result.includes('VeryLongLabel'));
  });

  it('should use default colors when colors not provided', () => {
    const result = arrow(100, 100, 200, 100, '#ffffff', 'Test');
    assert.ok(result.includes('#161b22')); // default card bg
    assert.ok(result.includes('#8b949e')); // default muted
  });
});

describe('codeSnippet', () => {
  it('should render a code snippet block', () => {
    const lines = [
      { t: 'const x = 1;' },
      { t: 'const y = 2;' },
    ];
    const result = codeSnippet(50, 50, 300, 150, lines, mockColors);
    assert.ok(result.includes('<rect'));
    assert.ok(result.includes('const x = 1;'));
    assert.ok(result.includes('const y = 2;'));
  });

  it('should render window controls (traffic lights)', () => {
    const result = codeSnippet(50, 50, 300, 150, [], mockColors);
    assert.ok(result.includes(`fill="${mockColors.red}"`));
    assert.ok(result.includes(`fill="${mockColors.orange}"`));
    assert.ok(result.includes(`fill="${mockColors.green}"`));
  });

  it('should render title', () => {
    const result = codeSnippet(50, 50, 300, 150, [], mockColors, 'app.ts');
    assert.ok(result.includes('app.ts'));
  });

  it('should highlight lines with hl flag', () => {
    const lines = [
      { t: 'normal line' },
      { t: 'highlighted line', hl: true },
    ];
    const result = codeSnippet(50, 50, 300, 150, lines, mockColors);
    assert.ok(result.includes(`fill="${mockColors.cyan}"`));
  });

  it('should limit to 5 lines', () => {
    const lines = [
      { t: 'line 1' },
      { t: 'line 2' },
      { t: 'line 3' },
      { t: 'line 4' },
      { t: 'line 5' },
      { t: 'line 6' },
      { t: 'line 7' },
    ];
    const result = codeSnippet(50, 50, 300, 200, lines, mockColors);
    assert.ok(result.includes('line 5'));
    assert.ok(!result.includes('line 6'));
    assert.ok(!result.includes('line 7'));
  });

  it('should truncate long lines', () => {
    const lines = [
      { t: 'This is a very long line of code that should be truncated at some point' },
    ];
    const result = codeSnippet(50, 50, 300, 150, lines, mockColors);
    assert.ok(result.includes('This is a very long line of code'));
    assert.ok(!result.includes('truncated at some point'));
  });

  it('should truncate long titles', () => {
    const result = codeSnippet(50, 50, 300, 150, [], mockColors, 'very-long-filename-that-should-be-truncated.ts');
    // Title truncates at 20 characters
    assert.ok(result.includes('very-long-filename-t'));
    assert.ok(!result.includes('truncated.ts'));
  });
});

describe('terminalBlock', () => {
  it('should render a terminal block', () => {
    const lines = [
      { t: 'npm install' },
      { t: 'Done!' },
    ];
    const result = terminalBlock(50, 50, 300, 150, lines, mockColors);
    assert.ok(result.includes('<rect'));
    assert.ok(result.includes('$ terminal'));
    assert.ok(result.includes('npm install'));
  });

  it('should have green border', () => {
    const result = terminalBlock(50, 50, 300, 150, [], mockColors);
    assert.ok(result.includes(`stroke="${mockColors.green}"`));
  });

  it('should render error lines in red', () => {
    const lines = [
      { t: 'Error: something went wrong', err: true },
    ];
    const result = terminalBlock(50, 50, 300, 150, lines, mockColors);
    assert.ok(result.includes(`fill="${mockColors.red}"`));
  });

  it('should render success lines in green', () => {
    const lines = [
      { t: 'Success!', ok: true },
    ];
    const result = terminalBlock(50, 50, 300, 150, lines, mockColors);
    assert.ok(result.includes(`fill="${mockColors.green}"`));
  });

  it('should limit to 4 lines', () => {
    const lines = [
      { t: 'line 1' },
      { t: 'line 2' },
      { t: 'line 3' },
      { t: 'line 4' },
      { t: 'line 5' },
    ];
    const result = terminalBlock(50, 50, 300, 200, lines, mockColors);
    assert.ok(result.includes('line 4'));
    assert.ok(!result.includes('line 5'));
  });

  it('should truncate long lines', () => {
    const lines = [
      { t: 'This is a very long terminal line that should be truncated at some point' },
    ];
    const result = terminalBlock(50, 50, 300, 150, lines, mockColors);
    // Terminal truncates at 35 characters
    assert.ok(result.includes('This is a very long terminal line t'));
    assert.ok(!result.includes('truncated at some point'));
  });
});

describe('titleBar', () => {
  it('should render a title bar at the bottom', () => {
    const result = titleBar('Test Title', 700, 420, mockColors);
    assert.ok(result.includes('<rect'));
    assert.ok(result.includes('Test Title'));
  });

  it('should center the text', () => {
    const result = titleBar('Test', 700, 420, mockColors);
    assert.ok(result.includes('text-anchor="middle"'));
    assert.ok(result.includes('x="350"')); // width / 2
  });

  it('should wrap long text to multiple lines', () => {
    const longTitle = 'This is a very long title that should wrap to multiple lines because it exceeds the maximum characters per line';
    const result = titleBar(longTitle, 700, 420, mockColors);
    // Should have multiple text elements
    const textMatches = result.match(/<text/g);
    assert.ok(textMatches && textMatches.length >= 2);
  });

  it('should limit to 2 lines maximum', () => {
    const veryLongTitle = 'Word '.repeat(50);
    const result = titleBar(veryLongTitle, 700, 420, mockColors);
    const textMatches = result.match(/<text/g);
    assert.ok(textMatches && textMatches.length === 2);
  });

  it('should add ellipsis when truncating', () => {
    const veryLongTitle = 'Word '.repeat(50);
    const result = titleBar(veryLongTitle, 700, 420, mockColors);
    assert.ok(result.includes('...'));
  });

  it('should use card background and border colors', () => {
    const result = titleBar('Test', 700, 420, mockColors);
    assert.ok(result.includes(`fill="${mockColors.card}"`));
    assert.ok(result.includes(`stroke="${mockColors.border}"`));
  });
});
