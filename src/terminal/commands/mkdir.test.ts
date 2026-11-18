import { describe, it, expect } from 'vitest';
import mkdir from './mkdir';
import { resolveCommands } from './index';
import { Tree } from '../types';

const ctx = (tree: Tree = {}, cwd: string[] = []) => ({
  tree,
  cwd,
  allCommands: resolveCommands(),
});

describe('mkdir', () => {
  it('creates a directory at root', () => {
    const result = mkdir.execute('src', ctx());
    expect(result.tree).toMatchObject({ src: { type: 'dir', contents: {} } });
  });

  it('creates a directory relative to cwd', () => {
    const tree: Tree = { src: { type: 'dir', contents: {} } };
    const result = mkdir.execute('utils', ctx(tree, ['src']));
    expect((result.tree?.src as any).contents.utils).toMatchObject({ type: 'dir' });
  });

  it('returns error when no argument given', () => {
    const result = mkdir.execute(undefined, ctx());
    expect(result.error).toBe('mkdir: missing operand');
  });

  it('returns error when parent does not exist', () => {
    const result = mkdir.execute('src/utils', ctx());
    expect(result.error).toMatch(/no such file or directory/);
  });
});
