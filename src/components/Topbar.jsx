function Topbar() {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">TA</span>
        <div>
          <p className="brand-title">Teacher Assist AI</p>
          <p className="brand-subtitle">Frontend-only PRD prototype</p>
        </div>
      </div>
      <nav className="topbar-actions">
        <button className="btn btn-ghost">View Materials</button>
        <button className="btn btn-primary">Upload Material</button>
      </nav>
    </header>
  )
}

export default Topbar