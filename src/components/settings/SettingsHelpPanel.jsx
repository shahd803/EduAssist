// Intent: Help and FAQ content for settings.
function SettingsHelpPanel() {
  return (
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
  )
}

export default SettingsHelpPanel
