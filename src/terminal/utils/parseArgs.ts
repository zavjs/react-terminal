export type ParsedArgs = {
  flags: Set<string>;
  args: string[];
};

const splitTokens = (raw: string): string[] => {
  const tokens: string[] = [];
  let current = '';
  let depth = 0;
  for (const char of raw.trim()) {
    if (char === '{') { depth++; current += char; }
    else if (char === '}') { depth--; current += char; }
    else if (char === ' ' && depth === 0) { if (current) { tokens.push(current); current = ''; } }
    else { current += char; }
  }
  if (current) tokens.push(current);
  return tokens;
};

const expandBraces = (token: string): string[] => {
  const match = token.match(/^(.*)\{([^}]+)\}(.*)$/);
  if (!match) return [token];
  const [, prefix, inner, suffix] = match;
  return inner.split(',').map(p => `${prefix}${p.trim()}${suffix}`);
};

export const parseArgs = (raw: string | undefined): ParsedArgs => {
  if (!raw?.trim()) return { flags: new Set(), args: [] };

  const flags = new Set<string>();
  const args: string[] = [];

  const tokens = splitTokens(raw).flatMap(expandBraces);

  for (const token of tokens) {
    if (token.startsWith('--')) {
      flags.add(token.slice(2));
    } else if (token.startsWith('-') && token.length > 1) {
      for (const char of token.slice(1)) flags.add(char);
    } else {
      args.push(token);
    }
  }

  return { flags, args };
};
