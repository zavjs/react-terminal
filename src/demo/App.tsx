import { useState } from 'react';
import Terminal from '../terminal';
import type { TerminalProfile } from '../terminal';
import { profiles, defaultProfileKey } from './profiles';

const getProfileFromUrl = (): TerminalProfile => {
  const key = new URLSearchParams(window.location.search).get('profile') ?? defaultProfileKey;
  return profiles[key] ?? profiles[defaultProfileKey];
};

const setProfileInUrl = (profile: TerminalProfile) => {
  const key = Object.keys(profiles).find(k => profiles[k].name === profile.name) ?? defaultProfileKey;
  const url = new URL(window.location.href);
  url.searchParams.set('profile', key);
  window.history.replaceState(null, '', url.toString());
};

const App = () => {
  const [profile, setProfile] = useState<TerminalProfile>(getProfileFromUrl);

  const handleProfileChange = (p: TerminalProfile) => {
    setProfile(p);
    setProfileInUrl(p);
  };

  return (
    <div className="app">
      <Terminal
        username="user"
        machineName="computer"
        profiles={Object.values(profiles)}
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
