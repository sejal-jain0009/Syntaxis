import Sidebar from '../components/dashboard/Sidebar';
import { useProfile } from '../context/ProfileContext';
import { useSettings } from '../context/SettingsContext';
import './Dashboard.css';
import './Settings.css';

const languageOptions = ['Java', 'C++', 'C', 'Python', 'JavaScript'];

function SettingSelect({ label, value, onChange, options }) {
  return <label className="setting-control"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([optionValue, optionLabel]) => <option value={optionValue} key={optionValue}>{optionLabel}</option>)}</select></label>;
}

function SettingToggle({ label, checked, onChange, description }) {
  return <label className="setting-toggle"><span><strong>{label}</strong>{description && <small>{description}</small>}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i aria-hidden="true"></i></label>;
}

function Settings({ onNavigate }) {
  const { profile, isAuthenticated } = useProfile();
  const { settings, updateSetting } = useSettings();

  return (
    <div className="dashboard-page settings-page">
      <Sidebar onNavigate={onNavigate} activeItem="Settings" />
      <main className="dashboard-main">
        <header className="dashboard-header"><div className="dashboard-breadcrumb"><span className="breadcrumb-dot"></span><span>Settings</span></div><span className="settings-status">{isAuthenticated ? 'Account connected' : 'Guest workspace'}</span></header>
        <div className="dashboard-content">
          <section className="settings-heading" aria-labelledby="settings-title"><p className="dashboard-kicker">PREFERENCES</p><h1 id="settings-title">Settings</h1><p>Manage your Syntaxis preferences.</p></section>

          <section className="settings-section" aria-labelledby="appearance-title"><div className="settings-section-heading"><p className="dashboard-kicker">APPEARANCE</p><h2 id="appearance-title">Appearance</h2></div><div className="settings-card settings-grid"><SettingSelect label="Theme" value={settings.theme} onChange={(value) => updateSetting('theme', value)} options={[['system', 'System'], ['dark', 'Dark'], ['light', 'Light']]} /><div className="setting-control"><span>Accent</span><div className="accent-options">{[['blue', 'Light blue'], ['mint', 'Mint'], ['coral', 'Coral']].map(([value, label]) => <button className={`accent-swatch ${value} ${settings.accent === value ? 'is-selected' : ''}`} type="button" onClick={() => updateSetting('accent', value)} aria-label={label} aria-pressed={settings.accent === value} key={value}></button>)}</div></div></div></section>

          <section className="settings-section" aria-labelledby="coding-title"><div className="settings-section-heading"><p className="dashboard-kicker">EDITOR</p><h2 id="coding-title">Coding Preferences</h2></div><div className="settings-card settings-grid"><SettingSelect label="Default Programming Language" value={settings.defaultLanguage} onChange={(value) => updateSetting('defaultLanguage', value)} options={languageOptions.map((option) => [option, option])} /><SettingSelect label="Editor Font Size" value={settings.fontSize} onChange={(value) => updateSetting('fontSize', value)} options={[['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']]} /><SettingSelect label="Tab / Indentation Size" value={String(settings.tabSize)} onChange={(value) => updateSetting('tabSize', Number(value))} options={[['2', '2 spaces'], ['4', '4 spaces']]} /><SettingToggle label="Word Wrap" description="Wrap long lines in the Playground editor." checked={settings.wordWrap} onChange={(value) => updateSetting('wordWrap', value)} /><SettingToggle label="Auto Save" description="Save Playground drafts locally as you work." checked={settings.autoSave} onChange={(value) => updateSetting('autoSave', value)} /></div></section>

          <section className="settings-section" aria-labelledby="notifications-title"><div className="settings-section-heading"><p className="dashboard-kicker">REMINDERS</p><h2 id="notifications-title">Notifications</h2></div><div className="settings-card settings-grid"><SettingToggle label="Coding Reminders" description="Preference saved for the future reminder system." checked={settings.codingReminders} onChange={(value) => updateSetting('codingReminders', value)} /><SettingToggle label="Practice Reminders" description="Preference saved for the future reminder system." checked={settings.practiceReminders} onChange={(value) => updateSetting('practiceReminders', value)} /></div></section>

          <section className="settings-section" aria-labelledby="account-title"><div className="settings-section-heading"><p className="dashboard-kicker">IDENTITY</p><h2 id="account-title">Account</h2></div><div className="settings-card account-card"><dl><div><dt>Name</dt><dd>{profile.name}</dd></div><div><dt>Username</dt><dd>@{profile.username}</dd></div><div><dt>Role</dt><dd>{profile.role}</dd></div><div><dt>Email</dt><dd>{profile.email || 'Not provided'}</dd></div></dl><button className="settings-button" type="button" onClick={() => onNavigate('/profile')}>Edit Profile</button></div></section>

          <section className="settings-section" aria-labelledby="security-title"><div className="settings-section-heading"><p className="dashboard-kicker">SECURITY</p><h2 id="security-title">Security</h2></div><div className="settings-card security-card"><p>Password management will be available when secure account authentication is connected.</p><button className="settings-button" type="button" disabled>Change Password</button></div></section>

          <section className="settings-section danger-section" aria-labelledby="danger-title"><div className="settings-section-heading"><p className="dashboard-kicker">ACCOUNT ACTIONS</p><h2 id="danger-title">Danger Zone</h2></div><div className="settings-card account-card"><div><strong>Delete Account</strong><p>Account deletion will be available once account data is connected to the backend.</p></div><button className="settings-button danger-button" type="button" disabled>Delete Account</button></div></section>

        </div>
      </main>
    </div>
  );
}

export default Settings;
