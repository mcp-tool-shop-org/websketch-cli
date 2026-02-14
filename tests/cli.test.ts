import { describe, it, expect } from 'vitest';
import {
  renderAscii,
  renderForLLM,
  renderStructure,
  fingerprintCapture,
  fingerprintLayout,
  diff,
  formatDiff,
  formatDiffJson,
} from '@mcptoolshop/websketch-ir';

describe('websketch-cli dependencies', () => {
  it('imports all render functions from websketch-ir', () => {
    expect(typeof renderAscii).toBe('function');
    expect(typeof renderForLLM).toBe('function');
    expect(typeof renderStructure).toBe('function');
  });

  it('imports all fingerprint functions from websketch-ir', () => {
    expect(typeof fingerprintCapture).toBe('function');
    expect(typeof fingerprintLayout).toBe('function');
  });

  it('imports all diff functions from websketch-ir', () => {
    expect(typeof diff).toBe('function');
    expect(typeof formatDiff).toBe('function');
    expect(typeof formatDiffJson).toBe('function');
  });
});
