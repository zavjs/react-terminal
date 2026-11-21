import { Command } from '../types';
import mkdir from './mkdir';
import touch from './touch';
import ls from './ls';
import cd from './cd';
import pwd from './pwd';
import clear from './clear';
import help from './help';
import cat from './cat';
import echo from './echo';

const builtinCommands: Command[] = [mkdir, touch, ls, cd, pwd, clear, help, cat, echo];

export const resolveCommands = (extra: Command[] = []): Record<string, Command> =>
  [...builtinCommands, ...extra].reduce<Record<string, Command>>((acc, cmd) => {
    if (!cmd.disabled) acc[cmd.name] = cmd;
    return acc;
  }, {});
