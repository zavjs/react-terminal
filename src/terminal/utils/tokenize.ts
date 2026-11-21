const expandBraces = (token: string): string[] => {
  const match = token.match(/^(.*)\{([^}]+)\}(.*)$/);
  if (!match) return [token];
  const [, prefix, inner, suffix] = match;
  return inner.split(',').map(p => `${prefix}${p.trim()}${suffix}`);
};

export const tokenize = (raw: string): string[] => {
  if (!raw.trim()) return [];

  const tokens: string[] = [];
  let current = '';
  let depth = 0;
  let quote: '"' | "'" | null = null;

  for (const char of raw.trim()) {
    if (quote) {
      if (char === quote) { quote = null; }
      else { current += char; }
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '{') { depth++; current += char; }
    else if (char === '}') { depth--; current += char; }
    else if (char === ' ' && depth === 0) { if (current) { tokens.push(current); current = ''; } }
    else { current += char; }
  }
  if (current) tokens.push(current);

  return tokens.flatMap(expandBraces);
};
