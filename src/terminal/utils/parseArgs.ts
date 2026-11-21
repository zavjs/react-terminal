export type ParsedArgs = {
  flags: Set<string>;
  args: string[];
};

export const parseArgs = (argv: string[]): ParsedArgs => {
  const flags = new Set<string>();
  const args: string[] = [];

  for (const token of argv) {
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
