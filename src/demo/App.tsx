import { useState } from 'react';
import Terminal from '../terminal';
import type { TerminalProfile } from '../terminal';
import { profiles, defaultProfileKey } from './profiles';
import { storage } from './storage';

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
      />
      <footer className="credits">
        <a href="https://github.com/zavjs/react-terminal" target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
    </div>
  );
};

export default App;
