import { Command } from '../types';
import { getFilePath, getFileName } from '../utils/path';
import { makeFile } from '../utils/makeFile';

const touch: Command = {
  name: 'touch',
  description: "touch: create a file  —  `touch <name>` or `touch {a.ext,b.ext}`",
  execute(arg, { tree, cwd }) {
    if (!arg) return { error: 'touch: missing operand' };
    const parts = getFilePath(arg);
    const file = getFileName(arg);
    const result = makeFile(tree, [...cwd, ...parts], file);
    if (typeof result === 'string') return { error: result };
    return { tree: result };
  },
};

export default touch;
