function ContinueCoding({ item, onNavigate }) {
  return (
    <section className="dashboard-section" aria-labelledby="continue-title">
      <div className="section-title-row">
        <div>
          <p className="dashboard-kicker">PICK UP WHERE YOU LEFT OFF</p>
          <h2 id="continue-title">Continue Coding</h2>
        </div>
      </div>
      <article className="continue-card">
        <div className="code-preview" aria-hidden="true">
          <div className="preview-toolbar"><span></span><span></span><span></span><small>{item.fileName}</small></div>
          <div className="preview-line"><i>01</i><b>public</b> <em>int</em> twoSum()</div>
          <div className="preview-line"><i>02</i>  <span>return</span> target - nums[i];</div>
          <div className="preview-line"><i>03</i> &#125;</div>
        </div>
        <div className="continue-details">
          <div>
            <span className="language-tag">{item.language.toUpperCase()}</span>
            <h3>{item.title}</h3>
            <p>Last edited {item.lastEdited}</p>
          </div>
          <a className="dashboard-button" href="/playground?resume=1" onClick={(event) => { event.preventDefault(); onNavigate('/playground?resume=1'); }}>Continue Coding <span aria-hidden="true">-&gt;</span></a>
        </div>
      </article>
    </section>
  );
}

export default ContinueCoding;
