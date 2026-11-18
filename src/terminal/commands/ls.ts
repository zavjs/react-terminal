import { Command } from '../types';
import { getNodeAtPath } from '../utils/path';

const ls: Command = {
  name: 'ls',
  description: 'ls: list contents of current directory',
  execute(_, { tree, cwd }) {
    const node = getNodeAtPath(tree, cwd) ?? tree;
    const keys = Object.keys(node);
    return { output: keys.length ? keys.join('  ') : '' };
  },
};

export default ls;
