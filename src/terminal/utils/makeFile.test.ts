import { describe, it, expect } from 'vitest';
import { makeFile } from './makeFile';
import { Tree } from '../types';

const dir = (name: string, contents: Tree = {}): Tree[string] => ({
  name,
  contents,
});

describe('makeFile', () => {
  it('creates a file at root', () => {
    const result = makeFile({}, [], 'index.ts');
    expect(result).toEqual({ 'index.ts': { name: 'index.ts' } });
  });

  it('creates multiple files at root', () => {
    const result = makeFile({}, [], ['a.ts', 'b.ts']);
    expect(result).toEqual({
      'a.ts': { name: 'a.ts' },
      'b.ts': { name: 'b.ts' },
    });
  });

  it('creates a file inside an existing directory', () => {
    const tree = { src: dir('src') };
    const result = makeFile(tree, ['src'], 'index.ts');
    expect(result).toEqual({
      src: dir('src', { 'index.ts': { name: 'index.ts' } }),
    });
  });

  it('returns error when target directory does not exist', () => {
    const result = makeFile({}, ['src'], 'index.ts');
    expect(result).toBe('src: no such file or directory');
  });

  it('does not mutate the original tree', () => {
    const tree: Tree = {};
    makeFile(tree, [], 'index.ts');
    expect(tree).toEqual({});
  });
});
