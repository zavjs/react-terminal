import { describe, it, expect } from 'vitest';
import cd from './cd';
import { resolveCommands } from './index';
import { Tree } from '../types';
import { parseArgs } from '../utils/parseArgs';

const ctx = (tree: Tree = {}, cwd: string[] = []) => ({
  tree,
  cwd,
  allCommands: resolveCommands(),
});

describe('cd', () => {
  it('navigates into an existing directory', () => {
    const tree: Tree = { src: { type: 'dir', contents: {} } };
    const result = cd.execute(parseArgs('src'), ctx(tree));
    expect(result.cwd).toEqual(['src']);
  });

  it('goes up one level with ..', () => {
    const tree: Tree = { src: { type: 'dir', contents: {} } };
    const result = cd.execute(parseArgs('..'), ctx(tree, ['src']));
    expect(result.cwd).toEqual([]);
  });

  it('navigates to root with ~', () => {
    const result = cd.execute(parseArgs('~'), ctx({}, ['src']));
    expect(result.cwd).toEqual([]);
  });

  it('navigates to root with no arg', () => {
    const result = cd.execute(parseArgs(undefined), ctx({}, ['src']));
    expect(result.cwd).toEqual([]);
  });

  it('returns error for nonexistent directory', () => {
    const result = cd.execute(parseArgs('nonexistent'), ctx());
    expect(result.error).toMatch(/No such file or directory/);
  });

  it('returns error when target is a file not a dir', () => {
    const tree: Tree = { 'index.ts': { type: 'file', content: '' } };
    const result = cd.execute(parseArgs('index.ts'), ctx(tree));
    expect(result.error).toMatch(/No such file or directory/);
  });
});
