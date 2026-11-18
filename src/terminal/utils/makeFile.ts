import { Tree, DirNode, isDir } from '../types';

export const makeFile = (
  tree: Tree,
  parts: string[],
  file: string
): Tree | string => {
  if (parts.length === 0) {
    return { ...tree, [file]: { type: 'file' as const, content: '' } };
  }

  const [head, ...rest] = parts;
  const node = tree[head];

  if (!node || !isDir(node)) {
    return `${head}: no such file or directory`;
  }

  const result = makeFile((node as DirNode).contents, rest, file);
  if (typeof result === 'string') return result;

  return { ...tree, [head]: { ...node, contents: result } };
};
