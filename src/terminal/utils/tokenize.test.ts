import { describe, it, expect } from 'vitest';
import { tokenize } from './tokenize';

describe('tokenize', () => {
  it('returns empty array for empty string', () => {
    expect(tokenize('')).toEqual([]);
    expect(tokenize('   ')).toEqual([]);
  });

  it('splits by spaces', () => {
    expect(tokenize('a b c')).toEqual(['a', 'b', 'c']);
  });

  it('handles multiple spaces', () => {
    expect(tokenize('a  b')).toEqual(['a', 'b']);
  });

  it('expands brace syntax', () => {
    expect(tokenize('{a.ts,b.ts}')).toEqual(['a.ts', 'b.ts']);
  });

  it('expands brace syntax with prefix', () => {
    expect(tokenize('src/{a.ts,b.ts}')).toEqual(['src/a.ts', 'src/b.ts']);
  });

  it('trims spaces inside braces', () => {
    expect(tokenize('{a.ts, b.ts}')).toEqual(['a.ts', 'b.ts']);
  });

  it('does not split on spaces inside braces', () => {
    expect(tokenize('{a, b}')).toEqual(['a', 'b']);
  });

  it('mixes plain tokens and brace expansion', () => {
    expect(tokenize('-r {a,b}')).toEqual(['-r', 'a', 'b']);
  });
});
