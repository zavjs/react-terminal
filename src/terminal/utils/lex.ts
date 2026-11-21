type WordToken = { type: 'word'; value: string };
type RedirectToken = { type: 'redirect'; op: '>' | '>>'; target: string };
type Token = WordToken | RedirectToken;

export type Redirect = { op: '>' | '>>'; target: string };
export type ParsedCommand = { argv: string[]; redirects: Redirect[] };

const expandBraces = (value: string): string[] => {
  const match = value.match(/^(.*)\{([^}]+)\}(.*)$/);
  if (!match) return [value];
  const [, prefix, inner, suffix] = match;
  return inner.split(',').map(p => `${prefix}${p.trim()}${suffix}`);
};

export const lex = (raw: string): Token[] => {
  const tokens: Token[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;
  let depth = 0;
  let i = 0;
  const src = raw.trim();

  const flushWord = () => {
    if (current) { tokens.push({ type: 'word', value: current }); current = ''; }
  };

  while (i < src.length) {
    const char = src[i];

    if (quote) {
      if (char === quote) { quote = null; }
      else { current += char; }
      i++;
      continue;
    }

    if (char === '"' || char === "'") { quote = char; i++; continue; }
    if (char === '{') { depth++; current += char; i++; continue; }
    if (char === '}') { depth--; current += char; i++; continue; }

    if (char === '>' && depth === 0) {
      flushWord();
      const op: '>' | '>>' = src[i + 1] === '>' ? '>>' : '>';
      i += op.length;
      while (i < src.length && src[i] === ' ') i++;
      let target = '';
      while (i < src.length && src[i] !== ' ' && src[i] !== '>') target += src[i++];
      if (target) tokens.push({ type: 'redirect', op, target });
      continue;
    }

    if (char === ' ' && depth === 0) { flushWord(); i++; continue; }

    current += char;
    i++;
  }
  flushWord();

  return tokens;
};

export const parse = (raw: string): ParsedCommand => {
  const tokens = lex(raw);
  const argv = tokens
    .filter((t): t is WordToken => t.type === 'word')
    .flatMap(t => expandBraces(t.value));
  const redirects = tokens
    .filter((t): t is RedirectToken => t.type === 'redirect')
    .map(({ op, target }) => ({ op, target }));
  return { argv, redirects };
};
