function Topbar() {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">EA</span>
        <div>
          <p className="brand-title">EduAssist</p>
          <p className="brand-subtitle">Generate Tests</p>
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