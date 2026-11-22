import type { TerminalProfile } from '../types';
import { SettingsContent } from './SettingsContent';
import styles from './Settings.module.css';

type Props = {
  open: boolean;
  profiles: TerminalProfile[];
  profile: TerminalProfile;
  onChange: (profile: TerminalProfile) => void;
  onClose: () => void;
};

export const SettingsDrawer = ({ open, profiles, profile, onChange, onClose }: Props) => (
  <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
    <div className={styles.drawerPanel}>
      <SettingsContent profiles={profiles} profile={profile} onChange={onChange} onClose={onClose} />
    </div>
  </div>
);
