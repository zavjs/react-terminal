# Changelog

| Change | What | Why |
|--------|------|-----|
| **React layer split** | `Terminal.tsx` split into `useTerminal` (state + dispatch), `runCommand` (pure execution), and a renderer-only component | `runCommand` testable without React; `useTerminal` reusable; renderer has no business logic |
| **Single-pass lexer** | `tokenize` + `parseRedirects` (two independent quote-tracking loops) replaced by one `lex()` pass emitting typed tokens, assembled by `parse()` into `{ argv, redirects }` | Two implementations of the same quote logic; adding more operators (pipes, `&&`) would have required a third |
| **Raw `argv[]` to commands** | `Command.execute` previously received pre-parsed `ParsedArgs { flags, args }`; now receives raw `string[]` with `parseArgs` as an opt-in utility | Pre-parsing imposed a fixed flag/arg shape on every command, blocking value-bearing flags (`-m "message"`) and custom syntax needed by injected commands |
| **Tree node type tag + file content** | `FileNode` was `{ name: string }` — name redundant (already the key), no content field | `type` discriminant makes the union explicit; `content: string` unblocks `cat`, `echo >`, and file seeding via `initialTree` |
| **Command-per-file architecture** | All commands were closures inside one factory function, re-created on every keystroke, no formal interface | One file per command, state passed as args not captured, auto-registration via `resolveCommands`, injectable `commands` prop for the git tutorial use case |
| **CRA → Vite + TypeScript rewrite** | 2018 Create React App, styled-components v3, no TypeScript, all state in App | Vite (library + demo build modes), CSS modules, TypeScript, state internal to `<Terminal>`, `contentEditable` input (eliminates password manager injection) |
