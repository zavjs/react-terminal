import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { nanoid } from 'nanoid';
import type { Tree, LogEntry, TerminalProps, CommandResult } from './types';
import { resolveCommands } from './commands';
import { parseArgs } from './utils/parseArgs';
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

  const appendLog = useCallback((text: string | string[], type: 'output' | 'error' = 'output') => {
    const entries = (Array.isArray(text) ? text : [text]).map(t => ({
      id: nanoid(),
      type,
      text: t,
    }));
    setLog(prev => [...prev, ...entries]);
  }, []);

  const executeCommand = useCallback(
    (raw: string) => {
      const [command, ...rest] = raw.trim().split(' ');
      const op = allCommands[command];

      let result: CommandResult = {};

      if (!op) {
        result = { error: `${command}: command not found` };
      } else {
        result = op.execute(parseArgs(rest.join(' ')), { tree, cwd, allCommands });
      }

      if (result.tree) setTree(result.tree);
      if (result.cwd !== undefined) setCwd(result.cwd);
      if (result.clear) setLog([]);
      if (result.output) appendLog(result.output);
      if (result.error) appendLog(result.error, 'error');

      onCommand?.(command, result);
    },
    [tree, cwd, allCommands, appendLog, onCommand]
  );

  const prompt = `${machineName}:~${cwd.length ? '/' + cwd.join('/') : ''} ${username}$`;

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
        setInputValue('');
        if (!value) return;
        setLog(prev => [...prev, { id: nanoid(), type: 'echo', prompt, command: value }]);
        setHistory(prev => [...prev, value]);
        setHistoryIndex(-1);
        executeCommand(value);
      }
    },
    [history, historyIndex, prompt, executeCommand, setInputValue]
  );

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
        {log.map(entry => {
          if (entry.type === 'echo') {
            return (
              <div key={entry.id} className={styles.inputLine}>
                <span className={styles.prompt}>{entry.prompt}</span>
                <span className={styles.echoCommand}>{entry.command}</span>
              </div>
            );
          }
          return (
            <div
              key={entry.id}
              className={entry.type === 'error' ? styles.errorLine : styles.outputLine}
            >
              {entry.text}
            </div>
          );
        })}
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
