import Link from 'next/link'

function SettingsFormPanel() {
  return (
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
            <input type="text" placeholder="Enter display name" />
          </label>
          <label className="field">
            <span className="label">School / Org</span>
            <input type="text" placeholder="Enter school or organization" />
          </label>
        </section>

        <section className="settings-card">
          <h3>Generation Defaults</h3>
          <label className="field">
            <span className="label">Default number of questions</span>
            <input type="number" min="1" max="100" step="1" placeholder="e.g. 20" />
          </label>
          <label className="field">
            <span className="label">Default difficulty mix</span>
            <select defaultValue="">
              <option value="" disabled>Select difficulty mix</option>
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
              <input type="checkbox" />
              <span>Email when export is ready</span>
            </label>
            <label className="checkbox">
              <input type="checkbox" />
              <span>Alert on generation failure</span>
            </label>
          </div>
        </section>

        <section className="settings-card">
          <h3>Privacy</h3>
          <div className="check-grid">
            <label className="checkbox">
              <input type="checkbox" />
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
  )
}

export default SettingsFormPanel
