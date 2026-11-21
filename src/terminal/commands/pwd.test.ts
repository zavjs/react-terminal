import { describe, it, expect } from 'vitest';
import pwd from './pwd';
import { resolveCommands } from './index';
import { Tree } from '../types';

const ctx = (tree: Tree = {}, cwd: string[] = []) => ({
  tree,
  cwd,
  allCommands: resolveCommands(),
});

describe('pwd', () => {
  it('returns ~ at root', () => {
    const result = pwd.execute([], ctx());
    expect(result.output).toBe('~');
  });

  it('returns path string inside a directory', () => {
    const result = pwd.execute([], ctx({}, ['src', 'utils']));
    expect(result.output).toBe('/src/utils');
  });
});
