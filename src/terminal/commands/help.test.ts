import { describe, it, expect } from 'vitest';
import help from './help';
import { resolveCommands } from './index';

const ctx = () => ({ tree: {}, cwd: [], allCommands: resolveCommands() });

describe('help', () => {
  it('lists all commands when no arg given', () => {
    const result = help.execute([], ctx());
    expect(Array.isArray(result.output)).toBe(true);
    expect((result.output as string[]).length).toBeGreaterThan(0);
  });

  it('returns specific command description when arg matches', () => {
    const result = help.execute(['mkdir'], ctx());
    expect(result.output).toBe(resolveCommands()['mkdir'].description);
  });

  it('falls back to listing all when arg does not match', () => {
    const result = help.execute(['nonexistent'], ctx());
    expect(Array.isArray(result.output)).toBe(true);
  });
});
