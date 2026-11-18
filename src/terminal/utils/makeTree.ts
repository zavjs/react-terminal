import { Tree, DirNode, isDir } from '../types';

export const makeTree = (tree: Tree, parts: string[]): Tree | string => {
  if (!parts.length) return tree;

  const [head, ...rest] = parts;

  if (rest.length === 0) {
    if (tree[head] && isDir(tree[head])) return tree;
    return { ...tree, [head]: { type: 'dir' as const, contents: {} } };
  }

  const node = tree[head];
  if (!node || !isDir(node)) {
    return parts.join('/') + ': no such file or directory';
  }

  const result = makeTree((node as DirNode).contents, rest);
  if (typeof result === 'string') return result;

  return { ...tree, [head]: { ...node, contents: result } };
};
