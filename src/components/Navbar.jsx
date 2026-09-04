"use client";

function Navbar({ authPath, onNavigate }) {
  function handleNavigation(event, nextPath) {
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
    <header className="topbar">
      <a className="brand" href={homeHref} onClick={(event) => handleNavigation(event, '/') }>
        <span className="brand-mark">S</span>
        <span className="brand-name">syntaxis</span>
      </a>

      <nav className="nav-links" aria-label="Primary">
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
