import { describe, it, expect } from 'vitest';
import { makeFile } from './makeFile';
import { Tree } from '../types';

const dir = (contents: Tree = {}): Tree[string] => ({ type: 'dir', contents });
const file = (): Tree[string] => ({ type: 'file', content: '' });

describe('makeFile', () => {
  it('creates a file at root', () => {
    const result = makeFile({}, [], 'index.ts');
    expect(result).toEqual({ 'index.ts': file() });
  });

  it('creates multiple files at root', () => {
    const result = makeFile({}, [], ['a.ts', 'b.ts']);
    expect(result).toEqual({
      'a.ts': file(),
      'b.ts': file(),
    });
  });

  it('creates a file inside an existing directory', () => {
    const tree = { src: dir() };
    const result = makeFile(tree, ['src'], 'index.ts');
    expect(result).toEqual({
      src: dir({ 'index.ts': file() }),
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
