import { describe, it, expect } from 'vitest';
import cat from './cat';
import { resolveCommands } from './index';
import { Tree } from '../types';
import { parseArgs } from '../utils/parseArgs';

const ctx = (tree: Tree = {}, cwd: string[] = []) => ({
  tree,
  cwd,
  allCommands: resolveCommands(),
});

const file = (content = ''): Tree[string] => ({ type: 'file', content });
const dir = (contents: Tree = {}): Tree[string] => ({ type: 'dir', contents });

describe('cat', () => {
  it('returns error when no arg given', () => {
    const result = cat.execute(parseArgs(undefined), ctx());
    expect(result.error).toBe('cat: missing operand');
  });

  it('returns error when file does not exist', () => {
    const result = cat.execute(parseArgs('missing.ts'), ctx());
    expect(result.error).toBe('cat: missing.ts: No such file or directory');
  });

  it('returns error when target is a directory', () => {
    const tree: Tree = { src: dir() };
    const result = cat.execute(parseArgs('src'), ctx(tree));
    expect(result.error).toBe('cat: src: Is a directory');
  });

  it('returns empty string for empty file', () => {
    const tree: Tree = { 'empty.ts': file() };
    const result = cat.execute(parseArgs('empty.ts'), ctx(tree));
    expect(result.output).toBe('');
    expect(result.error).toBeUndefined();
  });

  it('returns file content', () => {
    const tree: Tree = { 'README.md': file('hello world') };
    const result = cat.execute(parseArgs('README.md'), ctx(tree));
    expect(result.output).toBe('hello world');
  });

  it('returns multiline content as-is', () => {
    const tree: Tree = { 'notes.md': file('line one\nline two') };
    const result = cat.execute(parseArgs('notes.md'), ctx(tree));
    expect(result.output).toBe('line one\nline two');
  });

  it('reads file inside a subdirectory', () => {
    const tree: Tree = { src: dir({ 'index.ts': file('export default {}') }) };
    const result = cat.execute(parseArgs('src/index.ts'), ctx(tree));
    expect(result.output).toBe('export default {}');
  });

  it('reads file relative to cwd', () => {
    const tree: Tree = { src: dir({ 'index.ts': file('const x = 1') }) };
    const result = cat.execute(parseArgs('index.ts'), ctx(tree, ['src']));
    expect(result.output).toBe('const x = 1');
  });

  it('returns error when parent directory does not exist', () => {
    const result = cat.execute(parseArgs('missing/index.ts'), ctx());
    expect(result.error).toBe('cat: missing/index.ts: No such file or directory');
  });
});
