import Link from 'next/link'

function Topbar() {
  return (
    <header className="topbar">
      <div className="brand">
        <Link href="/" className="brand-mark">EA</Link>
        <div>
          <p className="brand-title">EduAssist</p>
          <p className="brand-subtitle">Generate Tests</p>
        </div>
      </div>
      <nav className="topbar-actions">
        <Link href="/settings" className="btn btn-ghost">Settings</Link>
        <button className="btn btn-ghost">Help</button>
      </nav>
    </header>
  )
}

export default Topbar
