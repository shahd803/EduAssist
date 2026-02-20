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

        <section className="panel settings-panel">
          <div className="panel-header">
            <div>
              <h2>Help</h2>
              <p className="muted">Find quick answers about uploads, generation, and export.</p>
            </div>
          </div>

          <div className="settings-grid">
            <section className="settings-card">
              <h3>How Upload Works</h3>
              <p className="muted">Use Upload Material or drag-and-drop PDF, DOCX, or TXT files. Uploaded files appear in Your materials and can be previewed with View.</p>
            </section>
            <section className="settings-card">
              <h3>Generating Tests</h3>
              <p className="muted">Set question count, choose question types, and pick difficulty distribution. You can review and edit generated questions before export.</p>
            </section>
            <section className="settings-card">
              <h3>Export and Troubleshooting</h3>
              <p className="muted">If export fails, retry from the Export panel. For upload preview issues, refresh the page and verify your file type is supported.</p>
            </section>
            <section className="settings-card">
              <h3>Contact</h3>
              <p className="muted">Need help with a classroom workflow? Reach out to support@eduassist.local.</p>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
