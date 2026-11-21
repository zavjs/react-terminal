import { describe, it, expect } from 'vitest';
import { runCommand } from '../utils/runCommand';
import { resolveCommands } from './index';
import type { Tree } from '../types';

const cmds = resolveCommands();
const dir = (contents: Tree = {}): Tree[string] => ({ type: 'dir', contents });
const file = (content = ''): Tree[string] => ({ type: 'file', content });

describe('rm', () => {
  it('removes a file', () => {
    const tree: Tree = { 'a.ts': file(), 'b.ts': file() };
    const { newTree } = runCommand('rm a.ts', tree, [], cmds);
    expect(newTree).toEqual({ 'b.ts': file() });
  });

  it('errors when file not found', () => {
    const { result } = runCommand('rm missing.ts', {}, [], cmds);
    expect(result.error).toMatch(/No such file or directory/);
  });

  it('errors on directory without -r', () => {
    const tree: Tree = { src: dir() };
    const { result } = runCommand('rm src', tree, [], cmds);
    expect(result.error).toMatch(/is a directory/);
  });

  it('removes directory with -r', () => {
    const tree: Tree = { src: dir({ 'a.ts': file() }), 'b.ts': file() };
    const { newTree } = runCommand('rm -r src', tree, [], cmds);
    expect(newTree).toEqual({ 'b.ts': file() });
  });

  it('removes multiple files', () => {
    const tree: Tree = { 'a.ts': file(), 'b.ts': file(), 'c.ts': file() };
    const { newTree } = runCommand('rm a.ts b.ts', tree, [], cmds);
    expect(newTree).toEqual({ 'c.ts': file() });
  });

  it('-f suppresses not-found error', () => {
    const { result, newTree } = runCommand('rm -f missing.ts', {}, [], cmds);
    expect(result.error).toBeUndefined();
    expect(newTree).toBeUndefined();
  });

  it('removes file inside subdirectory from cwd', () => {
    const tree: Tree = { 'a.ts': file() };
    const { newTree } = runCommand('rm a.ts', tree, [], cmds);
    expect(newTree).toEqual({});
  });

  it('removes nested file by path', () => {
    const tree: Tree = { src: dir({ 'a.ts': file() }) };
    const { newTree } = runCommand('rm src/a.ts', tree, [], cmds);
    expect(newTree).toEqual({ src: dir() });
  });

  it('errors with missing operand', () => {
    const { result } = runCommand('rm', {}, [], cmds);
    expect(result.error).toMatch(/missing operand/);
  });
});
