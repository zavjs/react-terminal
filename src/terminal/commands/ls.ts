import { Command, isDir } from '../types';
import { getNodeAtPath } from '../utils/path';

const ls: Command = {
  name: 'ls',
  description: 'ls: list contents of current directory',
  execute(_, { tree, cwd }) {
    const node = getNodeAtPath(tree, cwd) ?? tree;
    const entries = Object.entries(node).map(([name, n]) => isDir(n) ? `${name}/` : name);
    return { output: entries.length ? entries.join('  ') : '' };
  },
};

export default ls;
