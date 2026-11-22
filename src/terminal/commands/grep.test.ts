import { describe, it, expect } from 'vitest';
import { runCommand } from '../utils/runCommand';
import { resolveCommands } from './index';
import type { Tree } from '../types';

const cmds = resolveCommands();
const dir = (contents: Tree = {}): Tree[string] => ({ type: 'dir', contents });
const file = (content = ''): Tree[string] => ({ type: 'file', content });

const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '');
const strip = (output: unknown) =>
  Array.isArray(output) ? output.map(stripAnsi) : output;

describe('grep', () => {
  it('returns matching lines', () => {
    const tree: Tree = { 'a.ts': file('hello\nworld\nhello again') };
    const { result } = runCommand('grep hello a.ts', tree, [], cmds);
    expect(strip(result.output)).toEqual(['hello', 'hello again']);
  });

  it('returns nothing when no match', () => {
    const tree: Tree = { 'a.ts': file('hello') };
    const { result } = runCommand('grep missing a.ts', tree, [], cmds);
    expect(result.output).toBeUndefined();
  });

  it('-i matches case-insensitively', () => {
    const tree: Tree = { 'a.ts': file('Hello\nworld') };
    const { result } = runCommand('grep -i hello a.ts', tree, [], cmds);
    expect(strip(result.output)).toEqual(['Hello']);
  });

  it('-n prefixes line numbers', () => {
    const tree: Tree = { 'a.ts': file('hello\nworld\nhello') };
    const { result } = runCommand('grep -n hello a.ts', tree, [], cmds);
    expect(strip(result.output)).toEqual(['1:hello', '3:hello']);
  });

  it('-v returns non-matching lines', () => {
    const tree: Tree = { 'a.ts': file('hello\nworld') };
    const { result } = runCommand('grep -v hello a.ts', tree, [], cmds);
    expect(strip(result.output)).toEqual(['world']);
  });

  it('prefixes filename for multiple files', () => {
    const tree: Tree = { 'a.ts': file('hello'), 'b.ts': file('hello') };
    const { result } = runCommand('grep hello a.ts b.ts', tree, [], cmds);
    expect(strip(result.output)).toEqual(['a.ts:hello', 'b.ts:hello']);
  });

  it('-r searches directory recursively', () => {
    const tree: Tree = { src: dir({ 'a.ts': file('hello\nworld') }) };
    const { result } = runCommand('grep -r hello src', tree, [], cmds);
    expect(strip(result.output)).toEqual(['src/a.ts:hello']);
  });

  it('errors on directory without -r', () => {
    const tree: Tree = { src: dir() };
    const { result } = runCommand('grep hello src', tree, [], cmds);
    expect(result.error).toMatch(/Is a directory/);
  });

  it('errors when file not found', () => {
    const { result } = runCommand('grep hello missing.ts', {}, [], cmds);
    expect(result.error).toMatch(/No such file or directory/);
  });

  it('errors with missing pattern or file', () => {
    const { result } = runCommand('grep hello', {}, [], cmds);
    expect(result.error).toMatch(/usage/);
  });

  it('supports regex patterns', () => {
    const tree: Tree = { 'a.ts': file('foo123\nbar456\nfoo789') };
    const { result } = runCommand('grep foo[0-9]+ a.ts', tree, [], cmds);
    expect(strip(result.output)).toEqual(['foo123', 'foo789']);
  });
});
