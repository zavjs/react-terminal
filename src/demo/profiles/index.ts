import type { TerminalProfile } from '../../terminal';
import basic from './basic';
import ocean from './ocean';

export const profiles: Record<string, TerminalProfile> = {
  basic,
  ocean,
};

export const defaultProfileKey = 'basic';
