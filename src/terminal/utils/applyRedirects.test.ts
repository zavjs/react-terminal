import { describe, it, expect } from 'vitest';
import { applyRedirects } from './applyRedirects';
import { Tree } from '../types';

const dir = (contents: Tree = {}): Tree[string] => ({ type: 'dir', contents });
const file = (content = ''): Tree[string] => ({ type: 'file', content });

describe('applyRedirects', () => {
  it('returns tree unchanged when no redirects', () => {
    const tree: Tree = {};
    expect(applyRedirects(tree, [], [], 'hello')).toBe(tree);
  });

  it('returns tree unchanged when output is undefined', () => {
    const tree: Tree = {};
    expect(applyRedirects(tree, [], [{ op: '>', target: 'file.txt' }], undefined)).toBe(tree);
  });

  it('creates file with output on >', () => {
    const result = applyRedirects({}, [], [{ op: '>', target: 'file.txt' }], 'hello');
    expect(result).toEqual({ 'file.txt': file('hello') });
  });

  it('overwrites existing file on >', () => {
    const tree: Tree = { 'file.txt': file('old') };
    const result = applyRedirects(tree, [], [{ op: '>', target: 'file.txt' }], 'new');
    expect(result).toEqual({ 'file.txt': file('new') });
  });

  it('appends to existing file on >>', () => {
    const tree: Tree = { 'file.txt': file('hello') };
    const result = applyRedirects(tree, [], [{ op: '>>', target: 'file.txt' }], ' world');
    expect(result).toEqual({ 'file.txt': file('hello world') });
  });

  it('creates file on >> when file does not exist', () => {
    const result = applyRedirects({}, [], [{ op: '>>', target: 'file.txt' }], 'hello');
    expect(result).toEqual({ 'file.txt': file('hello') });
  });

  it('writes to nested path relative to cwd', () => {
    const tree: Tree = { src: dir() };
    const result = applyRedirects(tree, ['src'], [{ op: '>', target: 'file.txt' }], 'hi');
    expect(result).toEqual({ src: dir({ 'file.txt': file('hi') }) });
  });

  it('returns error string when target directory does not exist', () => {
    const result = applyRedirects({}, [], [{ op: '>', target: 'missing/file.txt' }], 'hi');
    expect(typeof result).toBe('string');
  });

  it('joins string[] output with newline', () => {
    const result = applyRedirects({}, [], [{ op: '>', target: 'out.txt' }], ['a', 'b']);
    expect(result).toEqual({ 'out.txt': file('a\nb') });
  });
});
