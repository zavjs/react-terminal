import { describe, it, expect } from 'vitest';
import { runCommand } from './runCommand';
import { resolveCommands } from '../commands';
import { Tree } from '../types';

const cmds = resolveCommands();
const dir = (contents: Tree = {}): Tree[string] => ({ type: 'dir', contents });
const file = (content = ''): Tree[string] => ({ type: 'file', content });

describe('runCommand', () => {
  it('returns error for unknown command', () => {
    const { command, result, outputRedirected } = runCommand('foo', {}, [], cmds);
    expect(command).toBe('foo');
    expect(result.error).toBe('foo: command not found');
    expect(outputRedirected).toBe(false);
  });

  it('executes a known command and returns its output', () => {
    const { command, result, outputRedirected } = runCommand('echo hello', {}, [], cmds);
    expect(command).toBe('echo');
    expect(result.output).toBe('hello');
    expect(outputRedirected).toBe(false);
  });

  it('returns newTree when command modifies the filesystem', () => {
    const { result, newTree } = runCommand('touch file.ts', {}, [], cmds);
    expect(result.tree).toBeDefined();
    expect(newTree).toEqual({ 'file.ts': file() });
  });

  it('returns cwd change from cd', () => {
    const tree: Tree = { src: dir() };
    const { result } = runCommand('cd src', tree, [], cmds);
    expect(result.cwd).toEqual(['src']);
  });

  it('returns clear flag from clear', () => {
    const { result } = runCommand('clear', {}, [], cmds);
    expect(result.clear).toBe(true);
  });

  it('redirects output to file with >', () => {
    const { newTree, outputRedirected } = runCommand('echo hello > out.txt', {}, [], cmds);
    expect(outputRedirected).toBe(true);
    expect(newTree).toEqual({ 'out.txt': file('hello') });
  });

  it('appends output to file with >>', () => {
    const tree: Tree = { 'out.txt': file('hello') };
    const { newTree, outputRedirected } = runCommand('echo world >> out.txt', tree, [], cmds);
    expect(outputRedirected).toBe(true);
    expect((newTree?.['out.txt'] as any).content).toBe('helloworld');
  });

  it('does not redirect when command errors', () => {
    const { outputRedirected, redirectError } = runCommand('cat missing.ts > out.txt', {}, [], cmds);
    expect(outputRedirected).toBe(false);
    expect(redirectError).toBeUndefined();
  });

  it('returns redirectError when redirect target directory does not exist', () => {
    const { redirectError, outputRedirected } = runCommand('echo hi > missing/out.txt', {}, [], cmds);
    expect(outputRedirected).toBe(false);
    expect(redirectError).toMatch(/No such file or directory/);
  });

  it('still applies command tree changes when redirect fails', () => {
    const { result, newTree } = runCommand('echo hi > missing/out.txt', {}, [], cmds);
    // echo has no tree changes, newTree should be undefined
    expect(newTree).toBeUndefined();
    expect(result.output).toBe('hi');
  });
});
