import type { TerminalProfile, CursorStyle } from '../types';
import { defaultProfile } from '../defaultProfile';
import styles from './Settings.module.css';

const FONT_FAMILIES = [
  { label: 'Monaco', value: "Monaco, monospace" },
  { label: 'Menlo', value: "Menlo, monospace" },
  { label: 'Courier New', value: "'Courier New', monospace" },
  { label: 'Consolas', value: "Consolas, monospace" },
  { label: 'monospace', value: "monospace" },
];

const CURSOR_STYLES: { label: string; value: CursorStyle }[] = [
  { label: 'Block', value: 'block' },
  { label: 'Underline', value: 'underline' },
  { label: 'Bar', value: 'vertical-bar' },
];

const isDefault = (profile: TerminalProfile) =>
  JSON.stringify(profile.text) === JSON.stringify(defaultProfile.text);

type Props = {
  profiles: TerminalProfile[];
  profile: TerminalProfile;
  onChange: (profile: TerminalProfile) => void;
  onClose: () => void;
};

export const SettingsContent = ({ profiles, profile, onChange, onClose }: Props) => {
  const { text } = profile;
  const dirty = !isDefault(profile);

  const setTextField = <K extends keyof typeof text>(key: K, value: typeof text[K]) =>
    onChange({ ...profile, text: { ...text, [key]: value } });

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Settings</span>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>
      <div className={styles.panelBody}>
        <div className={styles.profileList}>
          {profiles.map(p => (
            <div
              key={p.name}
              className={`${styles.profileItem} ${p.name === profile.name ? styles.profileItemActive : ''}`}
              onClick={() => onChange(p)}
            >
              {p.name}
            </div>
          ))}
        </div>
        <div className={styles.settingsPane}>
          <div className={styles.settingsPaneHeader}>
            <span className={styles.profileName}>{profile.name}</span>
            {dirty && (
              <button
                className={styles.resetBtn}
                onClick={() => onChange({ ...defaultProfile, name: profile.name })}
              >
                Reset
              </button>
            )}
          </div>
          <div className={styles.tabs}>
            <div className={`${styles.tab} ${styles.tabActive}`}>Text</div>
          </div>
          <div className={styles.body}>
            <div className={styles.section}>
              <span className={styles.sectionLabel}>Background</span>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Color</span>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={text.background}
                  onChange={e => setTextField('background', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.section}>
              <span className={styles.sectionLabel}>Font</span>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Family</span>
                <select
                  className={styles.select}
                  value={text.font.family}
                  onChange={e => setTextField('font', { ...text.font, family: e.target.value })}
                >
                  {FONT_FAMILIES.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Size</span>
                <input
                  type="number"
                  className={styles.numberInput}
                  min={8}
                  max={24}
                  value={text.font.size}
                  onChange={e => setTextField('font', { ...text.font, size: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className={styles.section}>
              <span className={styles.sectionLabel}>Text</span>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Color</span>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={text.foreground}
                  onChange={e => setTextField('foreground', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.section}>
              <span className={styles.sectionLabel}>Cursor</span>
              <div className={styles.radioGroup}>
                {CURSOR_STYLES.map(c => (
                  <label key={c.value} className={styles.radioBtn}>
                    <input
                      type="radio"
                      name="cursorStyle"
                      value={c.value}
                      checked={text.cursorStyle === c.value}
                      onChange={() => setTextField('cursorStyle', c.value)}
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
