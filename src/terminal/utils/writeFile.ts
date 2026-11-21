import { Tree, DirNode, FileNode, isDir } from '../types';

export const writeFile = (
  tree: Tree,
  parts: string[],
  file: string,
  content: string
): Tree | string => {
  if (parts.length === 0) {
    const existing = tree[file];
    if (existing && isDir(existing)) return `${file}: Is a directory`;
    return { ...tree, [file]: { type: 'file' as const, content } };
  }

  const [head, ...rest] = parts;
  const node = tree[head];

  if (!node || !isDir(node)) {
    return `${head}: No such file or directory`;
  }

  const result = writeFile((node as DirNode).contents, rest, file, content);
  if (typeof result === 'string') return result;

  return { ...tree, [head]: { ...node, contents: result } };
};

export const getFileContent = (tree: Tree, parts: string[], file: string): string => {
  if (parts.length === 0) {
    const node = tree[file];
    return node && !isDir(node) ? (node as FileNode).content : '';
  }
  const [head, ...rest] = parts;
  const node = tree[head];
  if (!node || !isDir(node)) return '';
  return getFileContent((node as DirNode).contents, rest, file);
};
