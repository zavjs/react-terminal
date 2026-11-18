import { describe, it, expect } from 'vitest';
import clear from './clear';
import { resolveCommands } from './index';
import { parseArgs } from '../utils/parseArgs';

const ctx = () => ({ tree: {}, cwd: [], allCommands: resolveCommands() });

describe('clear', () => {
  it('returns clear flag', () => {
    expect(clear.execute(parseArgs(undefined), ctx())).toEqual({ clear: true });
  });
});
