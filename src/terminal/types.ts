export type FileNode = { name: string };
export type DirNode = { name: string; contents: Tree };
export type TreeNode = FileNode | DirNode;
export type Tree = Record<string, TreeNode>;

export function isDir(node: TreeNode): node is DirNode {
  return 'contents' in node;
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

export type LogEntry = {
  id: string;
  text: string;
  isError: boolean;
};

export type TerminalProps = {
  commands?: Command[];
  username?: string;
  machineName?: string;
  initialTree?: Tree;
  onCommand?: (command: string, result: CommandResult) => void;
};
