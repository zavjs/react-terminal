export function abortableSleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException('Aborted', 'AbortError')); return; }
    const id = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(id);
      reject(new DOMException('Aborted', 'AbortError'));
    }, { once: true });
  });
}

export function abortablePrompt(
  signal: AbortSignal,
  resolverRef: { current: ((value: string) => void) | null },
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException('Aborted', 'AbortError')); return; }
    resolverRef.current = resolve;
    signal.addEventListener('abort', () => {
      resolverRef.current = null;
      reject(new DOMException('Aborted', 'AbortError'));
    }, { once: true });
  });
}
