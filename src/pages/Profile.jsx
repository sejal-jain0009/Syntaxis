import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import { useProfile } from '../context/ProfileContext';
import { demoDashboardData } from '../data/dashboardData';
import './Dashboard.css';
import './Profile.css';

const languageOptions = ['Java', 'Python', 'JavaScript', 'C++', 'C'];

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length > 1
    ? `${parts[0][0]}${parts.at(-1)[0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function Profile({ onNavigate }) {
  const { profile, updateProfile, isAuthenticated, logout } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [touched, setTouched] = useState({});
  const [saved, setSaved] = useState(false);
  const [logoutPrompt, setLogoutPrompt] = useState(false);

  function handleLogout() {
    logout();
    onNavigate('/');
  }

  function beginEditing() {
    setDraft(profile);
    setTouched({});
    setSaved(false);
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraft(profile);
    setTouched({});
    setIsEditing(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setDraft((currentDraft) => ({ ...currentDraft, [name]: value }));
    setSaved(false);
  }

  function handleBlur(event) {
    setTouched((currentTouched) => ({ ...currentTouched, [event.target.name]: true }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextTouched = { name: true, username: true, bio: true, primaryLanguage: true };
    setTouched(nextTouched);

    if (!isValid(draft)) {
      return;
    }

    updateProfile({
      ...draft,
      name: draft.name.trim(),
      username: draft.username.trim().replace(/^@/, ''),
      bio: draft.bio.trim(),
    });
    setIsEditing(false);
    setSaved(true);
  }

  const errors = getErrors(draft);

  return (
    <div className="dashboard-page profile-page">
      <Sidebar onNavigate={onNavigate} />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-breadcrumb">
            <span className="breadcrumb-dot"></span>
            <span>Profile</span>
          </div>
          <a className="profile-back-link" href="/dashboard" onClick={(event) => { event.preventDefault(); onNavigate('/dashboard'); }}>
            Back to Dashboard
          </a>
        </header>

        <div className="dashboard-content">
          <section className="profile-heading" aria-labelledby="profile-title">
            <p className="dashboard-kicker">YOUR IDENTITY</p>
            <h1 id="profile-title">Profile</h1>
            <p>Shape the developer profile behind your next solution.</p>
          </section>

          {saved && <p className="profile-success" role="status">Profile updated successfully.</p>}

          {isEditing ? (
            <ProfileEditor
              draft={draft}
              errors={errors}
              touched={touched}
              onChange={handleChange}
              onBlur={handleBlur}
              onSubmit={handleSubmit}
              onCancel={cancelEditing}
            />
          ) : (
            <>
              <ProfileOverview profile={profile} onEdit={beginEditing} />
              <ProfileStats />
              <DeveloperInfo language={profile.primaryLanguage} />
              <Achievements streak={demoDashboardData.stats.currentStreak} />
              {isAuthenticated && <section className="profile-account-actions" aria-labelledby="profile-account-actions-title"><p className="dashboard-kicker">ACCOUNT</p><h2 id="profile-account-actions-title">Account actions</h2><p>Sign out of this frontend session without changing your saved preferences.</p><button className="profile-logout-button" type="button" onClick={() => setLogoutPrompt(true)}>Log Out</button></section>}
            </>
          )}
        </div>
      </main>
      {logoutPrompt && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="profile-logout-title"><div className="status-modal logout-modal"><button className="modal-close" type="button" onClick={() => setLogoutPrompt(false)} aria-label="Close logout confirmation">×</button><p className="modal-kicker">ACCOUNT</p><h2 id="profile-logout-title">Log out of Syntaxis?</h2><p>You will need to log in again to access your personalized workspace.</p><div className="modal-actions"><button className="modal-secondary" type="button" onClick={() => setLogoutPrompt(false)}>Cancel</button><button className="modal-primary" type="button" onClick={handleLogout}>Logout</button></div></div></div>}
    </div>
  );
}

function ProfileOverview({ profile, onEdit }) {
  return (
    <section className="profile-overview" aria-labelledby="profile-overview-title">
      <div className="profile-avatar-large" aria-hidden="true">{getInitials(profile.name)}</div>
      <div className="profile-overview-copy">
        <p className="dashboard-kicker">DEVELOPER PROFILE</p>
        <h2 id="profile-overview-title">{profile.name}</h2>
        <p className="profile-username">@{profile.username}</p>
        <span className="role-tag">{profile.role}</span>
        <p className="profile-bio">{profile.bio}</p>
      </div>
      <button className="dashboard-button profile-edit-button" type="button" onClick={onEdit}>Edit Profile</button>
    </section>
  );
}

function ProfileStats() {
  const { problemsSolved, codeRuns, snippetsSaved, currentStreak } = demoDashboardData.stats;
  const stats = [
    ['Problems Solved', problemsSolved, 'demo value'],
    ['Code Runs', codeRuns, 'demo value'],
    ['Snippets Saved', snippetsSaved, 'demo value'],
    ['Current Streak', `${currentStreak} days`, 'demo value'],
  ];

  return (
    <section className="dashboard-section" aria-labelledby="profile-stats-title">
      <div className="section-title-row">
        <div><p className="dashboard-kicker">DEMO OVERVIEW</p><h2 id="profile-stats-title">Coding Overview</h2></div>
        <span className="demo-label">Demo data</span>
      </div>
      <div className="profile-stats-grid">
        {stats.map(([label, value, note]) => <article className="profile-stat" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}
      </div>
    </section>
  );
}

function DeveloperInfo({ language }) {
  return (
    <section className="dashboard-section developer-info" aria-labelledby="developer-info-title">
      <p className="dashboard-kicker">CODING PROFILE</p>
      <h2 id="developer-info-title">Developer Information</h2>
      <div className="developer-info-row"><span>Primary Language</span><strong>{language}</strong></div>
    </section>
  );
}

function Achievements({ streak }) {
  return (
    <section className="dashboard-section" aria-labelledby="achievements-title">
      <div className="section-title-row"><div><p className="dashboard-kicker">MILESTONES</p><h2 id="achievements-title">Achievements</h2></div><span className="demo-label">Demo data</span></div>
      <div className="achievement-list">
        <div><span className="achievement-mark">01</span><span><strong>First Problem Solved</strong><small>Keep building momentum</small></span></div>
        <div><span className="achievement-mark">{streak}</span><span><strong>{streak} Day Streak</strong><small>Consistency compounds</small></span></div>
        <div><span className="achievement-mark">25</span><span><strong>25 Problems Solved</strong><small>A strong foundation</small></span></div>
      </div>
    </section>
  );
}

function ProfileEditor({ draft, errors, touched, onChange, onBlur, onSubmit, onCancel }) {
  return (
    <form className="profile-editor" onSubmit={onSubmit} noValidate>
      <div className="editor-heading"><div><p className="dashboard-kicker">EDIT DETAILS</p><h2>Edit Profile</h2></div><div className="profile-avatar-large small" aria-hidden="true">{getInitials(draft.name)}</div></div>
      <div className="profile-form-grid">
        <ProfileField label="Full Name" name="name" value={draft.name} error={touched.name && errors.name} onChange={onChange} onBlur={onBlur} placeholder="Sejal Sharma" />
        <ProfileField label="Username" name="username" value={draft.username} error={touched.username && errors.username} onChange={onChange} onBlur={onBlur} placeholder="sejal" />
        <div className="profile-field full-width"><label htmlFor="bio">Bio</label><textarea id="bio" name="bio" value={draft.bio} maxLength="120" onChange={onChange} onBlur={onBlur} placeholder="Building, learning, and solving one problem at a time." rows="3" />{touched.bio && errors.bio && <p className="profile-field-error">{errors.bio}</p>}<small className="character-count">{draft.bio.length}/120</small></div>
        <div className="profile-field"><label htmlFor="primaryLanguage">Primary Programming Language</label><select id="primaryLanguage" name="primaryLanguage" value={draft.primaryLanguage} onChange={onChange} onBlur={onBlur} aria-invalid={Boolean(touched.primaryLanguage && errors.primaryLanguage)}><option value="">Choose a language</option>{languageOptions.map((language) => <option value={language} key={language}>{language}</option>)}</select>{touched.primaryLanguage && errors.primaryLanguage && <p className="profile-field-error">{errors.primaryLanguage}</p>}</div>
      </div>
      <div className="profile-editor-actions"><button className="dashboard-button profile-cancel" type="button" onClick={onCancel}>Cancel</button><button className="auth-submit profile-save" type="submit">Save Changes <span aria-hidden="true">-&gt;</span></button></div>
    </form>
  );
}

function ProfileField({ label, name, value, error, onChange, onBlur, placeholder }) {
  return <div className="profile-field"><label htmlFor={name}>{label}</label><input id={name} name={name} value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} aria-invalid={Boolean(error)} />{error && <p className="profile-field-error">{error}</p>}</div>;
}

function getErrors(profile) {
  return {
    name: profile.name.trim() ? '' : 'Name is required.',
    username: /^[A-Za-z0-9_]{3,20}$/.test(profile.username.trim().replace(/^@/, '')) ? '' : 'Use 3-20 letters, numbers, or underscores.',
    bio: profile.bio.length <= 120 ? '' : 'Bio must be 120 characters or fewer.',
    primaryLanguage: languageOptions.includes(profile.primaryLanguage) ? '' : 'Choose a programming language.',
  };
}

function isValid(profile) {
  return !Object.values(getErrors(profile)).some(Boolean);
}

export default Profile;
