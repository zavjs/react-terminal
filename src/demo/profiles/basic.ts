import type { TerminalProfile } from '../../terminal';

const basic: TerminalProfile = {
  name: 'Basic',
  text: {
    background: '#000000',
    foreground: '#ffffff',
    font: {
      family: "Monaco, Menlo, 'Courier New', monospace",
      size: 14,
    },
    cursorStyle: 'block',
  },
};

export default basic;
