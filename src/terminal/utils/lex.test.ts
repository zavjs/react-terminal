import { describe, it, expect } from 'vitest';
import { lex, parse } from './lex';

describe('lex', () => {
  it('produces word tokens for plain input', () => {
    expect(lex('echo hello')).toEqual([
      { type: 'word', value: 'echo' },
      { type: 'word', value: 'hello' },
    ]);
  });

  it('strips double quotes and keeps content as single token', () => {
    expect(lex('"hello world"')).toEqual([{ type: 'word', value: 'hello world' }]);
  });

  it('strips single quotes', () => {
    expect(lex("'hello world'")).toEqual([{ type: 'word', value: 'hello world' }]);
  });

  it('produces redirect token for >', () => {
    expect(lex('echo hi > file.txt')).toEqual([
      { type: 'word', value: 'echo' },
      { type: 'word', value: 'hi' },
      { type: 'redirect', op: '>', target: 'file.txt' },
    ]);
  });

  it('produces redirect token for >>', () => {
    expect(lex('echo hi >> file.txt')).toEqual([
      { type: 'word', value: 'echo' },
      { type: 'word', value: 'hi' },
      { type: 'redirect', op: '>>', target: 'file.txt' },
    ]);
  });

  it('handles redirect with no spaces', () => {
    expect(lex('echo hi>file.txt')).toEqual([
      { type: 'word', value: 'echo' },
      { type: 'word', value: 'hi' },
      { type: 'redirect', op: '>', target: 'file.txt' },
    ]);
  });

  it('does not treat > inside quotes as redirect', () => {
    expect(lex('echo "a > b"')).toEqual([
      { type: 'word', value: 'echo' },
      { type: 'word', value: 'a > b' },
    ]);
  });

  it('keeps brace tokens intact for later expansion', () => {
    expect(lex('touch {a,b}.ts')).toEqual([
      { type: 'word', value: 'touch' },
      { type: 'word', value: '{a,b}.ts' },
    ]);
  });
});

describe('parse', () => {
  it('returns argv and empty redirects for plain command', () => {
    expect(parse('ls')).toEqual({ argv: ['ls'], redirects: [] });
  });

  it('expands braces in argv', () => {
    expect(parse('touch {a,b}.ts')).toEqual({
      argv: ['touch', 'a.ts', 'b.ts'],
      redirects: [],
    });
  });

  it('extracts redirect into redirects array', () => {
    expect(parse('echo hi > file.txt')).toEqual({
      argv: ['echo', 'hi'],
      redirects: [{ op: '>', target: 'file.txt' }],
    });
  });

  it('extracts >> into redirects array', () => {
    expect(parse('echo hi >> file.txt')).toEqual({
      argv: ['echo', 'hi'],
      redirects: [{ op: '>>', target: 'file.txt' }],
    });
  });

  it('handles quoted string as single argv entry', () => {
    expect(parse('echo "hello world" > out.txt')).toEqual({
      argv: ['echo', 'hello world'],
      redirects: [{ op: '>', target: 'out.txt' }],
    });
  });

  it('returns empty argv for empty string', () => {
    expect(parse('')).toEqual({ argv: [], redirects: [] });
  });
});
