function DailyGoal({ goal, streak }) {
  const progress = Math.round((goal.completed / goal.target) * 100);
  const remaining = goal.target - goal.completed;

  return (
    <section className="daily-goal" aria-labelledby="daily-goal-title">
      <div className="daily-goal-heading">
        <div>
          <p className="dashboard-kicker">TODAY&apos;S FOCUS</p>
          <h2 id="daily-goal-title">Daily Coding Goal</h2>
        </div>
        <span className="goal-count">{goal.completed} / {goal.target}</span>
      </div>
      <div className="goal-progress" aria-label={`${progress}% of today's coding goal complete`}>
        <span style={{ width: `${progress}%` }}></span>
      </div>
      <div className="daily-goal-footer">
        <span>{remaining ? `${remaining} more to reach today's goal.` : 'Goal complete for today.'}</span>
        <strong>{streak} day streak</strong>
      </div>
    </section>
  );
}

export default DailyGoal;
