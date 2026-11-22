import { Command, DirNode, FileNode, isDir } from '../types';
import type { Tree, TreeNode } from '../types';
import { parseArgs } from '../utils/parseArgs';
import { getContentsList } from '../utils/path';

type Match = { file: string; line: string; lineNum: number };

const getNode = (tree: Tree, path: string[]): TreeNode | undefined =>
  path.reduce<TreeNode | undefined>((cur, seg) => {
    if (!cur || !isDir(cur)) return undefined;
    return (cur as DirNode).contents[seg];
  }, { type: 'dir', contents: tree });

const searchFile = (content: string, pattern: RegExp, filepath: string, invert: boolean): Match[] =>
  content.split('\n').flatMap((line, i) =>
    pattern.test(line) !== invert ? [{ file: filepath, line, lineNum: i + 1 }] : []
  );

const searchTree = (tree: Tree, pattern: RegExp, prefix: string, invert: boolean): Match[] =>
  Object.entries(tree).flatMap(([name, node]) => {
    const path = prefix ? `${prefix}/${name}` : name;
    if (isDir(node)) return searchTree((node as DirNode).contents, pattern, path, invert);
    return searchFile((node as FileNode).content, pattern, path, invert);
  });

const highlight = (line: string, pattern: RegExp): string => {
  const flags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g';
  return line.replace(new RegExp(pattern.source, flags), m => `\x1b[1;31m${m}\x1b[0m`);
};

const formatMatch = (m: Match, multiFile: boolean, lineNumbers: boolean, pattern: RegExp, invert: boolean): string => {
  const parts: string[] = [];
  if (multiFile) parts.push(`\x1b[35m${m.file}\x1b[0m`);
  if (lineNumbers) parts.push(`\x1b[32m${m.lineNum}\x1b[0m`);
  parts.push(invert ? m.line : highlight(m.line, pattern));
  return parts.join(':');
};

const grep: Command = {
  name: 'grep',
  description: 'grep: search file contents  —  `grep [-inrv] <pattern> <file|dir> ...`',
  execute(argv, { tree, cwd }) {
    const { flags, args } = parseArgs(argv);
    const caseInsensitive = flags.has('i');
    const lineNumbers = flags.has('n');
    const invert = flags.has('v');
    const recursive = flags.has('r') || flags.has('R');

    if (args.length < 2) return { error: 'grep: usage: grep [flags] <pattern> <file> ...' };

    const [rawPattern, ...targets] = args;

    let pattern: RegExp;
    try {
      pattern = new RegExp(rawPattern, caseInsensitive ? 'i' : '');
    } catch {
      return { error: `grep: invalid pattern: ${rawPattern}` };
    }

    const multiFile = targets.length > 1 || recursive;
    const allMatches: Match[] = [];

    for (const target of targets) {
      const node = getNode(tree, [...cwd, ...getContentsList(target)]);
      if (!node) return { error: `grep: ${target}: No such file or directory` };

      if (isDir(node)) {
        if (!recursive) return { error: `grep: ${target}: Is a directory` };
        allMatches.push(...searchTree((node as DirNode).contents, pattern, target, invert));
      } else {
        allMatches.push(...searchFile((node as FileNode).content, pattern, target, invert));
      }
    }

    const results = allMatches;

    if (!results.length) return {};

    return { output: results.map(m => formatMatch(m, multiFile, lineNumbers, pattern, invert)) };
  },
};

export default grep;
