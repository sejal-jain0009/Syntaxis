const actions = [
  ['>_', 'Start Coding', 'Write and run your code', 'primary'],
  ['◈', 'Practice Problems', 'Improve your problem-solving skills', ''],
  ['⌁', 'Debug Code', 'Find and understand errors', ''],
  ['▣', 'My Snippets', 'Access your saved code', ''],
];

function QuickActions({ onNavigate }) {
  return (
    <section className="dashboard-section" aria-labelledby="quick-actions-title">
      <div className="section-title-row">
        <div>
          <p className="dashboard-kicker">GET STARTED</p>
          <h2 id="quick-actions-title">Quick Actions</h2>
        </div>
      </div>
      <div className="quick-actions-grid">
        {actions.map(([icon, title, description, variant]) => (
          <a className={`quick-action ${variant}`} href={title === 'Start Coding' ? '/playground' : `#${title.toLowerCase().replaceAll(' ', '-')}`} onClick={title === 'Start Coding' ? (event) => { event.preventDefault(); onNavigate('/playground'); } : undefined} key={title}>
            <span className="action-icon" aria-hidden="true">{icon}</span>
            <span className="action-copy">
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <span className="action-arrow" aria-hidden="true">-&gt;</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;
