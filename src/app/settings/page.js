import Link from 'next/link'
import Topbar from '@/components/Topbar'
import Footer from '@/components/Footer'

export default function SettingsPage() {
  return (
    <div className="app">
      <Topbar />

      <main className="content">
        <section className="panel settings-panel">
          <div className="panel-header">
            <div>
              <h2>Settings</h2>
              <p className="muted">Customize your workspace and test generation defaults.</p>
            </div>
            <Link href="/" className="btn btn-outline">Back to Workspace</Link>
          </div>

          <div className="settings-grid">
            <section className="settings-card">
              <h3>Profile</h3>
              <label className="field">
                <span className="label">Display name</span>
                <input type="text" defaultValue="Teacher Workspace" />
              </label>
              <label className="field">
                <span className="label">School / Org</span>
                <input type="text" defaultValue="Demo Academy" />
              </label>
            </section>

            <section className="settings-card">
              <h3>Generation Defaults</h3>
              <label className="field">
                <span className="label">Default number of questions</span>
                <input type="number" min="1" max="100" step="1" defaultValue="10" />
              </label>
              <label className="field">
                <span className="label">Default difficulty mix</span>
                <select defaultValue="Even">
                  <option>Even</option>
                  <option>More Easy</option>
                  <option>More Hard</option>
                </select>
              </label>
            </section>

            <section className="settings-card">
              <h3>Notifications</h3>
              <div className="check-grid">
                <label className="checkbox">
                  <input type="checkbox" defaultChecked />
                  <span>Email when export is ready</span>
                </label>
                <label className="checkbox">
                  <input type="checkbox" defaultChecked />
                  <span>Alert on generation failure</span>
                </label>
                <label className="checkbox">
                  <input type="checkbox" />
                  <span>Weekly usage summary</span>
                </label>
              </div>
            </section>

            <section className="settings-card">
              <h3>Privacy</h3>
              <div className="check-grid">
                <label className="checkbox">
                  <input type="checkbox" defaultChecked />
                  <span>Allow anonymous quality analytics</span>
                </label>
                <label className="checkbox">
                  <input type="checkbox" />
                  <span>Store uploaded files for reuse</span>
                </label>
              </div>
            </section>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary">Save Changes</button>
            <button className="btn btn-outline">Reset</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
