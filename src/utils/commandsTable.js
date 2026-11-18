module.exports = {
  mkdir: {
    name: "mkdir",
    description: "mkdir: create a directory  —  `mkdir <name>` or `mkdir {a,b}`"
  },
  touch: {
    name: "touch",
    description: "touch: create a file  —  `touch <name>` or `touch {a.ext,b.ext}`"
  },
  ls: {
    name: "ls",
    description: "ls: list contents of current directory"
  },
  cd: {
    name: "cd",
    description: "cd: change directory  —  `cd <name>` or `cd ..` to go up"
  },
  pwd: {
    name: "pwd",
    description: "pwd: print current directory path"
  },
  clear: {
    name: "clear",
    description: "clear: clear terminal output"
  },
  rm: {
    name: "rm",
    description: "rm: delete a file  —  `rm <name>` or `rm {a,b,c}`",
    disabled: true
  }
};
