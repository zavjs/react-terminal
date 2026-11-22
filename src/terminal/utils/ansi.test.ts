import { describe, it, expect } from 'vitest';
import { parseAnsi } from './ansi';

describe('parseAnsi', () => {
  it('passes plain text through unchanged', () => {
    expect(parseAnsi('hello')).toEqual([{ text: 'hello', style: {} }]);
  });

  it('handles empty string', () => {
    expect(parseAnsi('')).toEqual([{ text: '', style: {} }]);
  });

  it('applies foreground color', () => {
    expect(parseAnsi('\x1b[31mhello')).toEqual([
      { text: 'hello', style: { color: '#cc0000' } },
    ]);
  });

  it('applies bright foreground color', () => {
    expect(parseAnsi('\x1b[91mhello')).toEqual([
      { text: 'hello', style: { color: '#ef2929' } },
    ]);
  });

  it('applies background color', () => {
    expect(parseAnsi('\x1b[42mhello')).toEqual([
      { text: 'hello', style: { backgroundColor: '#4e9a06' } },
    ]);
  });

  it('applies bold', () => {
    expect(parseAnsi('\x1b[1mhello')).toEqual([
      { text: 'hello', style: { fontWeight: 'bold' } },
    ]);
  });

  it('applies underline', () => {
    expect(parseAnsi('\x1b[4mhello')).toEqual([
      { text: 'hello', style: { textDecoration: 'underline' } },
    ]);
  });

  it('applies dim', () => {
    expect(parseAnsi('\x1b[2mhello')).toEqual([
      { text: 'hello', style: { opacity: 0.5 } },
    ]);
  });

  it('combines bold and color via semicolon params', () => {
    expect(parseAnsi('\x1b[1;32mgreen bold')).toEqual([
      { text: 'green bold', style: { color: '#4e9a06', fontWeight: 'bold' } },
    ]);
  });

  it('resets style on \\x1b[0m', () => {
    expect(parseAnsi('\x1b[31mred\x1b[0mnormal')).toEqual([
      { text: 'red', style: { color: '#cc0000' } },
      { text: 'normal', style: {} },
    ]);
  });

  it('resets style on bare \\x1b[m', () => {
    expect(parseAnsi('\x1b[31mred\x1b[mnormal')).toEqual([
      { text: 'red', style: { color: '#cc0000' } },
      { text: 'normal', style: {} },
    ]);
  });

  it('preserves text before first escape code', () => {
    expect(parseAnsi('before\x1b[31mafter')).toEqual([
      { text: 'before', style: {} },
      { text: 'after', style: { color: '#cc0000' } },
    ]);
  });

  it('applies true-color fg (38;2;r;g;b)', () => {
    expect(parseAnsi('\x1b[38;2;255;100;0mtext')).toEqual([
      { text: 'text', style: { color: 'rgb(255,100,0)' } },
    ]);
  });

  it('applies true-color bg (48;2;r;g;b)', () => {
    expect(parseAnsi('\x1b[48;2;0;128;255mtext')).toEqual([
      { text: 'text', style: { backgroundColor: 'rgb(0,128,255)' } },
    ]);
  });

  it('ignores unknown SGR codes without swallowing text', () => {
    expect(parseAnsi('\x1b[999mtext')).toEqual([
      { text: 'text', style: {} },
    ]);
  });

  it('accumulates styles across multiple codes', () => {
    expect(parseAnsi('\x1b[1m\x1b[31mtext')).toEqual([
      { text: 'text', style: { fontWeight: 'bold', color: '#cc0000' } },
    ]);
  });
});
