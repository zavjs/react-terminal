import { describe, it, expect } from 'vitest';
import { writeFile, getFileContent } from './writeFile';
import { Tree } from '../types';

const dir = (contents: Tree = {}): Tree[string] => ({ type: 'dir', contents });
const file = (content = ''): Tree[string] => ({ type: 'file', content });

describe('writeFile', () => {
  it('creates a new file at root with content', () => {
    const result = writeFile({}, [], 'file.txt', 'hello');
    expect(result).toEqual({ 'file.txt': file('hello') });
  });

  it('overwrites existing file content', () => {
    const tree: Tree = { 'file.txt': file('old') };
    const result = writeFile(tree, [], 'file.txt', 'new');
    expect(result).toEqual({ 'file.txt': file('new') });
  });

  it('creates file inside existing directory', () => {
    const tree: Tree = { src: dir() };
    const result = writeFile(tree, ['src'], 'file.txt', 'hello');
    expect(result).toEqual({ src: dir({ 'file.txt': file('hello') }) });
  });

  it('returns error when parent directory does not exist', () => {
    const result = writeFile({}, ['missing'], 'file.txt', 'hello');
    expect(result).toBe('missing: No such file or directory');
  });

  it('returns error when target is a directory', () => {
    const tree: Tree = { src: dir() };
    const result = writeFile(tree, [], 'src', 'hello');
    expect(result).toBe('src: Is a directory');
  });

  it('does not mutate original tree', () => {
    const tree: Tree = {};
    writeFile(tree, [], 'file.txt', 'hello');
    expect(tree).toEqual({});
  });
});

describe('getFileContent', () => {
  it('returns content of file at root', () => {
    const tree: Tree = { 'file.txt': file('hello') };
    expect(getFileContent(tree, [], 'file.txt')).toBe('hello');
  });

  it('returns content of nested file', () => {
    const tree: Tree = { src: dir({ 'file.txt': file('world') }) };
    expect(getFileContent(tree, ['src'], 'file.txt')).toBe('world');
  });

  it('returns empty string for missing file', () => {
    expect(getFileContent({}, [], 'missing.txt')).toBe('');
  });
});
