import { Command } from '../types';
import { getNodeAtPath } from '../utils/path';

const cd: Command = {
  name: 'cd',
  description: "cd: change directory  —  `cd <name>` or `cd ..` to go up",
  execute(arg, { tree, cwd }) {
    if (!arg || arg === '~') return { cwd: [] };

    const parts = arg.split('/').filter(p => p && p !== '.');
    let newCwd = [...cwd];

    for (const part of parts) {
      if (part === '..') {
        newCwd = newCwd.slice(0, -1);
      } else {
        newCwd = [...newCwd, part];
      }
    }

    const node = getNodeAtPath(tree, newCwd);
    if (node === null) {
      return { error: `cd: ${arg}: No such file or directory` };
    }

    return { cwd: newCwd };
  },
};

export default cd;
