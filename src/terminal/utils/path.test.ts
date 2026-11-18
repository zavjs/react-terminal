import { describe, it, expect } from 'vitest';
import { getContentsList, getFilePath, getFileName, getNodeAtPath } from './path';
import { Tree } from '../types';

const dir = (name: string, contents: Tree = {}): Tree[string] => ({
  name,
  contents,
});

describe('getContentsList', () => {
  it('splits a plain path', () => {
    expect(getContentsList('src/utils')).toEqual(['src', 'utils']);
  });

  it('strips leading ./', () => {
    expect(getContentsList('./src/utils')).toEqual(['src', 'utils']);
  });

  it('strips leading /', () => {
    expect(getContentsList('/src/utils')).toEqual(['src', 'utils']);
  });

  it('handles single segment', () => {
    expect(getContentsList('src')).toEqual(['src']);
  });
});

describe('getFilePath', () => {
  it('returns directory segments without filename', () => {
    expect(getFilePath('src/utils/index.ts')).toEqual(['src', 'utils']);
  });

  it('returns empty array for root-level file', () => {
    expect(getFilePath('index.ts')).toEqual([]);
  });
});

describe('getFileName', () => {
  it('returns single filename', () => {
    expect(getFileName('src/index.ts')).toBe('index.ts');
  });

  it('returns array for brace syntax', () => {
    expect(getFileName('{a.ts,b.ts}')).toEqual(['a.ts', 'b.ts']);
  });

  it('trims spaces in brace syntax', () => {
    expect(getFileName('{a.ts, b.ts}')).toEqual(['a.ts', 'b.ts']);
  });
});

describe('getNodeAtPath', () => {
  const tree: Tree = { src: dir('src', { utils: dir('utils') }) };

  it('returns root tree for empty path', () => {
    expect(getNodeAtPath(tree, [])).toEqual(tree);
  });

  it('returns contents of existing directory', () => {
    expect(getNodeAtPath(tree, ['src'])).toEqual({ utils: dir('utils') });
  });

  it('returns null for nonexistent path', () => {
    expect(getNodeAtPath(tree, ['nonexistent'])).toBeNull();
  });

  it('returns null when segment is a file not a dir', () => {
    const t: Tree = { 'index.ts': { name: 'index.ts' } };
    expect(getNodeAtPath(t, ['index.ts'])).toBeNull();
  });
});
