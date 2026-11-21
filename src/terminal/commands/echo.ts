import { Command } from '../types';

const echo: Command = {
  name: 'echo',
  description: 'echo: print text  —  `echo <text>`',
  execute(argv) {
    return { output: argv.join(' ') };
  },
};

export default echo;
