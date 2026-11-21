import { useState, useCallback, useMemo } from 'react';
import { nanoid } from 'nanoid';
import type { Tree, LogEntry, TerminalProps } from '../types';
import { resolveCommands } from '../commands';
import { runCommand } from '../utils/runCommand';

export const useTerminal = ({
  commands: extraCommands = [],
  username = 'user',
  machineName = 'computer',
  initialTree = {},
  onCommand,
}: TerminalProps) => {
  const [tree, setTree] = useState<Tree>(initialTree);
  const [cwd, setCwd] = useState<string[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastLogin] = useState(() => new Date().toUTCString());

  const allCommands = useMemo(() => resolveCommands(extraCommands), [extraCommands]);

  const prompt = `${machineName}:~${cwd.length ? '/' + cwd.join('/') : ''} ${username}$`;

  const appendLog = useCallback((text: string | string[], type: 'output' | 'error' = 'output') => {
    const entries = (Array.isArray(text) ? text : [text]).map(t => ({
      id: nanoid(),
      type,
      text: t,
    }));
    setLog(prev => [...prev, ...entries]);
  }, []);

  const execute = useCallback((raw: string) => {
    const { command, result, newTree, outputRedirected, redirectError } =
      runCommand(raw, tree, cwd, allCommands);

    if (newTree) setTree(newTree);
    if (result.cwd !== undefined) setCwd(result.cwd);
    if (result.clear) setLog([]);

    if (redirectError) appendLog(redirectError, 'error');
    else if (!outputRedirected) {
      if (result.output) appendLog(result.output);
      if (result.error) appendLog(result.error, 'error');
    }

    onCommand?.(command, result);
  }, [tree, cwd, allCommands, appendLog, onCommand]);

  const submitInput = useCallback((value: string, currentPrompt: string) => {
    setLog(prev => [...prev, { id: nanoid(), type: 'echo', prompt: currentPrompt, command: value }]);
    setHistory(prev => [...prev, value]);
    setHistoryIndex(-1);
    execute(value);
  }, [execute]);

  return {
    log,
    history,
    historyIndex,
    setHistoryIndex,
    lastLogin,
    prompt,
    appendLog,
    execute,
    submitInput,
  };
};
