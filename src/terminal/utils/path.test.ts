import { describe, it, expect } from 'vitest';
import { getContentsList, getFilePath, getFileName, getNodeAtPath } from './path';
import { Tree } from '../types';

const dir = (contents: Tree = {}): Tree[string] => ({ type: 'dir', contents });
const file = (): Tree[string] => ({ type: 'file', content: '' });

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
  it('returns filename from path', () => {
    expect(getFileName('src/index.ts')).toBe('index.ts');
  });

  it('returns root-level filename', () => {
    expect(getFileName('index.ts')).toBe('index.ts');
  });
});

describe('getNodeAtPath', () => {
  const tree: Tree = { src: dir({ utils: dir() }) };

  it('returns root tree for empty path', () => {
    expect(getNodeAtPath(tree, [])).toEqual(tree);
  });

  it('returns contents of existing directory', () => {
    expect(getNodeAtPath(tree, ['src'])).toEqual({ utils: dir() });
  });

  it('returns null for nonexistent path', () => {
    expect(getNodeAtPath(tree, ['nonexistent'])).toBeNull();
  });

  it('returns null when segment is a file not a dir', () => {
    const t: Tree = { 'index.ts': file() };
    expect(getNodeAtPath(t, ['index.ts'])).toBeNull();
  });
});
