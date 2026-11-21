import { Tree, Command, CommandResult } from '../types';
import { parse } from './lex';
import { applyRedirects } from './applyRedirects';

export type RunCommandResult = {
  command: string;
  result: CommandResult;
  newTree?: Tree;
  outputRedirected: boolean;
  redirectError?: string;
};

export const runCommand = (
  raw: string,
  tree: Tree,
  cwd: string[],
  allCommands: Record<string, Command>
): RunCommandResult => {
  // shell layer: lex raw input into argv tokens and redirect operators
  const { argv, redirects } = parse(raw);
  const [command, ...rest] = argv;

  // dispatch: look up handler and execute with current filesystem state
  const handler = allCommands[command];
  const result: CommandResult = handler
    ? handler.execute(rest, { tree, cwd, allCommands })
    : { error: `${command}: command not found` };

  // redirect: if stdout should go to a file, write it instead of displaying
  // only applies when command produced output and did not itself error
  if (redirects.length && result.output !== undefined && !result.error) {
    const written = applyRedirects(result.tree ?? tree, cwd, redirects, result.output);
    if (typeof written === 'string') {
      // redirect failed (e.g. target dir missing) — command tree changes still apply
      return { command, result, newTree: result.tree, outputRedirected: false, redirectError: written };
    }
    return { command, result, newTree: written, outputRedirected: true };
  }

  return { command, result, newTree: result.tree, outputRedirected: false };
};
