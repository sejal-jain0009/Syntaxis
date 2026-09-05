"use client";

import { useState } from 'react';

function Navbar({ authPath, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleNavigation(event, nextPath) {
    setIsMenuOpen(false);
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(nextPath);
  }

  const homeHref = authPath ? '/' : '#home';
  const featuresHref = authPath ? '/#features' : '#features';
  const howItWorksHref = authPath ? '/#how-it-works' : '#how-it-works';
  const primaryLinks = [
    ['Home', homeHref, '/'],
    ['Features', featuresHref, '/#features'],
    ['How It Works', howItWorksHref, '/#how-it-works'],
  ];

  return (
    <header className={`topbar ${isMenuOpen ? 'is-menu-open' : ''}`}>
      <a className="brand" href={homeHref} onClick={(event) => handleNavigation(event, '/') }>
        <span className="brand-mark">S</span>
        <span className="brand-name">syntaxis</span>
      </a>

      <button
        className="nav-menu-toggle"
        type="button"
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation"
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
      >
        <span aria-hidden="true">{isMenuOpen ? '×' : '☰'}</span>
      </button>

      <nav className="nav-links" id="primary-navigation" aria-label="Primary">
        {primaryLinks.map(([label, href, target]) => (
          <a href={href} onClick={(event) => handleNavigation(event, target)} key={label}>
            {label}
          </a>
        ))}
      </nav>

      <div className="nav-actions">
        <a href="/login" className="nav-link-btn" onClick={(event) => handleNavigation(event, '/login')}>
          Log In
        </a>
        <a href="/signup" className="nav-cta" onClick={(event) => handleNavigation(event, '/signup')}>
          Sign Up
        </a>
      </div>
    </header>
  );
}

export default Navbar;
