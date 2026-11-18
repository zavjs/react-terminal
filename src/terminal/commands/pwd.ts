import { Command } from '../types';

const pwd: Command = {
  name: 'pwd',
  description: 'pwd: print current directory path',
  execute(_, { cwd }) {
    return { output: cwd.length ? '/' + cwd.join('/') : '~' };
  },
};

export default pwd;
