import { Command, DirNode, isDir } from '../types';
import { parseArgs } from '../utils/parseArgs';
import { getContentsList } from '../utils/path';
import { removeNode } from '../utils/removeNode';
import type { Tree } from '../types';

const getNode = (tree: Tree, path: string[]): Tree[string] | undefined => {
  if (!path.length) return undefined;
  const [head, ...rest] = path;
  const node = tree[head];
  if (!node) return undefined;
  if (!rest.length) return node;
  if (!isDir(node)) return undefined;
  return getNode((node as DirNode).contents, rest);
};

const rm: Command = {
  name: 'rm',
  description: 'rm: remove files or directories  —  `rm [-rf] <path> ...`',
  execute(argv, { tree, cwd }) {
    const { flags, args } = parseArgs(argv);
    const recursive = flags.has('r') || flags.has('R');
    const force = flags.has('f');

    if (!args.length) return { error: 'rm: missing operand' };

    let current = tree;
    let changed = false;
    for (const arg of args) {
      const fullPath = [...cwd, ...getContentsList(arg)];
      const node = getNode(current, fullPath);

      if (!node) {
        if (force) continue;
        return { error: `rm: ${arg}: No such file or directory` };
      }

      if (isDir(node) && !recursive) {
        return { error: `rm: ${arg}: is a directory` };
      }

      const result = removeNode(current, fullPath);
      if (typeof result === 'string') return { error: `rm: ${result}` };
      current = result;
      changed = true;
    }

    return changed ? { tree: current } : {};
  },
};

export default rm;
