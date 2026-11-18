import { describe, it, expect } from 'vitest';
import touch from './touch';
import { resolveCommands } from './index';
import { Tree } from '../types';

const ctx = (tree: Tree = {}, cwd: string[] = []) => ({
  tree,
  cwd,
  allCommands: resolveCommands(),
});

describe('touch', () => {
  it('creates a file at root', () => {
    const result = touch.execute('index.ts', ctx());
    expect(result.tree).toMatchObject({ 'index.ts': { type: 'file', content: '' } });
  });

  it('creates a file inside an existing directory', () => {
    const tree: Tree = { src: { type: 'dir', contents: {} } };
    const result = touch.execute('index.ts', ctx(tree, ['src']));
    expect((result.tree?.src as any).contents['index.ts']).toMatchObject({ type: 'file', content: '' });
  });

  it('creates multiple files via brace syntax', () => {
    const result = touch.execute('{a.ts,b.ts}', ctx());
    expect(result.tree).toMatchObject({
      'a.ts': { type: 'file', content: '' },
      'b.ts': { type: 'file', content: '' },
    });
  });

  it('returns error when no argument given', () => {
    const result = touch.execute(undefined, ctx());
    expect(result.error).toBe('touch: missing operand');
  });

  it('returns error when target directory does not exist', () => {
    const result = touch.execute('src/index.ts', ctx());
    expect(result.error).toMatch(/no such file or directory/);
  });
});
