import { Command } from '../types';

const help: Command = {
  name: 'help',
  description: 'help: list available commands',
  execute(argv, { allCommands }) {
    const arg = argv[0];
    if (arg && allCommands[arg]) {
      return { output: allCommands[arg].description };
    }
    return {
      output: Object.values(allCommands).map(cmd => `- ${cmd.description}`),
    };
  },
};

export default help;
