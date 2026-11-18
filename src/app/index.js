import React from "react";
import Terminal from "./components/Terminal";
import Greeting from "./Greeting";
import terminalMod from "../terminal";
import "./index.css";

class App extends React.Component {
  containerRef = React.createRef();
  inputRef = React.createRef();

  state = {
    tree: {},
    log: [],
    lastLogin: "",
    cwd: [],
    history: [],
    historyIndex: -1
  };

  componentWillMount = () => {
    this.setState({ lastLogin: new Date().toUTCString() });
  };

  componentDidMount = () => {
    if (this.inputRef.current) this.inputRef.current.focus();
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.log !== this.state.log || prevState.cwd !== this.state.cwd) {
      if (this.containerRef.current) {
        this.containerRef.current.scrollTop = this.containerRef.current.scrollHeight;
      }
    }
  }

  setInputValue = text => {
    const el = this.inputRef.current;
    if (!el) return;
    el.textContent = text;
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  enterCommand = event => {
    const { history, historyIndex } = this.state;

    if (event.keyCode === 38) {
      event.preventDefault();
      const newIndex =
        historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      if (history[newIndex] !== undefined) {
        this.setState({ historyIndex: newIndex });
        this.setInputValue(history[newIndex]);
      }
      return;
    }

    if (event.keyCode === 40) {
      event.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        this.setState({ historyIndex: -1 });
        this.setInputValue("");
      } else {
        this.setState({ historyIndex: newIndex });
        this.setInputValue(history[newIndex]);
      }
      return;
    }

    if (event.keyCode === 13) {
      event.preventDefault();
      const value = this.inputRef.current ? this.inputRef.current.textContent.trim() : "";
      if (!value) {
        this.setInputValue("");
        return;
      }
      this.setState(({ history }) => ({
        history: history.concat(value),
        historyIndex: -1
      }));
      const [command, ...rest] = value.split(" ");
      const argument = rest.join(" ") || undefined;
      this.executeCommand(command, argument);
    }
  };

  isSpecialCommand = command => {
    const commands = { clear: { execute: this.cleanLog } };
    const toLower = command.toLowerCase();
    const target = commands[toLower] && commands[toLower].execute;
    return target ? target : null;
  };

  executeCommand = (command, argument) => {
    const { tree, cwd } = this.state;
    const operation = terminalMod(tree, cwd)[command];
    const specialCommand = this.isSpecialCommand(command);

    if (operation) {
      const ret = operation(argument);

      if (ret.updated) {
        this.setState({ tree: ret.updated });
      }

      if (ret.cwd !== undefined) {
        this.setState({ cwd: ret.cwd });
      }

      if (ret.output) {
        this.setState(({ log }) => ({ log: log.concat(ret.output) }));
      }
    } else if (specialCommand) {
      specialCommand();
    } else {
      this.setState(({ log }) => ({
        log: log.concat([`Unknown command: ${command}`])
      }));
    }

    this.setInputValue("");
  };

  cleanLog = () => {
    this.setState({ log: [] });
  };

  render() {
    const { lastLogin, cwd } = this.state;

    return (
      <div className="App">
        <Terminal
          log={this.state.log}
          lastLogin={lastLogin}
          cwd={cwd}
          onEnter={this.enterCommand}
          containerRef={this.containerRef}
          inputRef={this.inputRef}
        />
        <Greeting />
      </div>
    );
  }
}

export default App;
