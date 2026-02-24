// Intent: Hero copy and highlights for the landing experience.
function Hero() {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">Teacher Workspace</p>
        <h1>Generate editable tests from your teaching materials in minutes.</h1>
        <p className="hero-copy">
          Upload your source content, and generate
          multiple-choice, short-answer, and true/false assessments with full editing control.
        </p>
        <div className="hero-metrics">
          <div>
            <p className="metric-value">10 MB</p>
            <p className="metric-label">Max file size</p>
          </div>
          <div>
            <p className="metric-value">3</p>
            <p className="metric-label">Question types</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
