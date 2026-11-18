import { Command } from '../types';

const clear: Command = {
  name: 'clear',
  description: 'clear: clear terminal output',
  execute: () => ({ clear: true }),
};

export default clear;
