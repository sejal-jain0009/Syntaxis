import { useState } from 'react';

const primaryLinks = [
  ['⌂', 'Dashboard', '/dashboard'],
  ['⌨', 'Playground', '/dashboard#playground'],
  ['◈', 'Practice', '/dashboard#practice'],
  ['⌁', 'Code Analyzer', '/dashboard#analyzer'],
  ['▣', 'Snippets', '/dashboard#snippets'],
  ['▤', 'History', '/dashboard#history'],
];

function Sidebar({ onNavigate, activeItem = 'Dashboard' }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleHome(event) {
    event.preventDefault();
    onNavigate('/');
  }

  function handleProfile(event) {
    event.preventDefault();
    onNavigate('/profile');
  }

  function handleWorkspaceLink(event, href) {
    if (href === '/dashboard#playground') {
      event.preventDefault();
      onNavigate('/playground');
    }
  }

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className="dashboard-sidebar-top">
        <a className="dashboard-brand" href="/" onClick={handleHome} aria-label="Syntaxis home">
          <span className="brand-mark">S</span>
          <span className="brand-name">syntaxis</span>
        </a>
        <button className="sidebar-toggle" type="button" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen} aria-controls="dashboard-navigation">
          <span aria-hidden="true">{isOpen ? '×' : '☰'}</span>
          <span className="sr-only">{isOpen ? 'Close' : 'Open'} dashboard navigation</span>
        </button>
      </div>

      <nav className="sidebar-nav" id="dashboard-navigation" aria-label="Dashboard navigation">
        <p className="sidebar-label">WORKSPACE</p>
        {primaryLinks.map(([icon, label, href]) => (
          <a className={`sidebar-link ${label === activeItem ? 'is-active' : ''}`} href={label === 'Playground' ? '/playground' : href} onClick={(event) => handleWorkspaceLink(event, href)} key={label}>
            <span className="sidebar-icon" aria-hidden="true">{icon}</span>
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <nav className="sidebar-footer" aria-label="Account navigation">
        <a className={`sidebar-link ${activeItem === 'Settings' ? 'is-active' : ''}`} href="/settings" onClick={(event) => { event.preventDefault(); onNavigate('/settings'); }}>
          <span className="sidebar-icon" aria-hidden="true">⚙</span>
          <span>Settings</span>
        </a>
        <a className="sidebar-link" href="/profile" onClick={handleProfile}>
          <span className="sidebar-icon" aria-hidden="true">●</span>
          <span>Profile</span>
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
