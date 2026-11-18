import { Tree, DirNode, isDir } from '../types';

const pathResolve = (parts: string[]): string[] => {
  if (parts[0] === '.' || parts[0] === '') return parts.slice(1);
  if (parts[0].startsWith('.')) {
    return parts.map((part, i) => (i === 0 ? part.slice(1) : part));
  }
  return parts;
};

export const getContentsList = (folderPath: string): string[] =>
  pathResolve(folderPath.split('/').filter(Boolean));

export const getFilePath = (pathToFile: string): string[] => {
  const parts = getContentsList(pathToFile);
  return parts.slice(0, -1);
};

export const getFileName = (pathToFile: string): string | string[] => {
  const fileName = pathToFile.split('/').slice(-1)[0].trim();
  if (fileName.startsWith('{') && fileName.endsWith('}')) {
    return fileName.slice(1, -1).split(',').map(f => f.trim());
  }
  return fileName;
};

export const getNodeAtPath = (tree: Tree, path: string[]): Tree | null =>
  path.reduce<Tree | null>((node, segment) => {
    if (!node || !node[segment] || !isDir(node[segment])) return null;
    return (node[segment] as DirNode).contents;
  }, tree);
