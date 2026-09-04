function StatsCards({ stats }) {
  const cards = [
    ['Problems Solved', stats.problemsSolved, 'this month'],
    ['Code Runs', stats.codeRuns, 'all time'],
    ['Snippets Saved', stats.snippetsSaved, 'in your library'],
    ['Current Streak', stats.currentStreak, 'days'],
  ];

  return (
    <section className="dashboard-section" aria-labelledby="progress-title">
      <div className="section-title-row">
        <div>
          <p className="dashboard-kicker">OVERVIEW</p>
          <h2 id="progress-title">Your Progress</h2>
        </div>
        <span className="demo-label">Demo data</span>
      </div>
      <div className="stats-grid">
        {cards.map(([label, value, note]) => (
          <article className="stat-card" key={label}>
            <div className="stat-card-top">
              <span>{label}</span>
              <span className="stat-trend" aria-hidden="true">↗</span>
            </div>
            <strong>{value}</strong>
            <small>{note}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

export default StatsCards;
