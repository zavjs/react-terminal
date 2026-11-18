import { describe, it, expect } from 'vitest';
import { makeTree } from './makeTree';
import { Tree } from '../types';

const dir = (name: string, contents: Tree = {}): Tree[string] => ({
  name,
  contents,
});

describe('makeTree', () => {
  it('creates a directory at root', () => {
    const result = makeTree({}, ['src']);
    expect(result).toEqual({ src: dir('src') });
  });

  it('is a no-op when directory already exists', () => {
    const tree = { src: dir('src') };
    const result = makeTree(tree, ['src']);
    expect(result).toEqual(tree);
  });

  it('creates a nested directory when parent exists', () => {
    const tree = { src: dir('src') };
    const result = makeTree(tree, ['src', 'utils']);
    expect(result).toEqual({ src: dir('src', { utils: dir('utils') }) });
  });

  it('returns error when parent does not exist', () => {
    const result = makeTree({}, ['src', 'utils']);
    expect(result).toBe('src/utils: no such file or directory');
  });

  it('returns unchanged tree for empty parts', () => {
    const tree = { src: dir('src') };
    expect(makeTree(tree, [])).toEqual(tree);
  });

  it('does not mutate the original tree', () => {
    const tree: Tree = {};
    makeTree(tree, ['src']);
    expect(tree).toEqual({});
  });
});
