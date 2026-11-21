import { describe, it, expect } from 'vitest';
import { parseArgs } from './parseArgs';

describe('parseArgs', () => {
  it('returns empty for empty array', () => {
    const result = parseArgs([]);
    expect(result.flags.size).toBe(0);
    expect(result.args).toEqual([]);
  });

  it('parses a single positional arg', () => {
    expect(parseArgs(['src']).args).toEqual(['src']);
  });

  it('parses multiple positional args', () => {
    expect(parseArgs(['a.ts', 'b.ts']).args).toEqual(['a.ts', 'b.ts']);
  });

  it('parses short flag', () => {
    const result = parseArgs(['-r']);
    expect(result.flags.has('r')).toBe(true);
    expect(result.args).toEqual([]);
  });

  it('parses combined short flags', () => {
    const result = parseArgs(['-rf']);
    expect(result.flags.has('r')).toBe(true);
    expect(result.flags.has('f')).toBe(true);
  });

  it('parses long flag', () => {
    const result = parseArgs(['--dry-run']);
    expect(result.flags.has('dry-run')).toBe(true);
  });

  it('parses flags and args together', () => {
    const result = parseArgs(['-rf', 'src']);
    expect(result.flags.has('r')).toBe(true);
    expect(result.flags.has('f')).toBe(true);
    expect(result.args).toEqual(['src']);
  });
});
