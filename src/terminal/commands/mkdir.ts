import { Command } from '../types';
import { getContentsList } from '../utils/path';
import { makeTree } from '../utils/makeTree';

const mkdir: Command = {
  name: 'mkdir',
  description: "mkdir: create a directory  —  `mkdir <name>` or `mkdir {a,b}`",
  execute(arg, { tree, cwd }) {
    if (!arg) return { error: 'mkdir: missing operand' };
    const parts = getContentsList(arg);
    const result = makeTree(tree, [...cwd, ...parts]);
    if (typeof result === 'string') return { error: result };
    return { tree: result };
  },
};

export default mkdir;
