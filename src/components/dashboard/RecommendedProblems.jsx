function RecommendedProblems({ problems }) {
  return (
    <section className="dashboard-section" aria-labelledby="problems-title">
      <div className="section-title-row">
        <div>
          <p className="dashboard-kicker">KEEP PRACTICING</p>
          <h2 id="problems-title">Recommended Problems</h2>
        </div>
        <a className="text-link" href="#practice">View all <span aria-hidden="true">-&gt;</span></a>
      </div>
      <div className="problem-list">
        {problems.map(({ name, difficulty, topic }) => (
          <article className="problem-row" key={name}>
            <span className="problem-bullet" aria-hidden="true">&lt;/&gt;</span>
            <div className="problem-copy"><h3>{name}</h3><span>{topic}</span></div>
            <span className={`difficulty ${difficulty.toLowerCase()}`}>{difficulty}</span>
            <a className="solve-link" href={`#solve-${name.toLowerCase().replaceAll(' ', '-')}`}>Solve <span aria-hidden="true">-&gt;</span></a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RecommendedProblems;
