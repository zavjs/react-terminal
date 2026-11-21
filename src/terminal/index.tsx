import { useRef, useEffect, useCallback } from 'react';
import type { TerminalProps } from './types';
import { useTerminal } from './hooks/useTerminal';
import styles from './Terminal.module.css';

const Terminal = (props: TerminalProps) => {
  const { log, history, historyIndex, setHistoryIndex, lastLogin, prompt, submitInput } =
    useTerminal(props);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [log]);

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

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const newIndex = historyIndex === -1
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
      submitInput(value, prompt);
    }
  }, [history, historyIndex, prompt, submitInput, setInputValue, setHistoryIndex]);

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
