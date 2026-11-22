import type { TerminalProfile } from '../terminal';

type TerminalStorageV1 = {
  version: 1;
  activeProfileKey: string;
  profiles: Record<string, TerminalProfile>;
};

const STORAGE_KEY = 'react-terminal';

const read = (): TerminalStorageV1 | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1) return null;
    return parsed as TerminalStorageV1;
  } catch {
    return null;
  }
};

const write = (data: TerminalStorageV1) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

export const storage = {
  getActiveProfileKey: (): string | null => read()?.activeProfileKey ?? null,
  getSavedProfiles: (): Record<string, TerminalProfile> => read()?.profiles ?? {},
  save: (activeProfileKey: string, profiles: Record<string, TerminalProfile>) => {
    write({ version: 1, activeProfileKey, profiles });
  },
};
