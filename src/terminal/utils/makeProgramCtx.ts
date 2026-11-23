import type { ProgramCtx, Tree, Bus } from '../types';
import { abortablePrompt, abortableSleep } from './abortable';

type ProgramCtxOptions = {
  argv: string[];
  signal: AbortSignal;
  appendLog: (text: string, type?: 'output' | 'error') => void;
  promptResolverRef: { current: ((value: string) => void) | null };
  treeRef: { current: Tree };
  bus: Bus;
};

export function makeProgramCtx({
  argv,
  signal,
  appendLog,
  promptResolverRef,
  treeRef,
  bus,
}: ProgramCtxOptions): ProgramCtx {
  return {
    argv,
    print: (text) => appendLog(text, 'output'),
    printError: (text) => appendLog(text, 'error'),
    prompt: (label?) => {
      if (label) appendLog(label, 'output');
      return abortablePrompt(signal, promptResolverRef);
    },
    sleep: (ms) => abortableSleep(ms, signal),
    signal,
    get tree() { return treeRef.current; },
    bus,
  };
}
