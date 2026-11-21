import { describe, it, expect } from 'vitest';
import { runCommand } from '../utils/runCommand';
import { resolveCommands } from './index';
import type { Tree } from '../types';

const cmds = resolveCommands();
const dir = (contents: Tree = {}): Tree[string] => ({ type: 'dir', contents });
const file = (content = ''): Tree[string] => ({ type: 'file', content });

describe('mv', () => {
  it('renames a file', () => {
    const tree: Tree = { 'a.ts': file() };
    const { newTree } = runCommand('mv a.ts b.ts', tree, [], cmds);
    expect(newTree).toEqual({ 'b.ts': file() });
  });

  it('moves file into existing directory', () => {
    const tree: Tree = { 'a.ts': file(), src: dir() };
    const { newTree } = runCommand('mv a.ts src', tree, [], cmds);
    expect(newTree).toEqual({ src: dir({ 'a.ts': file() }) });
  });

  it('renames a directory', () => {
    const tree: Tree = { src: dir({ 'a.ts': file() }) };
    const { newTree } = runCommand('mv src lib', tree, [], cmds);
    expect(newTree).toEqual({ lib: dir({ 'a.ts': file() }) });
  });

  it('moves directory into existing directory', () => {
    const tree: Tree = { src: dir({ 'a.ts': file() }), lib: dir() };
    const { newTree } = runCommand('mv src lib', tree, [], cmds);
    expect(newTree).toEqual({ lib: dir({ src: dir({ 'a.ts': file() }) }) });
  });

  it('errors when source not found', () => {
    const { result } = runCommand('mv missing.ts b.ts', {}, [], cmds);
    expect(result.error).toMatch(/No such file or directory/);
  });

  it('errors when destination parent does not exist', () => {
    const tree: Tree = { 'a.ts': file() };
    const { result } = runCommand('mv a.ts missing/b.ts', tree, [], cmds);
    expect(result.error).toMatch(/No such file or directory/);
  });

  it('errors with missing destination operand', () => {
    const { result } = runCommand('mv a.ts', {}, [], cmds);
    expect(result.error).toMatch(/missing destination operand/);
  });

  it('moves file from subdirectory', () => {
    const tree: Tree = { src: dir({ 'a.ts': file() }) };
    const { newTree } = runCommand('mv src/a.ts b.ts', tree, [], cmds);
    expect(newTree).toEqual({ src: dir(), 'b.ts': file() });
  });
});
