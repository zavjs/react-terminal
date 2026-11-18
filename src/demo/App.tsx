import Terminal from '../terminal';

const App = () => (
  <div className="app">
    <Terminal username="user" machineName="computer" />
    <footer className="credits">
      Made by <a href="https://github.com/zavjs">H. Zavareze</a>
      {' · '}
      <a href="https://github.com/zavjs/react-terminal">GitHub</a>
    </footer>
  </div>
);

export default App;
