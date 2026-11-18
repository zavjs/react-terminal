import Terminal from '../terminal';

const App = () => (
  <div className="app">
    <Terminal username="user" machineName="computer" />
    <footer className="credits">
      <a href="https://github.com/zavjs/react-terminal" target="_blank" rel="noopener noreferrer">GitHub</a>
    </footer>
  </div>
);

export default App;
