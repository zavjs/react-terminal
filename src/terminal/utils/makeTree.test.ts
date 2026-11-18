import { describe, it, expect } from 'vitest';
import { makeTree } from './makeTree';
import { Tree } from '../types';

const dir = (contents: Tree = {}): Tree[string] => ({
  type: 'dir',
  contents,
});

describe('makeTree', () => {
  it('creates a directory at root', () => {
    const result = makeTree({}, ['src']);
    expect(result).toEqual({ src: dir() });
  });

  it('is a no-op when directory already exists', () => {
    const tree = { src: dir() };
    const result = makeTree(tree, ['src']);
    expect(result).toEqual(tree);
  });

  it('creates a nested directory when parent exists', () => {
    const tree = { src: dir() };
    const result = makeTree(tree, ['src', 'utils']);
    expect(result).toEqual({ src: dir({ utils: dir() }) });
  });

  it('returns error when parent does not exist', () => {
    const result = makeTree({}, ['src', 'utils']);
    expect(result).toBe('src/utils: no such file or directory');
  });

  it('returns unchanged tree for empty parts', () => {
    const tree = { src: dir() };
    expect(makeTree(tree, [])).toEqual(tree);
  });

  it('does not mutate the original tree', () => {
    const tree: Tree = {};
    makeTree(tree, ['src']);
    expect(tree).toEqual({});
  });
});
