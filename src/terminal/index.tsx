import { useRef, useEffect, useCallback, useState } from 'react';
import type { TerminalProps } from './types';
import { useTerminal } from './hooks/useTerminal';
import { SettingsModal } from './components/SettingsModal';
import { SettingsDrawer } from './components/SettingsDrawer';
import styles from './Terminal.module.css';

const GearIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.92c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z" />
  </svg>
);

const Terminal = (props: TerminalProps) => {
  const { settingsDisplay = 'modal', profiles, profile, onProfileChange } = props;
  const { log, lastLogin, prompt, submitInput, navigateHistory, clearLog, complete } = useTerminal(props);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const completionsRef = useRef<string[]>([]);
  const completionIdxRef = useRef(0);

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

  const resetCompletion = () => {
    completionsRef.current = [];
    completionIdxRef.current = 0;
  };

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const input = inputRef.current?.textContent ?? '';
      if (!completionsRef.current.length) {
        completionsRef.current = complete(input);
        completionIdxRef.current = 0;
      }
      const matches = completionsRef.current;
      if (!matches.length) return;
      setInputValue(matches[completionIdxRef.current]);
      completionIdxRef.current = (completionIdxRef.current + 1) % matches.length;
      return;
    }

    resetCompletion();

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const value = navigateHistory('up');
      if (value !== null) setInputValue(value);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const value = navigateHistory('down');
      setInputValue(value ?? '');
      return;
    }

    if (event.ctrlKey && event.key === 'c') {
      event.preventDefault();
      setInputValue('');
      return;
    }

    if (event.ctrlKey && event.key === 'l') {
      event.preventDefault();
      clearLog();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const value = inputRef.current?.textContent?.trim() ?? '';
      setInputValue('');
      if (!value) return;
      submitInput(value, prompt);
    }
  }, [prompt, submitInput, navigateHistory, setInputValue, clearLog, complete]);

  const handleWrapperKeyDown = useCallback((event: React.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === ',') {
      event.preventDefault();
      setSettingsOpen(o => !o);
    }
  }, []);

  const cssVars = profile ? {
    '--term-bg': profile.text.background,
    '--term-fg': profile.text.foreground,
    '--term-font-family': profile.text.font.family,
    '--term-font-size': `${profile.text.font.size}px`,
  } as React.CSSProperties : {};

  return (
    <div className={styles.wrapper} style={cssVars} onKeyDown={handleWrapperKeyDown}>
      <div
        ref={containerRef}
        className={styles.container}
        onClick={() => inputRef.current?.focus()}
      >
        <div className={styles.menuBar}>
          <span className={`${styles.barOption} ${styles.red}`} />
          <span className={`${styles.barOption} ${styles.blue}`} />
          <span className={`${styles.barOption} ${styles.green}`} />
          <div className={styles.menuBarSpacer} />
          {profiles && profile && onProfileChange && (
            <button
              className={styles.settingsBtn}
              onClick={e => { e.stopPropagation(); setSettingsOpen(o => !o); }}
              title="Settings (⌘,)"
            >
              <GearIcon />
            </button>
          )}
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

      {profiles && profile && onProfileChange && settingsDisplay === 'modal' && settingsOpen && (
        <SettingsModal
          profiles={profiles}
          profile={profile}
          onChange={onProfileChange}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {profiles && profile && onProfileChange && settingsDisplay === 'drawer' && (
        <SettingsDrawer
          open={settingsOpen}
          profiles={profiles}
          profile={profile}
          onChange={onProfileChange}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default Terminal;
export type { TerminalProps, Command, CommandResult, Tree, TerminalProfile, CursorStyle } from './types';
