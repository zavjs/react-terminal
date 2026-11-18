export type FileNode = { type: 'file'; content: string };
export type DirNode = { type: 'dir'; contents: Tree };
export type TreeNode = FileNode | DirNode;
export type Tree = Record<string, TreeNode>;

export function isDir(node: TreeNode): node is DirNode {
  return node.type === 'dir';
}

export type CommandResult = {
  tree?: Tree;
  cwd?: string[];
  output?: string | string[];
  error?: string;
  clear?: boolean;
};

export type CommandContext = {
  tree: Tree;
  cwd: string[];
  allCommands: Record<string, Command>;
};

export type Command = {
  name: string;
  description: string;
  disabled?: boolean;
  execute: (arg: string | undefined, ctx: CommandContext) => CommandResult;
};

export type LogEntry =
  | { id: string; type: 'output'; text: string }
  | { id: string; type: 'error'; text: string }
  | { id: string; type: 'echo'; prompt: string; command: string };

export type TerminalProps = {
  commands?: Command[];
  username?: string;
  machineName?: string;
  initialTree?: Tree;
  onCommand?: (command: string, result: CommandResult) => void;
};
