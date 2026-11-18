import { describe, it, expect } from 'vitest';
import ls from './ls';
import { resolveCommands } from './index';
import { Tree } from '../types';

const ctx = (tree: Tree = {}, cwd: string[] = []) => ({
  tree,
  cwd,
  allCommands: resolveCommands(),
});

describe('ls', () => {
  it('lists root contents', () => {
    const tree: Tree = { src: { name: 'src', contents: {} } };
    const result = ls.execute(undefined, ctx(tree));
    expect(result.output).toBe('src');
  });

  it('lists contents of cwd', () => {
    const tree: Tree = {
      src: { name: 'src', contents: { 'index.ts': { name: 'index.ts' } } },
    };
    const result = ls.execute(undefined, ctx(tree, ['src']));
    expect(result.output).toBe('index.ts');
  });

  it('returns empty string for empty directory', () => {
    const result = ls.execute(undefined, ctx({}));
    expect(result.output).toBe('');
  });
});
