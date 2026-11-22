import { useCallback } from 'react';
import type { Tree, Command } from '../types';
import { isDir } from '../types';
import { getNodeAtPath } from '../utils/path';

export const useCompletion = (
  tree: Tree,
  cwd: string[],
  allCommands: Record<string, Command>
) => {
  const complete = useCallback((input: string): string[] => {
    if (input.indexOf(' ') === -1) {
      return Object.keys(allCommands)
        .filter(cmd => cmd.startsWith(input) && cmd !== input)
        .sort();
    }

    const lastSpace = input.lastIndexOf(' ');
    const cmdPart = input.slice(0, lastSpace + 1);
    const lastToken = input.slice(lastSpace + 1);

    const slashIdx = lastToken.lastIndexOf('/');
    const dirStr = slashIdx === -1 ? '' : lastToken.slice(0, slashIdx + 1);
    const prefix = slashIdx === -1 ? lastToken : lastToken.slice(slashIdx + 1);

    const dirParts = dirStr ? dirStr.split('/').filter(Boolean) : [];
    const dirContents = getNodeAtPath(tree, [...cwd, ...dirParts]);
    if (!dirContents) return [];

    return Object.entries(dirContents)
      .filter(([name]) => name.startsWith(prefix))
      .map(([name, node]) => `${cmdPart}${dirStr}${name}${isDir(node) ? '/' : ''}`)
      .sort();
  }, [tree, cwd, allCommands]);

  return { complete };
};
