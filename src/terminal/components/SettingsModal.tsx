import type { TerminalProfile } from '../types';
import { SettingsContent } from './SettingsContent';
import styles from './Settings.module.css';

type Props = {
  profiles: TerminalProfile[];
  profile: TerminalProfile;
  onChange: (profile: TerminalProfile) => void;
  onClose: () => void;
};

export const SettingsModal = ({ profiles, profile, onChange, onClose }: Props) => (
  <div className={styles.modalBackdrop} onClick={onClose}>
    <div onClick={e => e.stopPropagation()}>
      <SettingsContent profiles={profiles} profile={profile} onChange={onChange} onClose={onClose} />
    </div>
  </div>
);
