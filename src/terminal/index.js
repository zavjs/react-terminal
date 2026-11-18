const terminal_utils = require("../utils/terminal");
const commandsTable = require("../utils/commandsTable");

const terminal = (tree, cwd = []) => {
  const handleTerminalResp = response => {
    if (typeof response === "object") {
      return { updated: response };
    } else {
      return { output: response };
    }
  };

  const mkdir = filePath => {
    if (!filePath) return { output: "mkdir: missing operand" };
    const parts = terminal_utils.get_contents_list(filePath);
    const updatedTree = terminal_utils.makeTree(tree, [...cwd, ...parts]);
    return handleTerminalResp(updatedTree);
  };

  const touch = fileName => {
    if (!fileName) return { output: "touch: missing operand" };
    const parts = terminal_utils.get_file_path(fileName);
    const file = terminal_utils.get_file_name(fileName);
    const updatedTree = terminal_utils.makeFile(tree, [...cwd, ...parts], file);
    return handleTerminalResp(updatedTree);
  };

  const ls = () => {
    const node = terminal_utils.get_node_at_path(tree, cwd) || tree;
    const keys = node && Object.keys(node);
    const output = keys && keys.length ? keys.join(" ") : [""];
    return { output };
  };

  const cd = arg => {
    if (!arg || arg === "~") return { cwd: [] };

    const parts = arg.split("/").filter(p => p && p !== ".");
    let newCwd = [...cwd];

    for (const part of parts) {
      if (part === "..") {
        newCwd = newCwd.slice(0, -1);
      } else {
        newCwd = [...newCwd, part];
      }
    }

    const node = terminal_utils.get_node_at_path(tree, newCwd);
    if (node === null) {
      return { output: `cd: ${arg}: No such file or directory` };
    }

    return { cwd: newCwd };
  };

  const pwd = () => ({
    output: cwd.length ? "/" + cwd.join("/") : "~"
  });

  const help = command => ({
    output: terminal_utils.define_command_listing(commandsTable, command)
  });

  return { ls, touch, mkdir, help, cd, pwd };
};

module.exports = terminal;
