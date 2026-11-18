import { Tree, DirNode, isDir } from '../types';

const createFiles = (tree: Tree, files: string[]): Tree =>
  files.reduce((acc, name) => ({ ...acc, [name]: { type: 'file' as const, content: '' } }), { ...tree });

export const makeFile = (
  tree: Tree,
  parts: string[],
  file: string | string[]
): Tree | string => {
  const files = Array.isArray(file) ? file : [file];

  if (parts.length === 0) {
    return createFiles(tree, files);
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
