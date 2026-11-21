import { Command, isDir } from '../types';
import { getNodeAtPath } from '../utils/path';

const cat: Command = {
  name: 'cat',
  description: 'cat: display file contents  —  `cat <file>`',
  execute(argv, { tree, cwd }) {
    const arg = argv[0];
    if (!arg) return { error: 'cat: missing operand' };

    const segments = arg.split('/').filter(Boolean);
    const fileName = segments[segments.length - 1];
    const dirPath = segments.slice(0, -1);

    const dir = getNodeAtPath(tree, [...cwd, ...dirPath]);
    if (!dir) return { error: `cat: ${arg}: No such file or directory` };

    const node = dir[fileName];
    if (!node) return { error: `cat: ${arg}: No such file or directory` };
    if (isDir(node)) return { error: `cat: ${arg}: Is a directory` };

    return { output: node.content };
  },
};

export default cat;
