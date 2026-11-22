import { Command } from '../types';

const history: Command = {
  name: 'history',
  description: 'history: print command history',
  execute(_, { history = [] }) {
    if (!history.length) return {};
    return { output: history.map((cmd, i) => `${i + 1}  ${cmd}`) };
  },
};

export default history;
