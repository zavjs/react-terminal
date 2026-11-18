import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { nanoid } from 'nanoid';
import type { Tree, LogEntry, TerminalProps, CommandResult } from './types';
import { resolveCommands } from './commands';
import styles from './Terminal.module.css';

const Terminal = ({
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

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const allCommands = useMemo(
    () => resolveCommands(extraCommands),
    [extraCommands]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [log, cwd]);

  const setInputValue = useCallback((text: string) => {
    const el = inputRef.current;
    if (!el) return;
    el.textContent = text;
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, []);

  const appendLog = useCallback((text: string | string[], isError = false) => {
    const entries = (Array.isArray(text) ? text : [text]).map(t => ({
      id: nanoid(),
      text: t,
      isError,
    }));
    setLog(prev => [...prev, ...entries]);
  }, []);

  const executeCommand = useCallback(
    (raw: string) => {
      const [command, ...rest] = raw.trim().split(' ');
      const arg = rest.join(' ') || undefined;
      const op = allCommands[command];

      let result: CommandResult = {};

      if (!op) {
        result = { error: `${command}: command not found` };
      } else {
        result = op.execute(arg, { tree, cwd, allCommands });
      }

      if (result.tree) setTree(result.tree);
      if (result.cwd !== undefined) setCwd(result.cwd);
      if (result.clear) setLog([]);
      if (result.output) appendLog(result.output);
      if (result.error) appendLog(result.error, true);

      onCommand?.(command, result);
    },
    [tree, cwd, allCommands, appendLog, onCommand]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        const newIndex =
          historyIndex === -1
            ? history.length - 1
            : Math.max(0, historyIndex - 1);
        if (history[newIndex] !== undefined) {
          setHistoryIndex(newIndex);
          setInputValue(history[newIndex]);
        }
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (historyIndex === -1) return;
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInputValue('');
        } else {
          setHistoryIndex(newIndex);
          setInputValue(history[newIndex]);
        }
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        const value = inputRef.current?.textContent?.trim() ?? '';
        if (!value) {
          setInputValue('');
          return;
        }
        setHistory(prev => [...prev, value]);
        setHistoryIndex(-1);
        executeCommand(value);
        setInputValue('');
      }
    },
    [history, historyIndex, executeCommand, setInputValue]
  );

  const prompt = `${machineName}:~${cwd.length ? '/' + cwd.join('/') : ''} ${username}$`;

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onClick={() => inputRef.current?.focus()}
    >
      <div className={styles.menuBar}>
        <span className={`${styles.barOption} ${styles.red}`} />
        <span className={`${styles.barOption} ${styles.blue}`} />
        <span className={`${styles.barOption} ${styles.green}`} />
      </div>
      <div className={styles.content}>
        <div className={styles.line}>Last Login: {lastLogin} on Console</div>
        <div className={styles.logLine}>
          Press `help` to see available commands
        </div>
        {log.map(entry => (
          <div
            key={entry.id}
            className={entry.isError ? styles.errorLine : styles.outputLine}
          >
            {entry.text}
          </div>
        ))}
        <div className={styles.inputLine}>
          <span className={styles.prompt}>{prompt}</span>
          <div
            ref={inputRef}
            className={styles.input}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
export type { TerminalProps, Command, CommandResult, Tree } from './types';
