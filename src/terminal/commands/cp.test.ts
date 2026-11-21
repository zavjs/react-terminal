import { describe, it, expect } from 'vitest';
import { runCommand } from '../utils/runCommand';
import { resolveCommands } from './index';
import type { Tree } from '../types';

const cmds = resolveCommands();
const dir = (contents: Tree = {}): Tree[string] => ({ type: 'dir', contents });
const file = (content = ''): Tree[string] => ({ type: 'file', content });

describe('cp', () => {
  it('copies a file', () => {
    const tree: Tree = { 'a.ts': file() };
    const { newTree } = runCommand('cp a.ts b.ts', tree, [], cmds);
    expect(newTree).toEqual({ 'a.ts': file(), 'b.ts': file() });
  });

  it('source remains after copy', () => {
    const tree: Tree = { 'a.ts': file('hello') };
    const { newTree } = runCommand('cp a.ts b.ts', tree, [], cmds);
    expect((newTree?.['a.ts'] as any).content).toBe('hello');
    expect((newTree?.['b.ts'] as any).content).toBe('hello');
  });

  it('copies file into existing directory', () => {
    const tree: Tree = { 'a.ts': file(), src: dir() };
    const { newTree } = runCommand('cp a.ts src', tree, [], cmds);
    expect(newTree).toEqual({ 'a.ts': file(), src: dir({ 'a.ts': file() }) });
  });

  it('copies directory with -r', () => {
    const tree: Tree = { src: dir({ 'a.ts': file() }) };
    const { newTree } = runCommand('cp -r src lib', tree, [], cmds);
    expect(newTree).toEqual({ src: dir({ 'a.ts': file() }), lib: dir({ 'a.ts': file() }) });
  });

  it('errors on directory without -r', () => {
    const tree: Tree = { src: dir() };
    const { result } = runCommand('cp src lib', tree, [], cmds);
    expect(result.error).toMatch(/is a directory/);
  });

  it('errors when source not found', () => {
    const { result } = runCommand('cp missing.ts b.ts', {}, [], cmds);
    expect(result.error).toMatch(/No such file or directory/);
  });

  it('errors when destination parent does not exist', () => {
    const tree: Tree = { 'a.ts': file() };
    const { result } = runCommand('cp a.ts missing/b.ts', tree, [], cmds);
    expect(result.error).toMatch(/No such file or directory/);
  });

  it('errors with missing destination operand', () => {
    const { result } = runCommand('cp a.ts', {}, [], cmds);
    expect(result.error).toMatch(/missing destination operand/);
  });
});
