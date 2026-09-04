function RecentActivity({ activity }) {
  return (
    <section className="dashboard-section activity-section" aria-labelledby="activity-title">
      <div className="section-title-row">
        <div>
          <p className="dashboard-kicker">YOUR TRAIL</p>
          <h2 id="activity-title">Recent Activity</h2>
        </div>
        <span className="activity-live">Live</span>
      </div>
      <div className="activity-list">
        {activity.map(({ icon, label, time }) => (
          <div className="activity-row" key={label}>
            <span className="activity-icon" aria-hidden="true">{icon}</span>
            <span>{label}</span>
            <time>{time}</time>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentActivity;
