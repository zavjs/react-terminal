import { Command } from '../types';

const help: Command = {
  name: 'help',
  description: 'help: list available commands',
  execute(arg, { allCommands }) {
    if (arg && allCommands[arg]) {
      return { output: allCommands[arg].description };
    }
    return {
      output: Object.values(allCommands).map(cmd => `- ${cmd.description}`),
    };
  },
};

export default help;
