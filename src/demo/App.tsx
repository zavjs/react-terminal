import { useState } from 'react';
import Terminal from '../terminal';
import type { TerminalProfile, Tree } from '../terminal';
import { profiles, defaultProfileKey } from './profiles';
import { storage } from './storage';

const initialTree: Tree = {
  src: {
    type: 'dir', contents: {
      'index.ts': { type: 'file', content: `import { createServer } from './server';
import { logger } from './utils/logger';

// TODO: add graceful shutdown handler
const server = createServer({ port: 3000 });

server.on('error', (err) => {
  logger.error('Server failed to start', err);
});

server.listen(() => {
  logger.info('Server listening on port 3000');
});` },
      'server.ts': { type: 'file', content: `import http from 'http';
import { router } from './router';

// TODO: add request timeout middleware
export const createServer = (opts: { port: number }) => {
  const server = http.createServer(router);
  return server;
};` },
      'router.ts': { type: 'file', content: `import { IncomingMessage, ServerResponse } from 'http';

export const router = (req: IncomingMessage, res: ServerResponse) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('ok');
    return;
  }
  // TODO: implement proper routing
  res.writeHead(404);
  res.end('not found');
};` },
      utils: {
        type: 'dir', contents: {
          'logger.ts': { type: 'file', content: `type Level = 'info' | 'warn' | 'error';

const log = (level: Level, msg: string, data?: unknown) => {
  const entry = JSON.stringify({ level, msg, data, ts: Date.now() });
  if (level === 'error') process.stderr.write(entry + '\\n');
  else process.stdout.write(entry + '\\n');
};

export const logger = {
  info: (msg: string, data?: unknown) => log('info', msg, data),
  warn: (msg: string, data?: unknown) => log('warn', msg, data),
  error: (msg: string, data?: unknown) => log('error', msg, data),
};` },
        },
      },
    },
  },
  logs: {
    type: 'dir', contents: {
      'error.log': { type: 'file', content: `2024-03-01T08:12:03Z ERROR db connection timeout after 5000ms
2024-03-01T08:12:04Z ERROR retrying db connection (attempt 1/3)
2024-03-01T08:12:09Z ERROR retrying db connection (attempt 2/3)
2024-03-01T08:12:14Z ERROR db connection failed — max retries exceeded
2024-03-01T09:44:21Z ERROR unhandled exception in worker thread
2024-03-01T09:44:21Z ERROR TypeError: Cannot read properties of undefined` },
      'access.log': { type: 'file', content: `2024-03-01T08:00:01Z GET /health 200 2ms
2024-03-01T08:00:15Z GET /api/users 200 34ms
2024-03-01T08:01:02Z POST /api/login 401 12ms
2024-03-01T08:01:45Z GET /api/users/42 404 8ms
2024-03-01T08:03:10Z POST /api/login 200 18ms
2024-03-01T08:03:11Z GET /api/users/42 200 29ms
2024-03-01T09:44:20Z GET /api/users 500 1203ms` },
    },
  },
  'README.md': { type: 'file', content: `# demo-server

Minimal HTTP server. Try these grep commands:

  grep -rn TODO src
  grep -n error logs/error.log
  grep -in "get\\|post" logs/access.log
  grep -v 200 logs/access.log` },
};

const getKey = (profile: TerminalProfile): string =>
  Object.keys(profiles).find(k => profiles[k].name === profile.name) ?? defaultProfileKey;

const getInitialKey = (): string => {
  const urlKey = new URLSearchParams(window.location.search).get('profile');
  if (urlKey && profiles[urlKey]) return urlKey;
  return storage.getActiveProfileKey() ?? defaultProfileKey;
};

const buildProfiles = (): TerminalProfile[] => {
  const saved = storage.getSavedProfiles();
  return Object.entries(profiles).map(([key, p]) => saved[key] ?? p);
};

const setKeyInUrl = (key: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set('profile', key);
  window.history.replaceState(null, '', url.toString());
};

const App = () => {
  const [allProfiles, setAllProfiles] = useState<TerminalProfile[]>(buildProfiles);
  const [profile, setProfile] = useState<TerminalProfile>(() => {
    const key = getInitialKey();
    return allProfiles.find(p => getKey(p) === key) ?? allProfiles[0];
  });

  const handleProfileChange = (p: TerminalProfile) => {
    const key = getKey(p);
    const updatedAll = allProfiles.map(existing => existing.name === p.name ? p : existing);
    const savedProfiles = Object.fromEntries(
      updatedAll.map(pr => [getKey(pr), pr])
    );
    storage.save(key, savedProfiles);
    setKeyInUrl(key);
    setAllProfiles(updatedAll);
    setProfile(p);
  };

  return (
    <div className="app">
      <Terminal
        username="user"
        machineName="computer"
        profiles={allProfiles}
        profile={profile}
        onProfileChange={handleProfileChange}
        settingsDisplay="modal"
        initialTree={initialTree}
        tabs
      />
      <footer className="credits">
        <a href="https://github.com/zavjs/react-terminal" target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
    </div>
  );
};

export default App;
