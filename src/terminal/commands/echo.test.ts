import { describe, it, expect } from 'vitest';
import echo from './echo';
import { resolveCommands } from './index';

const ctx = () => ({ tree: {}, cwd: [], allCommands: resolveCommands() });

describe('echo', () => {
  it('returns empty output with no args', () => {
    expect(echo.execute([], ctx()).output).toBe('');
  });

  it('returns single word', () => {
    expect(echo.execute(['hello'], ctx()).output).toBe('hello');
  });

  it('joins multiple tokens with space', () => {
    expect(echo.execute(['hello', 'world'], ctx()).output).toBe('hello world');
  });

  it('returns pre-joined quoted string (quotes stripped by tokenize)', () => {
    expect(echo.execute(['hello world'], ctx()).output).toBe('hello world');
  });
});
