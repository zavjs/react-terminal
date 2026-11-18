import { Command } from '../types';
import { getContentsList } from '../utils/path';
import { makeTree } from '../utils/makeTree';

const mkdir: Command = {
  name: 'mkdir',
  description: "mkdir: create a directory  —  `mkdir <name>` or `mkdir a b`",
  execute({ args }, { tree, cwd }) {
    if (!args.length) return { error: 'mkdir: missing operand' };
    let current = tree;
    for (const arg of args) {
      const parts = getContentsList(arg);
      const result = makeTree(current, [...cwd, ...parts]);
      if (typeof result === 'string') return { error: result };
      current = result;
    }
    return { tree: current };
  },
};

export default mkdir;
