import Topbar from '@/components/Topbar'
import Footer from '@/components/Footer'

export default function MyTestsPage() {
  return (
    <div className="app">
      <Topbar />

      <main className="content">
        <section className="panel settings-panel">
          <div className="panel-header">
            <div>
              <h2>My Tests</h2>
              <p className="muted">View, filter, and manage all generated assessments.</p>
            </div>
            <div className="button-stack">
              <button className="btn btn-outline">Import</button>
              <button className="btn btn-primary">Create New Test</button>
            </div>
          </div>

          <div className="settings-grid">
            <section className="settings-card">
              <h3>Filters</h3>
              <label className="field">
                <span className="label">Search by title</span>
                <input type="text" placeholder="e.g. Unit 3 Quiz" />
              </label>
              <label className="field">
                <span className="label">Status</span>
                <select defaultValue="">
                  <option value="" disabled>Select status</option>
                  <option>Draft</option>
                  <option>Published</option>
                  <option>Archived</option>
                </select>
              </label>
              <label className="field">
                <span className="label">Sort by</span>
                <select defaultValue="">
                  <option value="" disabled>Select sort</option>
                  <option>Most recent</option>
                  <option>Oldest</option>
                  <option>Title A-Z</option>
                </select>
              </label>
            </section>

            <section className="settings-card">
              <h3>Summary</h3>
              <div className="detail-row">
                <span className="label">Total tests</span>
                <span>0</span>
              </div>
              <div className="detail-row">
                <span className="label">Drafts</span>
                <span>0</span>
              </div>
              <div className="detail-row">
                <span className="label">Published</span>
                <span>0</span>
              </div>
            </section>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Test Library</h2>
              <p className="muted">Your saved tests will appear here.</p>
            </div>
          </div>

          <div className="material-row">
            <p className="label">Title</p>
            <p className="label">Status</p>
            <p className="label">Questions</p>
            <p className="label">Updated</p>
            <p className="label">Actions</p>
          </div>

          <div className="empty-state">
            <p>No tests available yet. Generate a test to populate this page.</p>
            <button className="btn btn-primary">Go to Generator</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
