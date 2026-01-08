/**
 * Tests for icon definitions
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ICONS, getIconNames } from './icons.js';

describe('ICONS', () => {
  it('should be an object', () => {
    assert.strictEqual(typeof ICONS, 'object');
  });

  it('should have at least 20 icons', () => {
    assert.ok(Object.keys(ICONS).length >= 20);
  });

  it('should have server icon', () => {
    assert.ok(ICONS.server);
  });

  it('should have database icon', () => {
    assert.ok(ICONS.database);
  });

  it('should have cloud icon', () => {
    assert.ok(ICONS.cloud);
  });

  it('should have code icon', () => {
    assert.ok(ICONS.code);
  });

  it('should have terminal icon', () => {
    assert.ok(ICONS.terminal);
  });

  it('should have shield icon', () => {
    assert.ok(ICONS.shield);
  });

  it('should have zap icon', () => {
    assert.ok(ICONS.zap);
  });

  it('should have check icon', () => {
    assert.ok(ICONS.check);
  });

  it('should have x icon', () => {
    assert.ok(ICONS.x);
  });

  it('should have alert icon', () => {
    assert.ok(ICONS.alert);
  });

  it('should have globe icon', () => {
    assert.ok(ICONS.globe);
  });

  it('should have layers icon', () => {
    assert.ok(ICONS.layers);
  });

  it('should have rocket icon', () => {
    assert.ok(ICONS.rocket);
  });

  it('should have users icon', () => {
    assert.ok(ICONS.users);
  });

  it('should have target icon', () => {
    assert.ok(ICONS.target);
  });

  it('should have cpu icon', () => {
    assert.ok(ICONS.cpu);
  });

  it('should have activity icon', () => {
    assert.ok(ICONS.activity);
  });

  it('should have lock icon', () => {
    assert.ok(ICONS.lock);
  });

  it('should have eye icon', () => {
    assert.ok(ICONS.eye);
  });

  it('should have git icon', () => {
    assert.ok(ICONS.git);
  });

  it('should have package icon', () => {
    assert.ok(ICONS.package);
  });

  it('should have settings icon', () => {
    assert.ok(ICONS.settings);
  });

  it('should have wifi icon', () => {
    assert.ok(ICONS.wifi);
  });

  it('should have download icon', () => {
    assert.ok(ICONS.download);
  });

  it('should have upload icon', () => {
    assert.ok(ICONS.upload);
  });

  it('should have refresh icon', () => {
    assert.ok(ICONS.refresh);
  });

  it('should have search icon', () => {
    assert.ok(ICONS.search);
  });

  it('should have file icon', () => {
    assert.ok(ICONS.file);
  });

  it('should have folder icon', () => {
    assert.ok(ICONS.folder);
  });

  it('should have clock icon', () => {
    assert.ok(ICONS.clock);
  });

  it('should have bell icon', () => {
    assert.ok(ICONS.bell);
  });
});

describe('Icon path format', () => {
  for (const [iconName, path] of Object.entries(ICONS)) {
    describe(`${iconName} icon`, () => {
      it('should be a string', () => {
        assert.strictEqual(typeof path, 'string');
      });

      it('should not be empty', () => {
        assert.ok(path.length > 0);
      });

      it('should contain valid SVG path commands', () => {
        // SVG path commands: M, L, H, V, C, S, Q, T, A, Z (and lowercase variants)
        const validCommands = /^[MLHVCSQTAZmlhvcsqtaz0-9\s,.\-]+$/;
        assert.ok(validCommands.test(path), 
          `Invalid path characters in ${iconName}: ${path}`);
      });

      it('should start with a valid path command', () => {
        const startsWithCommand = /^[MLmM]/;
        assert.ok(startsWithCommand.test(path.trim()), 
          `Path should start with M or m in ${iconName}`);
      });
    });
  }
});

describe('getIconNames', () => {
  it('should return an array', () => {
    const names = getIconNames();
    assert.ok(Array.isArray(names));
  });

  it('should return all icon names', () => {
    const names = getIconNames();
    assert.strictEqual(names.length, Object.keys(ICONS).length);
  });

  it('should include server', () => {
    const names = getIconNames();
    assert.ok(names.includes('server'));
  });

  it('should include database', () => {
    const names = getIconNames();
    assert.ok(names.includes('database'));
  });

  it('should return strings only', () => {
    const names = getIconNames();
    for (const name of names) {
      assert.strictEqual(typeof name, 'string');
    }
  });

  it('should match ICONS keys', () => {
    const names = getIconNames();
    const iconKeys = Object.keys(ICONS);
    assert.deepStrictEqual(names.sort(), iconKeys.sort());
  });
});
