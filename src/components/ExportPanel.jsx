function ExportPanel() {
  return (
    <section className="panel export-panel">
      <div>
        <h2>Export</h2>
        <p className="muted">Download PDF with questions and answer key.</p>
      </div>
      <div className="export-actions">
        <button className="btn btn-primary">Download PDF</button>
      </div>
      <div className="export-error">
        <p>Export failed: Unable to generate PDF. Please try again.</p>
      </div>
    </section>
  )
}

export default ExportPanel