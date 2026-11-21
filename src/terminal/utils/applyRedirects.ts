import { Tree } from '../types';
import { writeFile, getFileContent } from './writeFile';
import type { Redirect } from './lex';

export const applyRedirects = (
  tree: Tree,
  cwd: string[],
  redirects: Redirect[],
  output: string | string[] | undefined
): Tree | string => {
  if (!redirects.length || output === undefined) return tree;

  const content = Array.isArray(output) ? output.join('\n') : output;
  let current = tree;

  for (const { op, target } of redirects) {
    const segments = target.split('/').filter(Boolean);
    const fileName = segments[segments.length - 1];
    const dirPath = segments.slice(0, -1);

    const finalContent = op === '>>'
      ? getFileContent(current, [...cwd, ...dirPath], fileName) + content
      : content;

    const result = writeFile(current, [...cwd, ...dirPath], fileName, finalContent);
    if (typeof result === 'string') return result;
    current = result;
  }

  return current;
};
