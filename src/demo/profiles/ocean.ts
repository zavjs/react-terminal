import type { TerminalProfile } from '../../terminal';

const ocean: TerminalProfile = {
  name: 'Ocean',
  text: {
    background: '#001b2e',
    foreground: '#a8d8ea',
    font: {
      family: "Menlo, Monaco, 'Courier New', monospace",
      size: 14,
    },
    cursorStyle: 'vertical-bar',
  },
};

export default ocean;
