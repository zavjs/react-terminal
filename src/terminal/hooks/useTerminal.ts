import { useState, useCallback, useMemo, useRef } from 'react';
import { nanoid } from 'nanoid';
import type { Tree, LogEntry, TerminalProps, Bus } from '../types';
import { resolveCommands } from '../commands';
import { runCommand } from '../utils/runCommand';
import { useCompletion } from './useCompletion';
import { makeProgramCtx } from '../utils/makeProgramCtx';

const NOP_BUS: Bus = {
  send: () => {},
  on: () => () => {},
};

export const useTerminal = ({
  commands: extraCommands = [],
  username = 'user',
  machineName = 'computer',
  initialTree = {},
  tree: controlledTree,
  onTreeChange,
  onCommand,
  bus: externalBus,
}: TerminalProps) => {
  const [internalTree, setInternalTree] = useState<Tree>(initialTree);
  const isControlled = useRef(controlledTree !== undefined).current;
  const onTreeChangeRef = useRef(onTreeChange);
  onTreeChangeRef.current = onTreeChange;

  const tree = isControlled ? controlledTree! : internalTree;

  const setTree = useCallback((newTree: Tree) => {
    if (isControlled) {
      onTreeChangeRef.current?.(newTree);
    } else {
      setInternalTree(newTree);
    }
  }, [isControlled]);

  const [cwd, setCwd] = useState<string[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastLogin] = useState(() => new Date().toUTCString());
  const [isProgramRunning, setIsProgramRunning] = useState(false);

  const promptResolverRef = useRef<((value: string) => void) | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const treeRef = useRef(tree);
  treeRef.current = tree;

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
      runCommand(raw, tree, cwd, allCommands, history);

    if (newTree) setTree(newTree);
    if (result.cwd !== undefined) setCwd(result.cwd);
    if (result.clear) setLog([]);

    if (redirectError) appendLog(redirectError, 'error');
    else if (!outputRedirected) {
      if (result.output) appendLog(result.output);
      if (result.error) appendLog(result.error, 'error');
    }

    onCommand?.(command, result);

    if (result.program) {
      const program = result.program;
      const ac = new AbortController();
      abortControllerRef.current = ac;
      setIsProgramRunning(true);

      const ctx = makeProgramCtx({
        argv: raw.trim().split(/\s+/),
        signal: ac.signal,
        appendLog,
        promptResolverRef,
        treeRef,
        bus: externalBus ?? NOP_BUS,
      });

      program.run(ctx).finally(() => {
        abortControllerRef.current = null;
        promptResolverRef.current = null;
        setIsProgramRunning(false);
      });
    }
  }, [tree, cwd, allCommands, appendLog, onCommand, setTree, externalBus]);

  const submitInput = useCallback((value: string, currentPrompt: string) => {
    setLog(prev => [...prev, { id: nanoid(), type: 'echo', prompt: currentPrompt, command: value }]);
    setHistory(prev => [...prev, value]);
    setHistoryIndex(-1);
    execute(value);
  }, [execute]);

  const submitProgramInput = useCallback((value: string, currentPrompt: string) => {
    setLog(prev => [...prev, { id: nanoid(), type: 'echo', prompt: currentPrompt, command: value }]);
    const resolver = promptResolverRef.current;
    if (resolver) {
      promptResolverRef.current = null;
      resolver(value);
    }
  }, []);

  const abortProgram = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const navigateHistory = useCallback((dir: 'up' | 'down'): string | null => {
    if (dir === 'up') {
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      if (history[newIndex] === undefined) return null;
      setHistoryIndex(newIndex);
      return history[newIndex];
    }
    if (historyIndex === -1) return null;
    const newIndex = historyIndex + 1;
    if (newIndex >= history.length) {
      setHistoryIndex(-1);
      return '';
    }
    setHistoryIndex(newIndex);
    return history[newIndex];
  }, [history, historyIndex]);

  const clearLog = useCallback(() => setLog([]), []);
  const { complete } = useCompletion(tree, cwd, allCommands);

  return {
    log,
    lastLogin,
    prompt,
    submitInput,
    submitProgramInput,
    abortProgram,
    navigateHistory,
    clearLog,
    complete,
    isProgramRunning,
    appendLog,
  };
};
