/**
 * Tests for scene renderers
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SCENES } from './scenes.js';
import { getTheme } from './themes.js';
import type { SceneType } from './types.js';

const colors = getTheme('github-dark').colors;
const defaultWidth = 700;
const defaultHeight = 420;

describe('SCENES', () => {
  it('should be an object', () => {
    assert.strictEqual(typeof SCENES, 'object');
  });

  it('should have 14 scenes', () => {
    assert.strictEqual(Object.keys(SCENES).length, 14);
  });

  const expectedScenes: SceneType[] = [
    'architecture', 'scaling', 'database', 'deployment', 'security',
    'debugging', 'testing', 'performance', 'api', 'monitoring',
    'frontend', 'success', 'error', 'default'
  ];

  for (const sceneName of expectedScenes) {
    it(`should have ${sceneName} scene`, () => {
      assert.ok(SCENES[sceneName], `Missing scene: ${sceneName}`);
    });
  }
});

describe('Scene renderers', () => {
  for (const [sceneName, renderer] of Object.entries(SCENES)) {
    describe(`${sceneName} scene`, () => {
      it('should be a function', () => {
        assert.strictEqual(typeof renderer, 'function');
      });

      it('should return a string', () => {
        const result = renderer('Test Title', colors, defaultWidth, defaultHeight);
        assert.strictEqual(typeof result, 'string');
      });

      it('should return non-empty content', () => {
        const result = renderer('Test Title', colors, defaultWidth, defaultHeight);
        assert.ok(result.length > 0);
      });

      it('should include title bar', () => {
        const result = renderer('Test Title', colors, defaultWidth, defaultHeight);
        assert.ok(result.includes('Test Title'), `${sceneName} should include title`);
      });

      it('should include SVG elements', () => {
        const result = renderer('Test Title', colors, defaultWidth, defaultHeight);
        // Should contain at least one SVG element
        assert.ok(
          result.includes('<rect') || 
          result.includes('<text') || 
          result.includes('<circle') ||
          result.includes('<line') ||
          result.includes('<path'),
          `${sceneName} should include SVG elements`
        );
      });

      it('should use theme colors', () => {
        const result = renderer('Test Title', colors, defaultWidth, defaultHeight);
        // Should use at least one theme color
        const usesThemeColor = Object.values(colors).some(color => result.includes(color));
        assert.ok(usesThemeColor, `${sceneName} should use theme colors`);
      });

      it('should handle different dimensions', () => {
        const result = renderer('Test', colors, 800, 500);
        assert.ok(result.length > 0);
      });

      it('should handle long titles', () => {
        const longTitle = 'This is a very long title that should be handled properly by the scene renderer';
        const result = renderer(longTitle, colors, defaultWidth, defaultHeight);
        assert.ok(result.length > 0);
      });

      it('should handle special characters in title', () => {
        const specialTitle = 'Test <script> & "quotes"';
        const result = renderer(specialTitle, colors, defaultWidth, defaultHeight);
        // Should escape special characters
        assert.ok(!result.includes('<script>'));
        assert.ok(result.includes('&lt;script&gt;') || result.includes('&amp;'));
      });
    });
  }
});

describe('architecture scene', () => {
  it('should include client, server, and database cards', () => {
    const result = SCENES.architecture('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Client'));
    assert.ok(result.includes('Server'));
    assert.ok(result.includes('Database'));
  });

  it('should include arrows between components', () => {
    const result = SCENES.architecture('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('<line'));
    assert.ok(result.includes('marker-end'));
  });

  it('should include metrics', () => {
    const result = SCENES.architecture('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Latency'));
    assert.ok(result.includes('Uptime'));
  });

  it('should include status indicator', () => {
    const result = SCENES.architecture('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('operational'));
  });
});

describe('scaling scene', () => {
  it('should include load balancer card', () => {
    const result = SCENES.scaling('Test', colors, defaultWidth, defaultHeight);
    // The card label is truncated to 12 chars: "Load Balance"
    assert.ok(result.includes('Load Balance'));
  });

  it('should include multiple nodes', () => {
    const result = SCENES.scaling('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Node 1'));
    assert.ok(result.includes('Node 2'));
    assert.ok(result.includes('Node 3'));
    assert.ok(result.includes('Node 4'));
  });

  it('should include scaling metrics', () => {
    const result = SCENES.scaling('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('RPS'));
    assert.ok(result.includes('Nodes'));
    assert.ok(result.includes('CPU'));
  });
});

describe('database scene', () => {
  it('should include primary and replica', () => {
    const result = SCENES.database('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Primary'));
    assert.ok(result.includes('Replica'));
  });

  it('should include sync arrow', () => {
    const result = SCENES.database('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('sync'));
  });

  it('should include database metrics', () => {
    const result = SCENES.database('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('QPS'));
    assert.ok(result.includes('Connections'));
    assert.ok(result.includes('Cache Hit'));
  });
});

describe('deployment scene', () => {
  it('should include pipeline stages', () => {
    const result = SCENES.deployment('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Code'));
    assert.ok(result.includes('Build'));
    assert.ok(result.includes('Test'));
    assert.ok(result.includes('Deploy'));
  });

  it('should include deployment metrics', () => {
    const result = SCENES.deployment('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Coverage'));
    assert.ok(result.includes('Tests'));
  });
});

describe('security scene', () => {
  it('should include security components', () => {
    const result = SCENES.security('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Internet'));
    assert.ok(result.includes('Firewall'));
    assert.ok(result.includes('Auth'));
  });

  it('should include security protocols', () => {
    const result = SCENES.security('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('HTTPS'));
    assert.ok(result.includes('mTLS'));
  });

  it('should include security metrics', () => {
    const result = SCENES.security('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Blocked'));
    assert.ok(result.includes('Auth Rate'));
    assert.ok(result.includes('Threats'));
  });
});

describe('debugging scene', () => {
  it('should include code snippet', () => {
    const result = SCENES.debugging('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('debug.ts'));
    assert.ok(result.includes('async function'));
  });

  it('should include terminal with error', () => {
    const result = SCENES.debugging('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('TypeError'));
  });

  it('should include bug and fix cards', () => {
    const result = SCENES.debugging('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Bug Found'));
    assert.ok(result.includes('Fixed'));
  });
});

describe('testing scene', () => {
  it('should include test code snippet', () => {
    const result = SCENES.testing('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('api.test.ts'));
    assert.ok(result.includes('describe'));
  });

  it('should include test metrics', () => {
    const result = SCENES.testing('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Passed'));
    assert.ok(result.includes('Failed'));
    assert.ok(result.includes('Coverage'));
    assert.ok(result.includes('Duration'));
  });

  it('should include test type cards', () => {
    const result = SCENES.testing('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Unit'));
    assert.ok(result.includes('Integration'));
    assert.ok(result.includes('E2E'));
  });
});

describe('performance scene', () => {
  it('should include performance metrics', () => {
    const result = SCENES.performance('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('P99 Latency'));
    assert.ok(result.includes('RPS'));
    assert.ok(result.includes('Error Rate'));
    assert.ok(result.includes('CPU'));
  });

  it('should include terminal with profiling', () => {
    const result = SCENES.performance('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('perf analyze'));
    assert.ok(result.includes('Hotspot'));
    assert.ok(result.includes('Optimized'));
  });
});

describe('api scene', () => {
  it('should include request and response snippets', () => {
    const result = SCENES.api('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('request.http'));
    assert.ok(result.includes('response'));
    assert.ok(result.includes('GET /api'));
    assert.ok(result.includes('200 OK'));
  });

  it('should include API metrics', () => {
    const result = SCENES.api('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('RPS'));
    assert.ok(result.includes('P99'));
    assert.ok(result.includes('Errors'));
    assert.ok(result.includes('Cache'));
  });
});

describe('monitoring scene', () => {
  it('should include monitoring metrics', () => {
    const result = SCENES.monitoring('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Uptime'));
    assert.ok(result.includes('Alerts'));
    assert.ok(result.includes('P95'));
    assert.ok(result.includes('Memory'));
  });

  it('should include observability pillars', () => {
    const result = SCENES.monitoring('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Metrics'));
    assert.ok(result.includes('Traces'));
    assert.ok(result.includes('Logs'));
  });
});

describe('frontend scene', () => {
  it('should include web vitals', () => {
    const result = SCENES.frontend('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('LCP'));
    assert.ok(result.includes('FID'));
    assert.ok(result.includes('CLS'));
    assert.ok(result.includes('TTI'));
  });

  it('should include React code snippet', () => {
    const result = SCENES.frontend('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('App.tsx'));
    assert.ok(result.includes('Suspense'));
  });
});

describe('success scene', () => {
  it('should include success card', () => {
    const result = SCENES.success('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Success!'));
  });

  it('should include positive metrics', () => {
    const result = SCENES.success('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Uptime'));
    assert.ok(result.includes('Users'));
    assert.ok(result.includes('Revenue'));
    assert.ok(result.includes('NPS'));
  });

  it('should include success status indicators', () => {
    const result = SCENES.success('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('successful'));
    assert.ok(result.includes('Zero downtime'));
  });
});

describe('error scene', () => {
  it('should include incident card', () => {
    const result = SCENES.error('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Incident'));
  });

  it('should include error terminal', () => {
    const result = SCENES.error('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('OOMKilled'));
    assert.ok(result.includes('Memory limit'));
  });

  it('should include error metrics', () => {
    const result = SCENES.error('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('503'));
    assert.ok(result.includes('Errors'));
    assert.ok(result.includes('MTTR'));
  });

  it('should include error status', () => {
    const result = SCENES.error('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('degraded'));
  });
});

describe('default scene', () => {
  it('should include system card', () => {
    const result = SCENES.default('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('System'));
  });

  it('should include general metrics', () => {
    const result = SCENES.default('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('Requests'));
    assert.ok(result.includes('Latency'));
    assert.ok(result.includes('Errors'));
    assert.ok(result.includes('Uptime'));
  });

  it('should include operational status', () => {
    const result = SCENES.default('Test', colors, defaultWidth, defaultHeight);
    assert.ok(result.includes('operational'));
  });
});
