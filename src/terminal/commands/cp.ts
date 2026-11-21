import { Command, DirNode, TreeNode, isDir } from '../types';
import type { Tree } from '../types';
import { parseArgs } from '../utils/parseArgs';
import { getContentsList } from '../utils/path';

const getNode = (tree: Tree, path: string[]): TreeNode | undefined => {
  if (!path.length) return undefined;
  const [head, ...rest] = path;
  const node = tree[head];
  if (!node) return undefined;
  if (!rest.length) return node;
  if (!isDir(node)) return undefined;
  return getNode((node as DirNode).contents, rest);
};

const insertNode = (tree: Tree, path: string[], node: TreeNode): Tree | string => {
  if (path.length === 1) return { ...tree, [path[0]]: node };
  const [head, ...rest] = path;
  const existing = tree[head];
  if (!existing || !isDir(existing)) return `${head}: No such file or directory`;
  const result = insertNode((existing as DirNode).contents, rest, node);
  if (typeof result === 'string') return result;
  return { ...tree, [head]: { ...existing, contents: result } };
};

const cp: Command = {
  name: 'cp',
  description: 'cp: copy a file or directory  —  `cp [-r] <src> <dest>`',
  execute(argv, { tree, cwd }) {
    const { flags, args } = parseArgs(argv);
    const recursive = flags.has('r') || flags.has('R');

    if (args.length < 2) return { error: 'cp: missing destination operand' };

    const [srcArg, destArg] = args;
    const srcPath = [...cwd, ...getContentsList(srcArg)];
    let destPath = [...cwd, ...getContentsList(destArg)];

    const srcNode = getNode(tree, srcPath);
    if (!srcNode) return { error: `cp: ${srcArg}: No such file or directory` };

    if (isDir(srcNode) && !recursive) {
      return { error: `cp: ${srcArg}: is a directory (did you mean cp -r?)` };
    }

    const destNode = getNode(tree, destPath);
    if (destNode && isDir(destNode)) {
      destPath = [...destPath, srcPath[srcPath.length - 1]];
    }

    const inserted = insertNode(tree, destPath, srcNode);
    if (typeof inserted === 'string') return { error: `cp: ${inserted}` };

    return { tree: inserted };
  },
};

export default cp;
