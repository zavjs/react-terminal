import { Command } from '../types';
import { getFilePath, getFileName } from '../utils/path';
import { makeFile } from '../utils/makeFile';

const touch: Command = {
  name: 'touch',
  description: "touch: create a file  —  `touch <name>` or `touch a.ext b.ext`",
  execute({ args }, { tree, cwd }) {
    if (!args.length) return { error: 'touch: missing operand' };
    let current = tree;
    for (const arg of args) {
      const parts = getFilePath(arg);
      const file = getFileName(arg);
      const result = makeFile(current, [...cwd, ...parts], file);
      if (typeof result === 'string') return { error: result };
      current = result;
    }
    return { tree: current };
  },
};

export default touch;
