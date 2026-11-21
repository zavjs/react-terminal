import { Tree, DirNode, isDir } from '../types';

export const removeNode = (tree: Tree, parts: string[]): Tree | string => {
  if (!parts.length) return tree;

  const [head, ...rest] = parts;

  if (rest.length === 0) {
    if (!(head in tree)) return `${head}: No such file or directory`;
    const { [head]: _, ...remaining } = tree;
    return remaining;
  }

  const node = tree[head];
  if (!node || !isDir(node)) return `${head}: No such file or directory`;

  const result = removeNode((node as DirNode).contents, rest);
  if (typeof result === 'string') return result;

  return { ...tree, [head]: { ...node, contents: result } };
};
