/**
 * Tests for SVG generator
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateSVG, generateIllustration, detectScene, getAvailableScenes } from './generator.js';
import type { SceneType } from './types.js';

describe('detectScene', () => {
  describe('architecture detection', () => {
    it('should detect architecture from title', () => {
      assert.strictEqual(detectScene('System Architecture Overview'), 'architecture');
    });

    it('should detect architecture from microservice keyword', () => {
      assert.strictEqual(detectScene('Microservice Design'), 'architecture');
    });

    it('should detect architecture from infrastructure keyword', () => {
      assert.strictEqual(detectScene('Infrastructure Setup'), 'architecture');
    });

    it('should detect architecture from distributed keyword', () => {
      assert.strictEqual(detectScene('Distributed Systems'), 'architecture');
    });
  });

  describe('scaling detection', () => {
    it('should detect scaling from title', () => {
      assert.strictEqual(detectScene('Auto-scaling Configuration'), 'scaling');
    });

    it('should detect scaling from kubernetes keyword', () => {
      assert.strictEqual(detectScene('Kubernetes Deployment'), 'scaling');
    });

    it('should detect scaling from k8s keyword', () => {
      assert.strictEqual(detectScene('K8s Cluster Setup'), 'scaling');
    });

    it('should detect scaling from docker keyword', () => {
      assert.strictEqual(detectScene('Docker Container Orchestration'), 'scaling');
    });

    it('should detect scaling from horizontal keyword', () => {
      assert.strictEqual(detectScene('Horizontal Scaling Strategy'), 'scaling');
    });
  });

  describe('database detection', () => {
    it('should detect database from title', () => {
      assert.strictEqual(detectScene('Database Optimization'), 'database');
    });

    it('should detect database from sql keyword', () => {
      assert.strictEqual(detectScene('SQL Query Performance'), 'database');
    });

    it('should detect database from postgres keyword', () => {
      assert.strictEqual(detectScene('PostgreSQL Replication'), 'database');
    });

    it('should detect database from mongo keyword', () => {
      assert.strictEqual(detectScene('MongoDB Sharding'), 'database');
    });

    it('should detect database from redis keyword', () => {
      assert.strictEqual(detectScene('Redis Cache Layer'), 'database');
    });

    it('should detect database from migration keyword', () => {
      assert.strictEqual(detectScene('Schema Migration Guide'), 'database');
    });
  });

  describe('deployment detection', () => {
    it('should detect deployment from title', () => {
      assert.strictEqual(detectScene('Deployment Pipeline'), 'deployment');
    });

    it('should detect deployment from ci keyword', () => {
      assert.strictEqual(detectScene('CI/CD Best Practices'), 'deployment');
    });

    it('should detect deployment from pipeline keyword', () => {
      assert.strictEqual(detectScene('Build Pipeline Setup'), 'deployment');
    });

    it('should detect deployment from github actions keyword', () => {
      assert.strictEqual(detectScene('GitHub Actions Workflow'), 'deployment');
    });

    it('should detect deployment from production keyword', () => {
      assert.strictEqual(detectScene('Production Release'), 'deployment');
    });
  });

  describe('security detection', () => {
    it('should detect security from title', () => {
      assert.strictEqual(detectScene('Security Best Practices'), 'security');
    });

    it('should detect security from auth keyword', () => {
      assert.strictEqual(detectScene('Authentication Flow'), 'security');
    });

    it('should detect security from jwt keyword', () => {
      assert.strictEqual(detectScene('JWT Token Validation'), 'security');
    });

    it('should detect security from oauth keyword', () => {
      assert.strictEqual(detectScene('OAuth2 Implementation'), 'security');
    });

    it('should detect security from zero trust keyword', () => {
      // 'zero trust' matches security, but 'architecture' also matches architecture
      // architecture gets higher score due to title match
      assert.strictEqual(detectScene('Zero Trust Security'), 'security');
    });
  });

  describe('debugging detection', () => {
    it('should detect debugging from title', () => {
      assert.strictEqual(detectScene('Debugging Tips'), 'debugging');
    });

    it('should detect debugging from bug keyword', () => {
      assert.strictEqual(detectScene('Bug Investigation'), 'debugging');
    });

    it('should detect debugging from error keyword', () => {
      assert.strictEqual(detectScene('Error Handling'), 'debugging');
    });

    it('should detect debugging from troubleshoot keyword', () => {
      assert.strictEqual(detectScene('Troubleshooting Guide'), 'debugging');
    });

    it('should detect debugging from root cause keyword', () => {
      assert.strictEqual(detectScene('Root Cause Analysis'), 'debugging');
    });
  });

  describe('testing detection', () => {
    it('should detect testing from title', () => {
      assert.strictEqual(detectScene('Testing Strategy'), 'testing');
    });

    it('should detect testing from jest keyword', () => {
      assert.strictEqual(detectScene('Jest Configuration'), 'testing');
    });

    it('should detect testing from vitest keyword', () => {
      assert.strictEqual(detectScene('Vitest Setup'), 'testing');
    });

    it('should detect testing from coverage keyword', () => {
      assert.strictEqual(detectScene('Code Coverage Report'), 'testing');
    });

    it('should detect testing from e2e keyword', () => {
      assert.strictEqual(detectScene('E2E Testing with Playwright'), 'testing');
    });

    it('should detect testing from tdd keyword', () => {
      assert.strictEqual(detectScene('TDD Approach'), 'testing');
    });
  });


  describe('performance detection', () => {
    it('should detect performance from optimize keyword', () => {
      assert.strictEqual(detectScene('Optimize Your App'), 'performance');
    });

    it('should detect performance from speed keyword', () => {
      assert.strictEqual(detectScene('Speed Improvements'), 'performance');
    });

    it('should detect performance from benchmark keyword', () => {
      assert.strictEqual(detectScene('Benchmark Results'), 'performance');
    });

    it('should detect performance from bottleneck keyword', () => {
      assert.strictEqual(detectScene('Finding Bottlenecks'), 'performance');
    });

    it('should detect performance from profil keyword', () => {
      assert.strictEqual(detectScene('Profiling Your Code'), 'performance');
    });
  });

  describe('api detection', () => {
    it('should detect api from rest keyword', () => {
      assert.strictEqual(detectScene('REST API Best Practices'), 'api');
    });

    it('should detect api from graphql keyword', () => {
      // graphql alone triggers api
      assert.strictEqual(detectScene('GraphQL Queries'), 'api');
    });

    it('should detect api from endpoint keyword', () => {
      assert.strictEqual(detectScene('Endpoint Documentation'), 'api');
    });

    it('should detect api from grpc keyword', () => {
      assert.strictEqual(detectScene('gRPC Services'), 'api');
    });

    it('should detect api from http keyword', () => {
      assert.strictEqual(detectScene('HTTP Methods'), 'api');
    });
  });

  describe('monitoring detection', () => {
    it('should detect monitoring from title', () => {
      assert.strictEqual(detectScene('Monitoring Setup'), 'monitoring');
    });

    it('should detect monitoring from observ keyword', () => {
      assert.strictEqual(detectScene('Observability Stack'), 'monitoring');
    });

    it('should detect monitoring from grafana keyword', () => {
      assert.strictEqual(detectScene('Grafana Dashboard'), 'monitoring');
    });

    it('should detect monitoring from prometheus keyword', () => {
      assert.strictEqual(detectScene('Prometheus Metrics'), 'monitoring');
    });

    it('should detect monitoring from dashboard keyword', () => {
      assert.strictEqual(detectScene('Dashboard Setup'), 'monitoring');
    });
  });

  describe('frontend detection', () => {
    it('should detect frontend from react keyword', () => {
      assert.strictEqual(detectScene('React Component Design'), 'frontend');
    });

    it('should detect frontend from vue keyword', () => {
      assert.strictEqual(detectScene('Vue.js Best Practices'), 'frontend');
    });

    it('should detect frontend from tailwind keyword', () => {
      assert.strictEqual(detectScene('Tailwind CSS Setup'), 'frontend');
    });

    it('should detect frontend from web vitals keyword', () => {
      assert.strictEqual(detectScene('Web Vitals Optimization'), 'frontend');
    });

    it('should detect frontend from component keyword', () => {
      assert.strictEqual(detectScene('Component Library'), 'frontend');
    });
  });

  describe('success detection', () => {
    it('should detect success from title', () => {
      assert.strictEqual(detectScene('Success Story'), 'success');
    });

    it('should detect success from complete keyword', () => {
      assert.strictEqual(detectScene('Project Complete'), 'success');
    });

    it('should detect success from win keyword', () => {
      assert.strictEqual(detectScene('Big Win Today'), 'success');
    });

    it('should detect success from milestone keyword', () => {
      assert.strictEqual(detectScene('Milestone Achieved'), 'success');
    });

    it('should detect success from celebrate keyword', () => {
      assert.strictEqual(detectScene('Time to Celebrate'), 'success');
    });

    it('should detect success from launch keyword', () => {
      assert.strictEqual(detectScene('Product Launch'), 'success');
    });
  });

  describe('error detection', () => {
    it('should detect error from outage keyword', () => {
      assert.strictEqual(detectScene('Service Outage'), 'error');
    });

    it('should detect error from down keyword', () => {
      assert.strictEqual(detectScene('Server Down'), 'error');
    });

    it('should detect error from 503 keyword', () => {
      assert.strictEqual(detectScene('503 Service Unavailable'), 'error');
    });

    it('should detect error from oom keyword', () => {
      assert.strictEqual(detectScene('OOM Killed'), 'error');
    });

    it('should detect error from killed keyword', () => {
      assert.strictEqual(detectScene('Process Killed'), 'error');
    });
  });

  describe('default detection', () => {
    it('should return default for unrecognized content', () => {
      assert.strictEqual(detectScene('Random Title'), 'default');
    });

    it('should return default for empty title', () => {
      assert.strictEqual(detectScene(''), 'default');
    });

    it('should return default for generic content', () => {
      assert.strictEqual(detectScene('Hello World'), 'default');
    });
  });

  describe('content parameter', () => {
    it('should consider content in detection', () => {
      assert.strictEqual(detectScene('Overview', 'kubernetes cluster setup'), 'scaling');
    });

    it('should prioritize title keywords over content', () => {
      // Title has 'database' (3 points), content has 'api' (1 point)
      assert.strictEqual(detectScene('Database Guide', 'api endpoint'), 'database');
    });

    it('should use content when title is generic', () => {
      assert.strictEqual(detectScene('Guide', 'security authentication jwt'), 'security');
    });
  });

  describe('case insensitivity', () => {
    it('should detect regardless of case', () => {
      assert.strictEqual(detectScene('DATABASE OPTIMIZATION'), 'database');
    });

    it('should detect mixed case', () => {
      assert.strictEqual(detectScene('DataBase Setup'), 'database');
    });
  });
});

describe('getAvailableScenes', () => {
  it('should return an array', () => {
    const scenes = getAvailableScenes();
    assert.ok(Array.isArray(scenes));
  });

  it('should include all scene types', () => {
    const scenes = getAvailableScenes();
    const expectedScenes: SceneType[] = [
      'architecture', 'scaling', 'database', 'deployment', 'security',
      'debugging', 'testing', 'performance', 'api', 'monitoring',
      'frontend', 'success', 'error', 'default'
    ];
    for (const scene of expectedScenes) {
      assert.ok(scenes.includes(scene), `Missing scene: ${scene}`);
    }
  });

  it('should have 14 scenes', () => {
    const scenes = getAvailableScenes();
    assert.strictEqual(scenes.length, 14);
  });
});

describe('generateSVG', () => {
  describe('basic generation', () => {
    it('should return an object with svg, scene, width, height', () => {
      const result = generateSVG('Test');
      assert.ok(result.svg);
      assert.ok(result.scene);
      assert.ok(result.width);
      assert.ok(result.height);
    });

    it('should generate valid SVG string', () => {
      const result = generateSVG('Test');
      assert.ok(result.svg.startsWith('<?xml version="1.0"'));
      assert.ok(result.svg.includes('<svg'));
      assert.ok(result.svg.includes('</svg>'));
    });

    it('should include xmlns attribute', () => {
      const result = generateSVG('Test');
      assert.ok(result.svg.includes('xmlns="http://www.w3.org/2000/svg"'));
    });

    it('should include viewBox attribute', () => {
      const result = generateSVG('Test');
      assert.ok(result.svg.includes('viewBox="0 0'));
    });
  });

  describe('default dimensions', () => {
    it('should use default width of 700', () => {
      const result = generateSVG('Test');
      assert.strictEqual(result.width, 700);
    });

    it('should use default height of 420', () => {
      const result = generateSVG('Test');
      assert.strictEqual(result.height, 420);
    });

    it('should include dimensions in SVG', () => {
      const result = generateSVG('Test');
      assert.ok(result.svg.includes('width="700"'));
      assert.ok(result.svg.includes('height="420"'));
    });
  });

  describe('custom dimensions', () => {
    it('should accept custom width', () => {
      const result = generateSVG('Test', '', { width: 800 });
      assert.strictEqual(result.width, 800);
      assert.ok(result.svg.includes('width="800"'));
    });

    it('should accept custom height', () => {
      const result = generateSVG('Test', '', { height: 500 });
      assert.strictEqual(result.height, 500);
      assert.ok(result.svg.includes('height="500"'));
    });

    it('should accept both custom dimensions', () => {
      const result = generateSVG('Test', '', { width: 1000, height: 600 });
      assert.strictEqual(result.width, 1000);
      assert.strictEqual(result.height, 600);
    });
  });

  describe('scene detection', () => {
    it('should auto-detect scene from title', () => {
      const result = generateSVG('Database Optimization');
      assert.strictEqual(result.scene, 'database');
    });

    it('should return default scene for generic title', () => {
      const result = generateSVG('Hello World');
      assert.strictEqual(result.scene, 'default');
    });
  });

  describe('forced scene', () => {
    it('should use forced scene when provided', () => {
      const result = generateSVG('Hello World', '', { scene: 'security' });
      assert.strictEqual(result.scene, 'security');
    });

    it('should override auto-detection with forced scene', () => {
      const result = generateSVG('Database Guide', '', { scene: 'api' });
      assert.strictEqual(result.scene, 'api');
    });
  });

  describe('theme support', () => {
    it('should use github-dark theme by default', () => {
      const result = generateSVG('Test');
      assert.ok(result.svg.includes('#0d1117')); // github-dark bg color
    });

    it('should accept dracula theme', () => {
      const result = generateSVG('Test', '', { theme: 'dracula' });
      assert.ok(result.svg.includes('#282a36')); // dracula bg color
    });

    it('should accept nord theme', () => {
      const result = generateSVG('Test', '', { theme: 'nord' });
      assert.ok(result.svg.includes('#2e3440')); // nord bg color
    });

    it('should accept one-dark theme', () => {
      const result = generateSVG('Test', '', { theme: 'one-dark' });
      assert.ok(result.svg.includes('#282c34')); // one-dark bg color
    });

    it('should fallback to github-dark for unknown theme', () => {
      const result = generateSVG('Test', '', { theme: 'unknown-theme' });
      assert.ok(result.svg.includes('#0d1117'));
    });
  });

  describe('content parameter', () => {
    it('should use content for scene detection', () => {
      const result = generateSVG('Overview', 'kubernetes docker scaling');
      assert.strictEqual(result.scene, 'scaling');
    });

    it('should work with empty content', () => {
      const result = generateSVG('Database Guide', '');
      assert.strictEqual(result.scene, 'database');
    });
  });

  describe('SVG structure', () => {
    it('should include background gradient', () => {
      const result = generateSVG('Test');
      assert.ok(result.svg.includes('<linearGradient'));
      assert.ok(result.svg.includes('id="bg"'));
    });

    it('should include background rect', () => {
      const result = generateSVG('Test');
      assert.ok(result.svg.includes('fill="url(#bg)"'));
    });

    it('should include defs section', () => {
      const result = generateSVG('Test');
      assert.ok(result.svg.includes('<defs>'));
      assert.ok(result.svg.includes('</defs>'));
    });
  });
});

describe('generateIllustration', () => {
  it('should be an alias for generateSVG', () => {
    const result1 = generateSVG('Test Title');
    const result2 = generateIllustration('Test Title');
    
    assert.strictEqual(result1.scene, result2.scene);
    assert.strictEqual(result1.width, result2.width);
    assert.strictEqual(result1.height, result2.height);
  });

  it('should accept all the same options', () => {
    const result = generateIllustration('Test', 'content', {
      width: 800,
      height: 500,
      theme: 'dracula',
      scene: 'api'
    });
    
    assert.strictEqual(result.width, 800);
    assert.strictEqual(result.height, 500);
    assert.strictEqual(result.scene, 'api');
    assert.ok(result.svg.includes('#282a36'));
  });

  it('should return the same structure as generateSVG', () => {
    const result = generateIllustration('Test');
    assert.ok('svg' in result);
    assert.ok('scene' in result);
    assert.ok('width' in result);
    assert.ok('height' in result);
  });
});
