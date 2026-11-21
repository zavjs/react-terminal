import { describe, it, expect } from 'vitest';
import clear from './clear';
import { resolveCommands } from './index';

const ctx = () => ({ tree: {}, cwd: [], allCommands: resolveCommands() });

describe('clear', () => {
  it('returns clear flag', () => {
    expect(clear.execute([], ctx())).toEqual({ clear: true });
  });
});
